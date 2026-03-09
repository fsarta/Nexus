package model

import (
	"github.com/google/uuid"
)

// ── Request DTOs ───────────────────────────────

// CreateConversationRequest starts a new DM or group conversation
type CreateConversationRequest struct {
	// Participants to add (minimum 1 other participant for direct)
	Participants []ParticipantRef `json:"participants" binding:"required,min=1"`
	// Optional: initial message
	InitialMessage *string `json:"initial_message,omitempty"`
	// Optional: group title (required for group conversations)
	Title *string `json:"title,omitempty"`
}

// ParticipantRef identifies a participant to add
type ParticipantRef struct {
	Type        ParticipantType `json:"type" binding:"required,oneof=user company"`
	ID          uuid.UUID       `json:"id" binding:"required"`
	DisplayName string          `json:"display_name" binding:"required"`
	AvatarURL   *string         `json:"avatar_url,omitempty"`
}

// SendMessageRequest sends a message to a conversation
type SendMessageRequest struct {
	Content       *string        `json:"content,omitempty"`
	MessageType   MessageType    `json:"message_type" binding:"required,oneof=text image file video audio card"`
	MediaURL      *string        `json:"media_url,omitempty"`
	MediaMimeType *string        `json:"media_mime_type,omitempty"`
	MediaSize     *int64         `json:"media_size,omitempty"`
	MediaFilename *string        `json:"media_filename,omitempty"`
	CardData      map[string]any `json:"card_data,omitempty"`
	ReplyToID     *uuid.UUID     `json:"reply_to_id,omitempty"`
}

// EditMessageRequest updates a message's content
type EditMessageRequest struct {
	Content string `json:"content" binding:"required"`
}

// MarkReadRequest marks messages as read up to a point
type MarkReadRequest struct {
	LastReadMessageID uuid.UUID `json:"last_read_message_id" binding:"required"`
}

// ── Response DTOs ──────────────────────────────

// ConversationListResponse is the inbox view
type ConversationListResponse struct {
	Conversations []ConversationSummary `json:"conversations"`
	TotalUnread   int                   `json:"total_unread"`
	HasMore       bool                  `json:"has_more"`
	Cursor        *string               `json:"cursor,omitempty"`
}

// ConversationSummary is a compact conversation for list views
type ConversationSummary struct {
	ID                uuid.UUID              `json:"id"`
	Type              ConversationType       `json:"type"`
	Title             *string                `json:"title,omitempty"`
	Participants      []ParticipantSummary   `json:"participants"`
	LastMessage       *MessagePreview        `json:"last_message,omitempty"`
	UnreadCount       int                    `json:"unread_count"`
	IsPinned          bool                   `json:"is_pinned"`
	IsMuted           bool                   `json:"is_muted"`
	UpdatedAt         string                 `json:"updated_at"`
}

// ParticipantSummary is a compact participant for list views
type ParticipantSummary struct {
	Type        ParticipantType `json:"type"`
	ID          uuid.UUID       `json:"id"`
	DisplayName string          `json:"display_name"`
	AvatarURL   *string         `json:"avatar_url,omitempty"`
	IsOnline    bool            `json:"is_online"`
}

// MessagePreview is a compact message for conversation lists
type MessagePreview struct {
	Content    string `json:"content"`
	SenderName string `json:"sender_name"`
	Timestamp  string `json:"timestamp"`
	Type       string `json:"type"`
}

// MessageListResponse is paginated messages in a conversation
type MessageListResponse struct {
	Messages []Message `json:"messages"`
	HasMore  bool      `json:"has_more"`
	Cursor   *string   `json:"cursor,omitempty"`
}

// ErrorResponse matches user-service format
type ErrorResponse struct {
	Error   string `json:"error"`
	Code    string `json:"code,omitempty"`
	Details string `json:"details,omitempty"`
}

// ── WebSocket Events ───────────────────────────

// WSEvent is a real-time event sent over WebSocket
type WSEvent struct {
	Type    string      `json:"type"`    // "message.new", "message.read", "typing.start", "typing.stop"
	Payload interface{} `json:"payload"`
}

// TypingEvent indicates a user is typing
type TypingEvent struct {
	ConversationID uuid.UUID       `json:"conversation_id"`
	SenderType     ParticipantType `json:"sender_type"`
	SenderID       uuid.UUID       `json:"sender_id"`
	SenderName     string          `json:"sender_name"`
}
