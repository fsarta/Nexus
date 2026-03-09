package model

import (
	"time"

	"github.com/google/uuid"
)

// ParticipantType indicates whether a participant is a user or company
type ParticipantType string

const (
	ParticipantUser    ParticipantType = "user"
	ParticipantCompany ParticipantType = "company"
)

// ConversationType indicates the conversation mode
type ConversationType string

const (
	ConversationDirect ConversationType = "direct"
	ConversationGroup  ConversationType = "group"
)

// MessageType indicates the message content type
type MessageType string

const (
	MessageText   MessageType = "text"
	MessageImage  MessageType = "image"
	MessageFile   MessageType = "file"
	MessageVideo  MessageType = "video"
	MessageAudio  MessageType = "audio"
	MessageSystem MessageType = "system"
	MessageCard   MessageType = "card"
)

// Conversation represents a messaging thread
type Conversation struct {
	ID                uuid.UUID        `json:"id" db:"id"`
	Type              ConversationType `json:"type" db:"type"`
	Title             *string          `json:"title,omitempty" db:"title"`
	AvatarURL         *string          `json:"avatar_url,omitempty" db:"avatar_url"`
	CreatedByType     ParticipantType  `json:"created_by_type" db:"created_by_type"`
	CreatedByID       uuid.UUID        `json:"created_by_id" db:"created_by_id"`
	LastMessageID     *uuid.UUID       `json:"last_message_id,omitempty" db:"last_message_id"`
	LastMessageText   *string          `json:"last_message_text,omitempty" db:"last_message_text"`
	LastMessageAt     *time.Time       `json:"last_message_at,omitempty" db:"last_message_at"`
	LastMessageSender *string          `json:"last_message_sender,omitempty" db:"last_message_sender"`
	MessageCount      int              `json:"message_count" db:"message_count"`
	IsArchived        bool             `json:"is_archived" db:"is_archived"`
	CreatedAt         time.Time        `json:"created_at" db:"created_at"`
	UpdatedAt         time.Time        `json:"updated_at" db:"updated_at"`

	// Joined fields (not in DB)
	Participants []ConversationParticipant `json:"participants,omitempty"`
	UnreadCount  int                      `json:"unread_count,omitempty"`
}

// ConversationParticipant represents a member of a conversation
type ConversationParticipant struct {
	ID                  uuid.UUID       `json:"id" db:"id"`
	ConversationID      uuid.UUID       `json:"conversation_id" db:"conversation_id"`
	ParticipantType     ParticipantType `json:"participant_type" db:"participant_type"`
	ParticipantID       uuid.UUID       `json:"participant_id" db:"participant_id"`
	DisplayName         string          `json:"display_name" db:"display_name"`
	AvatarURL           *string         `json:"avatar_url,omitempty" db:"avatar_url"`
	LastReadAt          *time.Time      `json:"last_read_at,omitempty" db:"last_read_at"`
	LastReadMessageID   *uuid.UUID      `json:"last_read_message_id,omitempty" db:"last_read_message_id"`
	UnreadCount         int             `json:"unread_count" db:"unread_count"`
	IsMuted             bool            `json:"is_muted" db:"is_muted"`
	IsPinned            bool            `json:"is_pinned" db:"is_pinned"`
	Notifications       string          `json:"notifications" db:"notifications"`
	JoinedAt            time.Time       `json:"joined_at" db:"joined_at"`
	LeftAt              *time.Time      `json:"left_at,omitempty" db:"left_at"`
}

// Message represents a single message in a conversation
type Message struct {
	ID              uuid.UUID       `json:"id" db:"id"`
	ConversationID  uuid.UUID       `json:"conversation_id" db:"conversation_id"`
	SenderType      ParticipantType `json:"sender_type" db:"sender_type"`
	SenderID        uuid.UUID       `json:"sender_id" db:"sender_id"`
	SenderName      string          `json:"sender_name" db:"sender_name"`
	SenderAvatar    *string         `json:"sender_avatar,omitempty" db:"sender_avatar"`
	MessageType     MessageType     `json:"message_type" db:"message_type"`
	Content         *string         `json:"content,omitempty" db:"content"`
	MediaURL        *string         `json:"media_url,omitempty" db:"media_url"`
	MediaMimeType   *string         `json:"media_mime_type,omitempty" db:"media_mime_type"`
	MediaSize       *int64          `json:"media_size,omitempty" db:"media_size"`
	MediaFilename   *string         `json:"media_filename,omitempty" db:"media_filename"`
	CardData        map[string]any  `json:"card_data,omitempty" db:"card_data"`
	ReplyToID       *uuid.UUID      `json:"reply_to_id,omitempty" db:"reply_to_id"`
	ReplyToText     *string         `json:"reply_to_text,omitempty" db:"reply_to_text"`
	ReplyToSender   *string         `json:"reply_to_sender,omitempty" db:"reply_to_sender"`
	IsEdited        bool            `json:"is_edited" db:"is_edited"`
	EditedAt        *time.Time      `json:"edited_at,omitempty" db:"edited_at"`
	IsDeleted       bool            `json:"is_deleted" db:"is_deleted"`
	CreatedAt       time.Time       `json:"created_at" db:"created_at"`

	// Joined fields
	ReadBy []ReadReceipt `json:"read_by,omitempty"`
}

// ReadReceipt tracks who read a message
type ReadReceipt struct {
	MessageID  uuid.UUID       `json:"message_id" db:"message_id"`
	ReaderType ParticipantType `json:"reader_type" db:"reader_type"`
	ReaderID   uuid.UUID       `json:"reader_id" db:"reader_id"`
	ReadAt     time.Time       `json:"read_at" db:"read_at"`
}
