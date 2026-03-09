package model

import "github.com/google/uuid"

// ── Request DTOs ───────────────────────────────

// CreatePostRequest is the body for creating a new post
type CreatePostRequest struct {
	Content    *string        `json:"content,omitempty"`
	PostType   PostType       `json:"post_type" binding:"required,oneof=text image video document poll article repost"`
	Visibility PostVisibility `json:"visibility" binding:"required,oneof=public connections private"`
	MediaURL   *string        `json:"media_url,omitempty"`
	LinkURL    *string        `json:"link_url,omitempty"`
	OriginalPostID *uuid.UUID `json:"original_post_id,omitempty"` // for reposts
}

// CreateCommentRequest is the body for adding a comment
type CreateCommentRequest struct {
	Content  string     `json:"content" binding:"required,min=1,max=2000"`
	ParentID *uuid.UUID `json:"parent_id,omitempty"` // for nested replies
}

// ReactRequest is the body for adding a reaction
type ReactRequest struct {
	Type string `json:"type" binding:"required,oneof=like celebrate insightful curious love"`
}

// ── Response DTOs ──────────────────────────────

// FeedResponse is the paginated feed
type FeedResponse struct {
	Items   []FeedItem `json:"items"`
	HasMore bool       `json:"has_more"`
	Cursor  *string    `json:"cursor,omitempty"`
}

// PostResponse wraps a single post with engagement data
type PostResponse struct {
	Post     Post      `json:"post"`
	Comments []Comment `json:"comments,omitempty"`
}

// CommentListResponse is a paginated comment list
type CommentListResponse struct {
	Comments []Comment `json:"comments"`
	HasMore  bool      `json:"has_more"`
	Total    int       `json:"total"`
}

// ErrorResponse standard error
type ErrorResponse struct {
	Error   string `json:"error"`
	Code    string `json:"code,omitempty"`
	Details string `json:"details,omitempty"`
}
