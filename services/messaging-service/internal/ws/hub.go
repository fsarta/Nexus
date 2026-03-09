package ws

import (
	"encoding/json"
	"sync"

	"github.com/gorilla/websocket"
	"go.uber.org/zap"
)

// Hub manages WebSocket connections and message broadcasting
type Hub struct {
	// Map of user/entity ID → set of connections
	clients map[string]map[*Client]bool
	mu      sync.RWMutex
	logger  *zap.Logger
}

// Client represents a single WebSocket connection
type Client struct {
	UserID string
	Conn   *websocket.Conn
	Send   chan []byte
}

// NewHub creates a new WebSocket hub
func NewHub(logger *zap.Logger) *Hub {
	return &Hub{
		clients: make(map[string]map[*Client]bool),
		logger:  logger,
	}
}

// Register adds a client connection
func (h *Hub) Register(client *Client) {
	h.mu.Lock()
	defer h.mu.Unlock()

	if h.clients[client.UserID] == nil {
		h.clients[client.UserID] = make(map[*Client]bool)
	}
	h.clients[client.UserID][client] = true

	h.logger.Debug("Client connected",
		zap.String("user_id", client.UserID),
		zap.Int("total_connections", len(h.clients[client.UserID])),
	)
}

// Unregister removes a client connection
func (h *Hub) Unregister(client *Client) {
	h.mu.Lock()
	defer h.mu.Unlock()

	if clients, ok := h.clients[client.UserID]; ok {
		delete(clients, client)
		if len(clients) == 0 {
			delete(h.clients, client.UserID)
		}
	}
	close(client.Send)

	h.logger.Debug("Client disconnected", zap.String("user_id", client.UserID))
}

// SendToUser sends an event to all connections for a given user/entity ID
func (h *Hub) SendToUser(userID string, event interface{}) {
	h.mu.RLock()
	clients, ok := h.clients[userID]
	h.mu.RUnlock()

	if !ok {
		return // user not connected
	}

	data, err := json.Marshal(event)
	if err != nil {
		h.logger.Error("Failed to marshal WebSocket event", zap.Error(err))
		return
	}

	for client := range clients {
		select {
		case client.Send <- data:
		default:
			// Channel full, remove slow client
			h.Unregister(client)
		}
	}
}

// IsOnline checks if a user has any active connections
func (h *Hub) IsOnline(userID string) bool {
	h.mu.RLock()
	defer h.mu.RUnlock()
	clients, ok := h.clients[userID]
	return ok && len(clients) > 0
}

// WritePump pumps messages from the hub to the WebSocket connection
func WritePump(client *Client) {
	defer client.Conn.Close()

	for message := range client.Send {
		if err := client.Conn.WriteMessage(websocket.TextMessage, message); err != nil {
			return
		}
	}
}

// ReadPump pumps messages from the WebSocket connection to the hub
func ReadPump(client *Client, hub *Hub, onMessage func(client *Client, data []byte)) {
	defer func() {
		hub.Unregister(client)
		client.Conn.Close()
	}()

	for {
		_, message, err := client.Conn.ReadMessage()
		if err != nil {
			break
		}
		if onMessage != nil {
			onMessage(client, message)
		}
	}
}
