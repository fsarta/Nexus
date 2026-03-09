package handler

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"go.uber.org/zap"

	"github.com/nexus-platform/messaging-service/internal/model"
	"github.com/nexus-platform/messaging-service/internal/usecase"
	"github.com/nexus-platform/messaging-service/internal/ws"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // tighten in production
	},
}

// MessagingHandler handles messaging HTTP endpoints
type MessagingHandler struct {
	msgUC  *usecase.MessagingUseCase
	hub    *ws.Hub
	logger *zap.Logger
}

func NewMessagingHandler(msgUC *usecase.MessagingUseCase, hub *ws.Hub, logger *zap.Logger) *MessagingHandler {
	return &MessagingHandler{msgUC: msgUC, hub: hub, logger: logger}
}

// ── Conversations ──────────────────────────────

// CreateConversation starts a new DM or group conversation
// POST /api/v1/messages/conversations
func (h *MessagingHandler) CreateConversation(c *gin.Context) {
	senderType, senderID, senderName, senderAvatar, ok := extractSender(c)
	if !ok {
		return
	}

	var req model.CreateConversationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Error: "Invalid request body", Code: "VALIDATION_ERROR", Details: err.Error(),
		})
		return
	}

	conv, err := h.msgUC.CreateOrGetConversation(c.Request.Context(), senderType, senderID, senderName, senderAvatar, &req)
	if err != nil {
		h.logger.Warn("Failed to create conversation", zap.Error(err))
		c.JSON(http.StatusInternalServerError, model.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, conv)
}

// GetInbox returns the user's conversations (inbox)
// GET /api/v1/messages/conversations
func (h *MessagingHandler) GetInbox(c *gin.Context) {
	senderType, senderID, _, _, ok := extractSender(c)
	if !ok {
		return
	}

	inbox, err := h.msgUC.GetInbox(c.Request.Context(), senderType, senderID, 30)
	if err != nil {
		c.JSON(http.StatusInternalServerError, model.ErrorResponse{Error: "Failed to load inbox"})
		return
	}

	c.JSON(http.StatusOK, inbox)
}

// ── Messages ───────────────────────────────────

// SendMessage sends a message to a conversation
// POST /api/v1/messages/conversations/:id/messages
func (h *MessagingHandler) SendMessage(c *gin.Context) {
	convID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{Error: "Invalid conversation ID"})
		return
	}

	senderType, senderID, senderName, senderAvatar, ok := extractSender(c)
	if !ok {
		return
	}

	var req model.SendMessageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Error: "Invalid request body", Code: "VALIDATION_ERROR", Details: err.Error(),
		})
		return
	}

	msg, err := h.msgUC.SendMessage(c.Request.Context(), convID, senderType, senderID, senderName, senderAvatar, &req)
	if err != nil {
		c.JSON(http.StatusForbidden, model.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, msg)
}

