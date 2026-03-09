package repository

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/nexus-platform/messaging-service/internal/model"
)

var ErrNotFound = errors.New("not found")
var ErrForbidden = errors.New("forbidden")

// MessageRepository handles messaging data persistence
type MessageRepository struct {
	pool *pgxpool.Pool
}

func NewMessageRepository(pool *pgxpool.Pool) *MessageRepository {
	return &MessageRepository{pool: pool}
}

// ── Conversations ──────────────────────────────

// CreateConversation creates a new conversation with participants
func (r *MessageRepository) CreateConversation(ctx context.Context, conv *model.Conversation, participants []model.ConversationParticipant) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin tx: %w", err)
	}
	defer tx.Rollback(ctx)

	conv.ID = uuid.New()
	query := `
		INSERT INTO conversations (id, type, title, avatar_url, created_by_type, created_by_id)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING created_at, updated_at`

	err = tx.QueryRow(ctx, query,
		conv.ID, conv.Type, conv.Title, conv.AvatarURL,
		conv.CreatedByType, conv.CreatedByID,
	).Scan(&conv.CreatedAt, &conv.UpdatedAt)
	if err != nil {
		return fmt.Errorf("insert conversation: %w", err)
	}

	// Insert participants
	for i := range participants {
		p := &participants[i]
		p.ID = uuid.New()
		p.ConversationID = conv.ID
		pQuery := `
			INSERT INTO conversation_participants (id, conversation_id, participant_type, participant_id, display_name, avatar_url)
			VALUES ($1, $2, $3, $4, $5, $6)
			RETURNING joined_at`

		err = tx.QueryRow(ctx, pQuery,
			p.ID, p.ConversationID, p.ParticipantType, p.ParticipantID,
			p.DisplayName, p.AvatarURL,
		).Scan(&p.JoinedAt)
		if err != nil {
			return fmt.Errorf("insert participant: %w", err)
		}
	}

	conv.Participants = participants
	return tx.Commit(ctx)
}

// FindDirectConversation finds an existing direct conversation between two entities
func (r *MessageRepository) FindDirectConversation(ctx context.Context, type1 model.ParticipantType, id1 uuid.UUID, type2 model.ParticipantType, id2 uuid.UUID) (*uuid.UUID, error) {
	query := `
		SELECT c.id FROM conversations c
		JOIN conversation_participants p1 ON p1.conversation_id = c.id
			AND p1.participant_type = $1 AND p1.participant_id = $2 AND p1.left_at IS NULL
		JOIN conversation_participants p2 ON p2.conversation_id = c.id
			AND p2.participant_type = $3 AND p2.participant_id = $4 AND p2.left_at IS NULL
		WHERE c.type = 'direct'
		LIMIT 1`

	var convID uuid.UUID
	err := r.pool.QueryRow(ctx, query, type1, id1, type2, id2).Scan(&convID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil // no existing conversation
		}
		return nil, fmt.Errorf("find direct conversation: %w", err)
	}
	return &convID, nil
}

// GetConversationsByParticipant returns all conversations for an entity (inbox)
func (r *MessageRepository) GetConversationsByParticipant(ctx context.Context, pType model.ParticipantType, pID uuid.UUID, limit int, cursor *time.Time) ([]model.Conversation, error) {
	args := []interface{}{pType, pID, limit}
	query := `
		SELECT c.id, c.type, c.title, c.avatar_url, c.created_by_type, c.created_by_id,
			c.last_message_id, c.last_message_text, c.last_message_at, c.last_message_sender,
			c.message_count, c.is_archived, c.created_at, c.updated_at,
			cp.unread_count, cp.is_pinned, cp.is_muted
		FROM conversations c
		JOIN conversation_participants cp ON cp.conversation_id = c.id
			AND cp.participant_type = $1 AND cp.participant_id = $2 AND cp.left_at IS NULL
		WHERE c.is_archived = false`

	if cursor != nil {
		query += ` AND c.updated_at < $4`
		args = append(args, *cursor)
	}
	query += ` ORDER BY cp.is_pinned DESC, c.updated_at DESC LIMIT $3`

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("get conversations: %w", err)
	}
	defer rows.Close()

	var conversations []model.Conversation
	for rows.Next() {
		var conv model.Conversation
		var unread int
		var isPinned, isMuted bool
		if err := rows.Scan(
			&conv.ID, &conv.Type, &conv.Title, &conv.AvatarURL,
			&conv.CreatedByType, &conv.CreatedByID,
			&conv.LastMessageID, &conv.LastMessageText, &conv.LastMessageAt, &conv.LastMessageSender,
			&conv.MessageCount, &conv.IsArchived, &conv.CreatedAt, &conv.UpdatedAt,
			&unread, &isPinned, &isMuted,
		); err != nil {
			return nil, fmt.Errorf("scan conversation: %w", err)
		}
		conv.UnreadCount = unread
		conversations = append(conversations, conv)
	}

	// Load participants for each conversation
	for i := range conversations {
		participants, err := r.GetConversationParticipants(ctx, conversations[i].ID)
		if err != nil {
			return nil, err
		}
		conversations[i].Participants = participants
	}

	return conversations, nil
}

