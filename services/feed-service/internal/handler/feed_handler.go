package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/nexus-platform/feed-service/internal/model"
	"github.com/nexus-platform/feed-service/internal/usecase"
)

// FeedHandler handles feed HTTP endpoints
type FeedHandler struct {
	feedUC *usecase.FeedUseCase
	logger *zap.Logger
}

func NewFeedHandler(feedUC *usecase.FeedUseCase, logger *zap.Logger) *FeedHandler {
	return &FeedHandler{feedUC: feedUC, logger: logger}
}

// CreatePost creates a new post
// POST /api/v1/posts
func (h *FeedHandler) CreatePost(c *gin.Context) {
	userID, userName, ok := extractUser(c)
	if !ok {
		return
	}

	var req model.CreatePostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{Error: "Invalid request", Details: err.Error()})
		return
	}

	post, err := h.feedUC.CreatePost(c.Request.Context(), userID, userName, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, model.ErrorResponse{Error: "Failed to create post"})
		return
	}

	c.JSON(http.StatusCreated, post)
}

// GetFeed returns the user's personalized feed
// GET /api/v1/feed
func (h *FeedHandler) GetFeed(c *gin.Context) {
	userID, _, ok := extractUser(c)
	if !ok {
		return
	}

	feed, err := h.feedUC.GetFeed(c.Request.Context(), userID, 20)
	if err != nil {
		c.JSON(http.StatusInternalServerError, model.ErrorResponse{Error: "Failed to load feed"})
		return
	}

	c.JSON(http.StatusOK, feed)
}

// GetPost returns a single post with comments
// GET /api/v1/posts/:id
func (h *FeedHandler) GetPost(c *gin.Context) {
	postID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{Error: "Invalid post ID"})
		return
	}

	var viewerID *uuid.UUID
	if uid := c.GetString("user_id"); uid != "" {
		if id, err := uuid.Parse(uid); err == nil {
			viewerID = &id
		}
	}

	resp, err := h.feedUC.GetPost(c.Request.Context(), postID, viewerID)
	if err != nil {
		c.JSON(http.StatusNotFound, model.ErrorResponse{Error: "Post not found"})
		return
	}

	c.JSON(http.StatusOK, resp)
}

// DeletePost deletes a post (author only)
// DELETE /api/v1/posts/:id
func (h *FeedHandler) DeletePost(c *gin.Context) {
	postID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{Error: "Invalid post ID"})
		return
	}

	userID, _, ok := extractUser(c)
	if !ok {
		return
	}

	if err := h.feedUC.DeletePost(c.Request.Context(), postID, userID); err != nil {
		c.JSON(http.StatusForbidden, model.ErrorResponse{Error: "Cannot delete this post"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "deleted"})
}

// ReactToPost adds a reaction to a post
// POST /api/v1/posts/:id/react
func (h *FeedHandler) ReactToPost(c *gin.Context) {
	postID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{Error: "Invalid post ID"})
		return
	}

	userID, _, ok := extractUser(c)
	if !ok {
		return
	}

	var req model.ReactRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{Error: "Invalid reaction type"})
		return
	}

	if err := h.feedUC.ReactToPost(c.Request.Context(), postID, userID, req.Type); err != nil {
		c.JSON(http.StatusInternalServerError, model.ErrorResponse{Error: "Failed to react"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "reacted", "type": req.Type})
}

// UnreactToPost removes a reaction from a post
// DELETE /api/v1/posts/:id/react
func (h *FeedHandler) UnreactToPost(c *gin.Context) {
	postID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{Error: "Invalid post ID"})
		return
	}

	userID, _, ok := extractUser(c)
	if !ok {
		return
	}

	if err := h.feedUC.UnreactToPost(c.Request.Context(), postID, userID); err != nil {
		c.JSON(http.StatusInternalServerError, model.ErrorResponse{Error: "Failed to unreact"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "unreacted"})
}

// AddComment adds a comment to a post
// POST /api/v1/posts/:id/comments
func (h *FeedHandler) AddComment(c *gin.Context) {
	postID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{Error: "Invalid post ID"})
		return
	}

	userID, userName, ok := extractUser(c)
	if !ok {
		return
	}

	var req model.CreateCommentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{Error: "Invalid comment", Details: err.Error()})
		return
	}

	comment, err := h.feedUC.AddComment(c.Request.Context(), postID, userID, userName, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, model.ErrorResponse{Error: "Failed to add comment"})
		return
	}

	c.JSON(http.StatusCreated, comment)
}

// extractUser gets user info from JWT context
func extractUser(c *gin.Context) (uuid.UUID, string, bool) {
	uidStr := c.GetString("user_id")
	if uidStr == "" {
		c.JSON(http.StatusUnauthorized, model.ErrorResponse{Error: "Unauthorized"})
		return uuid.Nil, "", false
	}
	uid, err := uuid.Parse(uidStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{Error: "Invalid user ID"})
		return uuid.Nil, "", false
	}
	name := c.GetString("user_name")
	if name == "" {
		name = "User"
	}
	return uid, name, true
}