// GetMessages returns paginated messages for a conversation
// GET /api/v1/messages/conversations/:id/messages
func (h *MessagingHandler) GetMessages(c *gin.Context) {
	convID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{Error: "Invalid conversation ID"})
		return
	}

	senderType, senderID, _, _, ok := extractSender(c)
	if !ok {
		return
	}

	var beforeID *uuid.UUID
	if before := c.Query("before"); before != "" {
		id, err := uuid.Parse(before)
		if err == nil {
			beforeID = &id
		}
	}

	result, err := h.msgUC.GetMessages(c.Request.Context(), convID, senderType, senderID, 50, beforeID)
	if err != nil {
		c.JSON(http.StatusForbidden, model.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}

// MarkRead marks messages as read in a conversation
// POST /api/v1/messages/conversations/:id/read
func (h *MessagingHandler) MarkRead(c *gin.Context) {
	convID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{Error: "Invalid conversation ID"})
		return
	}

	senderType, senderID, _, _, ok := extractSender(c)
	if !ok {
		return
	}

	var req model.MarkReadRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{Error: "Invalid request"})
		return
	}

	if err := h.msgUC.MarkRead(c.Request.Context(), convID, senderType, senderID, req.LastReadMessageID); err != nil {
		c.JSON(http.StatusInternalServerError, model.ErrorResponse{Error: "Failed to mark read"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

// DeleteMessage soft-deletes a message
// DELETE /api/v1/messages/:messageId
func (h *MessagingHandler) DeleteMessage(c *gin.Context) {
	msgID, err := uuid.Parse(c.Param("messageId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{Error: "Invalid message ID"})
		return
	}

	senderType, senderID, _, _, ok := extractSender(c)
	if !ok {
		return
	}

	if err := h.msgUC.DeleteMessage(c.Request.Context(), msgID, senderType, senderID); err != nil {
		c.JSON(http.StatusForbidden, model.ErrorResponse{Error: "Cannot delete this message"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "deleted"})
}

// EditMessage edits a message's content
// PUT /api/v1/messages/:messageId
func (h *MessagingHandler) EditMessage(c *gin.Context) {
	msgID, err := uuid.Parse(c.Param("messageId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{Error: "Invalid message ID"})
		return
	}

	senderType, senderID, _, _, ok := extractSender(c)
	if !ok {
		return
	}

	var req model.EditMessageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{Error: "Invalid request"})
		return
	}

	if err := h.msgUC.EditMessage(c.Request.Context(), msgID, senderType, senderID, req.Content); err != nil {
		c.JSON(http.StatusForbidden, model.ErrorResponse{Error: "Cannot edit this message"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "edited"})
}

// ── WebSocket ──────────────────────────────────

// HandleWebSocket upgrades HTTP to WebSocket for real-time messaging
// GET /api/v1/messages/ws
func (h *MessagingHandler) HandleWebSocket(c *gin.Context) {
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, model.ErrorResponse{Error: "Unauthorized"})
		return
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		h.logger.Error("WebSocket upgrade failed", zap.Error(err))
		return
	}

	client := &ws.Client{
		UserID: userID,
		Conn:   conn,
		Send:   make(chan []byte, 256),
	}

	h.hub.Register(client)

	// Start pumps
	go ws.WritePump(client)
	go ws.ReadPump(client, h.hub, func(cl *ws.Client, data []byte) {
		// Handle incoming WebSocket messages (typing indicators, etc.)
		var event model.WSEvent
		if err := json.Unmarshal(data, &event); err != nil {
			return
		}

		switch event.Type {
		case "typing.start", "typing.stop":
			// Broadcast typing indicator to conversation participants
			if payload, ok := event.Payload.(map[string]interface{}); ok {
				if convIDStr, ok := payload["conversation_id"].(string); ok {
					convID, err := uuid.Parse(convIDStr)
					if err == nil {
						participants, _ := h.msgUC.(*usecase.MessagingUseCase).GetMessages(
							c.Request.Context(), convID,
							model.ParticipantUser, uuid.MustParse(cl.UserID),
							0, nil,
						)
						_ = participants // typing broadcast simplified
					}
				}
			}
		}
	})
}

// ── Helpers ────────────────────────────────────

// extractSender gets the authenticated sender info from Gin context
func extractSender(c *gin.Context) (model.ParticipantType, uuid.UUID, string, *string, bool) {
	userIDStr := c.GetString("user_id")
	if userIDStr == "" {
		c.JSON(http.StatusUnauthorized, model.ErrorResponse{Error: "Unauthorized", Code: "UNAUTHORIZED"})
		return "", uuid.Nil, "", nil, false
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{Error: "Invalid user ID"})
		return "", uuid.Nil, "", nil, false
	}

	// Determine if acting as user or company
	actAsType := model.ParticipantType(c.GetHeader("X-Act-As-Type"))
	if actAsType == "" {
		actAsType = model.ParticipantUser
	}

	// For company messages, the user must have permission (simplified here)
	actAsID := userID
	if actAsType == model.ParticipantCompany {
		companyIDStr := c.GetHeader("X-Act-As-ID")
		if companyIDStr != "" {
			if cID, err := uuid.Parse(companyIDStr); err == nil {
				actAsID = cID
			}
		}
	}

	senderName := c.GetString("user_name")
	if senderName == "" {
		senderName = "User"
	}

	return actAsType, actAsID, senderName, nil, true
}