// GetConversationParticipants returns all active participants in a conversation
func (r *MessageRepository) GetConversationParticipants(ctx context.Context, convID uuid.UUID) ([]model.ConversationParticipant, error) {
	query := `
		SELECT id, conversation_id, participant_type, participant_id,
			display_name, avatar_url, last_read_at, unread_count,
			is_muted, is_pinned, notifications, joined_at
		FROM conversation_participants
		WHERE conversation_id = $1 AND left_at IS NULL`

	rows, err := r.pool.Query(ctx, query, convID)
	if err != nil {
		return nil, fmt.Errorf("get participants: %w", err)
	}
	defer rows.Close()

	var participants []model.ConversationParticipant
	for rows.Next() {
		var p model.ConversationParticipant
		if err := rows.Scan(
			&p.ID, &p.ConversationID, &p.ParticipantType, &p.ParticipantID,
			&p.DisplayName, &p.AvatarURL, &p.LastReadAt, &p.UnreadCount,
			&p.IsMuted, &p.IsPinned, &p.Notifications, &p.JoinedAt,
		); err != nil {
			return nil, fmt.Errorf("scan participant: %w", err)
		}
		participants = append(participants, p)
	}
	return participants, nil
}

// IsParticipant checks if an entity is a participant in a conversation
func (r *MessageRepository) IsParticipant(ctx context.Context, convID uuid.UUID, pType model.ParticipantType, pID uuid.UUID) (bool, error) {
	query := `
		SELECT EXISTS(
			SELECT 1 FROM conversation_participants
			WHERE conversation_id = $1 AND participant_type = $2 AND participant_id = $3 AND left_at IS NULL
		)`

	var exists bool
	err := r.pool.QueryRow(ctx, query, convID, pType, pID).Scan(&exists)
	return exists, err
}

// ── Messages ───────────────────────────────────

// CreateMessage inserts a message and updates the conversation's last message
func (r *MessageRepository) CreateMessage(ctx context.Context, msg *model.Message) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin tx: %w", err)
	}
	defer tx.Rollback(ctx)

	msg.ID = uuid.New()

	// Insert message
	query := `
		INSERT INTO messages (id, conversation_id, sender_type, sender_id, sender_name, sender_avatar,
			message_type, content, media_url, media_mime_type, media_size, media_filename,
			card_data, reply_to_id, reply_to_text, reply_to_sender)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
		RETURNING created_at`

	err = tx.QueryRow(ctx, query,
		msg.ID, msg.ConversationID, msg.SenderType, msg.SenderID,
		msg.SenderName, msg.SenderAvatar, msg.MessageType, msg.Content,
		msg.MediaURL, msg.MediaMimeType, msg.MediaSize, msg.MediaFilename,
		msg.CardData, msg.ReplyToID, msg.ReplyToText, msg.ReplyToSender,
	).Scan(&msg.CreatedAt)
	if err != nil {
		return fmt.Errorf("insert message: %w", err)
	}

	// Update conversation's last message preview
	preview := ""
	if msg.Content != nil {
		preview = *msg.Content
		if len(preview) > 500 {
			preview = preview[:497] + "..."
		}
	} else if msg.MediaFilename != nil {
		preview = "📎 " + *msg.MediaFilename
	} else {
		preview = "[" + string(msg.MessageType) + "]"
	}

	updateQuery := `
		UPDATE conversations SET
			last_message_id = $2,
			last_message_text = $3,
			last_message_at = $4,
			last_message_sender = $5,
			message_count = message_count + 1,
			updated_at = $4
		WHERE id = $1`

	_, err = tx.Exec(ctx, updateQuery,
		msg.ConversationID, msg.ID, preview, msg.CreatedAt, msg.SenderName,
	)
	if err != nil {
		return fmt.Errorf("update conversation last message: %w", err)
	}

	// Increment unread count for all other participants
	unreadQuery := `
		UPDATE conversation_participants SET unread_count = unread_count + 1
		WHERE conversation_id = $1
			AND NOT (participant_type = $2 AND participant_id = $3)
			AND left_at IS NULL`

	_, err = tx.Exec(ctx, unreadQuery, msg.ConversationID, msg.SenderType, msg.SenderID)
	if err != nil {
		return fmt.Errorf("increment unread: %w", err)
	}

	return tx.Commit(ctx)
}

