package usecase

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/nexus-platform/messaging-service/internal/model"
	"github.com/nexus-platform/messaging-service/internal/repository"
	"github.com/nexus-platform/messaging-service/internal/ws"
)

// MessagingUseCase handles messaging business logic
type MessagingUseCase struct {
	repo   *repository.MessageRepository
	hub    *ws.Hub
	logger *zap.Logger
}

func NewMessagingUseCase(repo *repository.MessageRepository, hub *ws.Hub, logger *zap.Logger) *MessagingUseCase {
	return &MessagingUseCase{repo: repo, hub: hub, logger: logger}
}

// CreateOrGetConversation creates a new conversation or returns existing direct conversation
func (uc *MessagingUseCase) CreateOrGetConversation(
	ctx context.Context,
	senderType model.ParticipantType,
	senderID uuid.UUID,
	senderName string,
	senderAvatar *string,
	req *model.CreateConversationRequest,
) (*model.Conversation, error) {
	// For direct messages (1 other participant), check if conversation already exists
	if len(req.Participants) == 1 && (req.Title == nil || *req.Title == "") {
		other := req.Participants[0]
		existingID, err := uc.repo.FindDirectConversation(ctx, senderType, senderID, other.Type, other.ID)
		if err != nil {
			return nil, fmt.Errorf("check existing conversation: %w", err)
		}
		if existingID != nil {
			// Return existing conversation with participants
			participants, err := uc.repo.GetConversationParticipants(ctx, *existingID)
			if err != nil {
				return nil, err
			}
			return &model.Conversation{
				ID:           *existingID,
				Type:         model.ConversationDirect,
				Participants: participants,
			}, nil
		}
	}

	// Determine conversation type
	convType := model.ConversationDirect
	if len(req.Participants) > 1 || (req.Title != nil && *req.Title != "") {
		convType = model.ConversationGroup
	}

	conv := &model.Conversation{
		Type:          convType,
		Title:         req.Title,
		CreatedByType: senderType,
		CreatedByID:   senderID,
	}

	// Build participant list (includes the sender)
	participants := make([]model.ConversationParticipant, 0, len(req.Participants)+1)
	
	// Add sender as participant
	participants = append(participants, model.ConversationParticipant{
		ParticipantType: senderType,
		ParticipantID:   senderID,
		DisplayName:     senderName,
		AvatarURL:       senderAvatar,
		Notifications:   "all",
	})

	// Add other participants
	for _, p := range req.Participants {
		participants = append(participants, model.ConversationParticipant{
			ParticipantType: p.Type,
			ParticipantID:   p.ID,
			DisplayName:     p.DisplayName,
			AvatarURL:       p.AvatarURL,
			Notifications:   "all",
		})
	}

	if err := uc.repo.CreateConversation(ctx, conv, participants); err != nil {
		return nil, fmt.Errorf("create conversation: %w", err)
	}

	uc.logger.Info("Conversation created",
		zap.String("conversation_id", conv.ID.String()),
		zap.String("type", string(conv.Type)),
		zap.Int("participants", len(participants)),
	)

	// If there's an initial message, send it
	if req.InitialMessage != nil && *req.InitialMessage != "" {
		msg := &model.Message{
			ConversationID: conv.ID,
			SenderType:     senderType,
			SenderID:       senderID,
			SenderName:     senderName,
			SenderAvatar:   senderAvatar,
			MessageType:    model.MessageText,
			Content:        req.InitialMessage,
		}
		if err := uc.repo.CreateMessage(ctx, msg); err != nil {
			uc.logger.Warn("Failed to send initial message", zap.Error(err))
		}
	}

	return conv, nil
}

// GetInbox returns conversations for a participant (inbox view)
func (uc *MessagingUseCase) GetInbox(ctx context.Context, pType model.ParticipantType, pID uuid.UUID, limit int) (*model.ConversationListResponse, error) {
	conversations, err := uc.repo.GetConversationsByParticipant(ctx, pType, pID, limit, nil)
	if err != nil {
		return nil, err
	}

	totalUnread, err := uc.repo.GetTotalUnread(ctx, pType, pID)
	if err != nil {
		return nil, err
	}

	return &model.ConversationListResponse{
		Conversations: toConversationSummaries(conversations),
		TotalUnread:   totalUnread,
		HasMore:       len(conversations) == limit,
	}, nil
}

