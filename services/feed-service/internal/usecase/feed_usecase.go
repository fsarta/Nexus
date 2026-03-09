package usecase

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/nexus-platform/feed-service/internal/model"
	"github.com/nexus-platform/feed-service/internal/repository"
)

// FeedUseCase handles feed business logic
type FeedUseCase struct {
	repo   *repository.FeedRepository
	logger *zap.Logger
}

func NewFeedUseCase(repo *repository.FeedRepository, logger *zap.Logger) *FeedUseCase {
	return &FeedUseCase{repo: repo, logger: logger}
}

// CreatePost creates a post and fans it out to followers' feeds
func (uc *FeedUseCase) CreatePost(ctx context.Context, authorID uuid.UUID, authorName string, req *model.CreatePostRequest) (*model.Post, error) {
	post := &model.Post{
		AuthorID:       authorID,
		AuthorName:     authorName,
		PostType:       req.PostType,
		Visibility:     req.Visibility,
		Content:        req.Content,
		MediaURL:       req.MediaURL,
		LinkURL:        req.LinkURL,
		OriginalPostID: req.OriginalPostID,
	}

	if err := uc.repo.CreatePost(ctx, post); err != nil {
		return nil, fmt.Errorf("create post: %w", err)
	}

	// Fanout to follower/connection feeds (async via goroutine)
	go func() {
		if err := uc.repo.FanoutPost(context.Background(), post.ID, authorID); err != nil {
			uc.logger.Error("Fanout failed", zap.Error(err), zap.String("post_id", post.ID.String()))
		} else {
			uc.logger.Info("Fanout complete", zap.String("post_id", post.ID.String()))
		}
	}()

	uc.logger.Info("Post created",
		zap.String("post_id", post.ID.String()),
		zap.String("author", authorName),
		zap.String("type", string(post.PostType)),
	)

	return post, nil
}

// GetFeed returns the paginated feed for a user
func (uc *FeedUseCase) GetFeed(ctx context.Context, userID uuid.UUID, limit int) (*model.FeedResponse, error) {
	posts, err := uc.repo.GetUserFeed(ctx, userID, limit, nil)
	if err != nil {
		return nil, err
	}

	// Enrich posts with user reaction state
	items := make([]model.FeedItem, len(posts))
	for i, post := range posts {
		hasLiked, _ := uc.repo.HasReacted(ctx, post.ID, userID)
		post.HasLiked = hasLiked
		items[i] = model.FeedItem{
			Post:     post,
			Score:    1.0,
			Reason:   "connection_post",
			Position: i + 1,
		}
	}

	return &model.FeedResponse{
		Items:   items,
		HasMore: len(items) == limit,
	}, nil
}

// GetPost retrieves a single post with comments
func (uc *FeedUseCase) GetPost(ctx context.Context, postID uuid.UUID, viewerID *uuid.UUID) (*model.PostResponse, error) {
	post, err := uc.repo.GetPost(ctx, postID)
	if err != nil {
		return nil, err
	}

	if viewerID != nil {
		hasLiked, _ := uc.repo.HasReacted(ctx, postID, *viewerID)
		post.HasLiked = hasLiked
	}

	comments, err := uc.repo.GetComments(ctx, postID, 20)
	if err != nil {
		uc.logger.Warn("Failed to load comments", zap.Error(err))
	}

	return &model.PostResponse{
		Post:     *post,
		Comments: comments,
	}, nil
}

// ReactToPost adds or changes a reaction
func (uc *FeedUseCase) ReactToPost(ctx context.Context, postID uuid.UUID, userID uuid.UUID, reactionType string) error {
	return uc.repo.AddReaction(ctx, postID, userID, reactionType)
}

// UnreactToPost removes a reaction
func (uc *FeedUseCase) UnreactToPost(ctx context.Context, postID uuid.UUID, userID uuid.UUID) error {
	return uc.repo.RemoveReaction(ctx, postID, userID)
}

// AddComment adds a comment to a post
func (uc *FeedUseCase) AddComment(ctx context.Context, postID uuid.UUID, authorID uuid.UUID, authorName string, req *model.CreateCommentRequest) (*model.Comment, error) {
	comment := &model.Comment{
		PostID:     postID,
		AuthorID:   authorID,
		AuthorName: authorName,
		Content:    req.Content,
		ParentID:   req.ParentID,
	}

	if err := uc.repo.AddComment(ctx, comment); err != nil {
		return nil, fmt.Errorf("add comment: %w", err)
	}
	return comment, nil
}

// DeletePost removes a post (only author can delete)
func (uc *FeedUseCase) DeletePost(ctx context.Context, postID uuid.UUID, authorID uuid.UUID) error {
	return uc.repo.DeletePost(ctx, postID, authorID)
}