// GetMessages returns paginated messages for a conversation
func (r *MessageRepository) GetMessages(ctx context.Context, convID uuid.UUID, limit int, beforeID *uuid.UUID) ([]model.Message, error) {
	args := []interface{}{convID, limit}
	query := `
		SELECT id, conversation_id, sender_type, sender_id, sender_name, sender_avatar,
			message_type, content, media_url, media_mime_type, media_size, media_filename,
			card_data, reply_to_id, reply_to_text, reply_to_sender,
			is_edited, edited_at, is_deleted, created_at
		FROM messages
		WHERE conversation_id = $1 AND is_deleted = false`

	if beforeID != nil {
		query += ` AND created_at < (SELECT created_at FROM messages WHERE id = $3)`
		args = append(args, *beforeID)
	}
	query += ` ORDER BY created_at DESC LIMIT $2`

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("get messages: %w", err)
	}
	defer rows.Close()

	var messages []model.Message
	for rows.Next() {
		var msg model.Message
		if err := rows.Scan(
			&msg.ID, &msg.ConversationID, &msg.SenderType, &msg.SenderID,
			&msg.SenderName, &msg.SenderAvatar, &msg.MessageType, &msg.Content,
			&msg.MediaURL, &msg.MediaMimeType, &msg.MediaSize, &msg.MediaFilename,
			&msg.CardData, &msg.ReplyToID, &msg.ReplyToText, &msg.ReplyToSender,
			&msg.IsEdited, &msg.EditedAt, &msg.IsDeleted, &msg.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan message: %w", err)
		}
		messages = append(messages, msg)
	}
	return messages, nil
}

// MarkRead marks all messages as read up to a certain message for a participant
func (r *MessageRepository) MarkRead(ctx context.Context, convID uuid.UUID, pType model.ParticipantType, pID uuid.UUID, lastReadMsgID uuid.UUID) error {
	query := `
		UPDATE conversation_participants SET
			last_read_at = now(),
			last_read_message_id = $4,
			unread_count = 0
		WHERE conversation_id = $1 AND participant_type = $2 AND participant_id = $3 AND left_at IS NULL`

	_, err := r.pool.Exec(ctx, query, convID, pType, pID, lastReadMsgID)
	return err
}

// DeleteMessage soft-deletes a message (only sender can delete)
func (r *MessageRepository) DeleteMessage(ctx context.Context, msgID uuid.UUID, senderType model.ParticipantType, senderID uuid.UUID) error {
	query := `
		UPDATE messages SET is_deleted = true, deleted_at = now(), content = NULL, media_url = NULL
		WHERE id = $1 AND sender_type = $2 AND sender_id = $3`

	result, err := r.pool.Exec(ctx, query, msgID, senderType, senderID)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return ErrForbidden
	}
	return nil
}

// EditMessage updates message content (only sender can edit, only text messages)
func (r *MessageRepository) EditMessage(ctx context.Context, msgID uuid.UUID, senderType model.ParticipantType, senderID uuid.UUID, newContent string) error {
	query := `
		UPDATE messages SET content = $4, is_edited = true, edited_at = now()
		WHERE id = $1 AND sender_type = $2 AND sender_id = $3 AND message_type = 'text' AND is_deleted = false`

	result, err := r.pool.Exec(ctx, query, msgID, senderType, senderID, newContent)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return ErrForbidden
	}
	return nil
}

// GetTotalUnread returns total unread message count across all conversations
func (r *MessageRepository) GetTotalUnread(ctx context.Context, pType model.ParticipantType, pID uuid.UUID) (int, error) {
	query := `
		SELECT COALESCE(SUM(unread_count), 0)
		FROM conversation_participants
		WHERE participant_type = $1 AND participant_id = $2 AND left_at IS NULL`

	var total int
	err := r.pool.QueryRow(ctx, query, pType, pID).Scan(&total)
	return total, err
}