// SendMessage sends a message to a conversation
func (uc *MessagingUseCase) SendMessage(
	ctx context.Context,
	convID uuid.UUID,
	senderType model.ParticipantType,
	senderID uuid.UUID,
	senderName string,
	senderAvatar *string,
	req *model.SendMessageRequest,
) (*model.Message, error) {
	// Verify sender is a participant
	ok, err := uc.repo.IsParticipant(ctx, convID, senderType, senderID)
	if err != nil {
		return nil, err
	}
	if !ok {
		return nil, fmt.Errorf("not a participant of this conversation")
	}

	// Handle reply-to: fetch the original message preview
	var replyText *string
	var replySender *string
	if req.ReplyToID != nil {
		msgs, err := uc.repo.GetMessages(ctx, convID, 1, nil) // simplified — would look up specific message
		if err == nil && len(msgs) > 0 {
			for _, m := range msgs {
				if m.ID == *req.ReplyToID {
					if m.Content != nil {
						t := *m.Content
						if len(t) > 300 {
							t = t[:297] + "..."
						}
						replyText = &t
					}
					replySender = &m.SenderName
					break
				}
			}
		}
	}

	msg := &model.Message{
		ConversationID: convID,
		SenderType:     senderType,
		SenderID:       senderID,
		SenderName:     senderName,
		SenderAvatar:   senderAvatar,
		MessageType:    req.MessageType,
		Content:        req.Content,
		MediaURL:       req.MediaURL,
		MediaMimeType:  req.MediaMimeType,
		MediaSize:      req.MediaSize,
		MediaFilename:  req.MediaFilename,
		CardData:       req.CardData,
		ReplyToID:      req.ReplyToID,
		ReplyToText:    replyText,
		ReplyToSender:  replySender,
	}

	if err := uc.repo.CreateMessage(ctx, msg); err != nil {
		return nil, fmt.Errorf("send message: %w", err)
	}

	uc.logger.Info("Message sent",
		zap.String("conversation_id", convID.String()),
		zap.String("sender", senderName),
		zap.String("type", string(req.MessageType)),
	)

	// Broadcast via WebSocket to all participants
	if uc.hub != nil {
		participants, _ := uc.repo.GetConversationParticipants(ctx, convID)
		for _, p := range participants {
			// Don't send back to sender
			if p.ParticipantType == senderType && p.ParticipantID == senderID {
				continue
			}
			uc.hub.SendToUser(p.ParticipantID.String(), model.WSEvent{
				Type:    "message.new",
				Payload: msg,
			})
		}
	}

	return msg, nil
}

// GetMessages returns paginated messages for a conversation
func (uc *MessagingUseCase) GetMessages(ctx context.Context, convID uuid.UUID, pType model.ParticipantType, pID uuid.UUID, limit int, beforeID *uuid.UUID) (*model.MessageListResponse, error) {
	// Verify participant
	ok, err := uc.repo.IsParticipant(ctx, convID, pType, pID)
	if err != nil {
		return nil, err
	}
	if !ok {
		return nil, fmt.Errorf("not a participant of this conversation")
	}

	messages, err := uc.repo.GetMessages(ctx, convID, limit, beforeID)
	if err != nil {
		return nil, err
	}

	return &model.MessageListResponse{
		Messages: messages,
		HasMore:  len(messages) == limit,
	}, nil
}

// MarkRead marks messages as read
func (uc *MessagingUseCase) MarkRead(ctx context.Context, convID uuid.UUID, pType model.ParticipantType, pID uuid.UUID, lastReadMsgID uuid.UUID) error {
	err := uc.repo.MarkRead(ctx, convID, pType, pID, lastReadMsgID)
	if err != nil {
		return err
	}

	// Broadcast read receipt via WebSocket
	if uc.hub != nil {
		participants, _ := uc.repo.GetConversationParticipants(ctx, convID)
		for _, p := range participants {
			if p.ParticipantType == pType && p.ParticipantID == pID {
				continue
			}
			uc.hub.SendToUser(p.ParticipantID.String(), model.WSEvent{
				Type: "message.read",
				Payload: map[string]interface{}{
					"conversation_id":   convID,
					"reader_type":       pType,
					"reader_id":         pID,
					"last_read_message": lastReadMsgID,
				},
			})
		}
	}

	return nil
}

// DeleteMessage soft-deletes a message
func (uc *MessagingUseCase) DeleteMessage(ctx context.Context, msgID uuid.UUID, pType model.ParticipantType, pID uuid.UUID) error {
	return uc.repo.DeleteMessage(ctx, msgID, pType, pID)
}

// EditMessage edits a message's content
func (uc *MessagingUseCase) EditMessage(ctx context.Context, msgID uuid.UUID, pType model.ParticipantType, pID uuid.UUID, content string) error {
	return uc.repo.EditMessage(ctx, msgID, pType, pID, content)
}

// ── Helpers ────────────────────────────────────

func toConversationSummaries(conversations []model.Conversation) []model.ConversationSummary {
	summaries := make([]model.ConversationSummary, len(conversations))
	for i, conv := range conversations {
		summary := model.ConversationSummary{
			ID:          conv.ID,
			Type:        conv.Type,
			Title:       conv.Title,
			UnreadCount: conv.UnreadCount,
			UpdatedAt:   conv.UpdatedAt.Format("2006-01-02T15:04:05Z"),
		}

		// Map participants
		for _, p := range conv.Participants {
			summary.Participants = append(summary.Participants, model.ParticipantSummary{
				Type:        p.ParticipantType,
				ID:          p.ParticipantID,
				DisplayName: p.DisplayName,
				AvatarURL:   p.AvatarURL,
			})
		}

		// Map last message
		if conv.LastMessageText != nil && conv.LastMessageAt != nil {
			senderName := ""
			if conv.LastMessageSender != nil {
				senderName = *conv.LastMessageSender
			}
			summary.LastMessage = &model.MessagePreview{
				Content:    *conv.LastMessageText,
				SenderName: senderName,
				Timestamp:  conv.LastMessageAt.Format("2006-01-02T15:04:05Z"),
			}
		}

		summaries[i] = summary
	}
	return summaries
}
