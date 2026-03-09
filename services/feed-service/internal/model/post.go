package model

import (
	"time"

	"github.com/google/uuid"
)

// PostType determines the content format
type PostType string

const (
	PostText     PostType = "text"
	PostImage    PostType = "image"
	PostVideo    PostType = "video"
	PostDocument PostType = "document"
	PostPoll     PostType = "poll"
	PostArticle  PostType = "article"
	PostRepost   PostType = "repost"
)

// PostVisibility controls who can see the post
type PostVisibility string

const (
	VisibilityPublic      PostVisibility = "public"
	VisibilityConnections PostVisibility = "connections"
	VisibilityPrivate     PostVisibility = "private"
)

// Post represents a piece of content in the feed
type Post struct {
	ID              uuid.UUID      `json:"id" db:"id"`
	AuthorID        uuid.UUID      `json:"author_id" db:"author_id"`
	AuthorName      string         `json:"author_name" db:"author_name"`
	AuthorHeadline  *string        `json:"author_headline,omitempty" db:"author_headline"`
	AuthorAvatarURL *string        `json:"author_avatar_url,omitempty" db:"author_avatar_url"`

	PostType   PostType       `json:"post_type" db:"post_type"`
	Visibility PostVisibility `json:"visibility" db:"visibility"`

	// Content
	Content  *string  `json:"content,omitempty" db:"content"`
	MediaURL *string  `json:"media_url,omitempty" db:"media_url"`
	LinkURL  *string  `json:"link_url,omitempty" db:"link_url"`
	LinkMeta *LinkMeta `json:"link_meta,omitempty"`

	// Repost
	OriginalPostID *uuid.UUID `json:"original_post_id,omitempty" db:"original_post_id"`
	OriginalPost   *Post      `json:"original_post,omitempty"`

	// Engagement (denormalized counters)
	LikeCount    int `json:"like_count" db:"like_count"`
	CommentCount int `json:"comment_count" db:"comment_count"`
	RepostCount  int `json:"repost_count" db:"repost_count"`
	ViewCount    int `json:"view_count" db:"view_count"`

	// User interaction state (set per-request)
	HasLiked    bool `json:"has_liked,omitempty"`
	HasReposted bool `json:"has_reposted,omitempty"`

	// Timestamps
	CreatedAt time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt time.Time  `json:"updated_at" db:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at,omitempty" db:"deleted_at"`
}

// LinkMeta holds Open Graph metadata for shared links
type LinkMeta struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Image       string `json:"image"`
	Domain      string `json:"domain"`
}

// Comment represents a comment on a post
type Comment struct {
	ID        uuid.UUID  `json:"id" db:"id"`
	PostID    uuid.UUID  `json:"post_id" db:"post_id"`
	AuthorID  uuid.UUID  `json:"author_id" db:"author_id"`
	AuthorName string    `json:"author_name" db:"author_name"`
	Content   string     `json:"content" db:"content"`
	ParentID  *uuid.UUID `json:"parent_id,omitempty" db:"parent_id"` // for nested replies
	LikeCount int        `json:"like_count" db:"like_count"`
	CreatedAt time.Time  `json:"created_at" db:"created_at"`
}

// Reaction represents a like/reaction on a post
type Reaction struct {
	ID        uuid.UUID `json:"id" db:"id"`
	PostID    uuid.UUID `json:"post_id" db:"post_id"`
	UserID    uuid.UUID `json:"user_id" db:"user_id"`
	Type      string    `json:"type" db:"type"` // "like", "celebrate", "insightful", "curious", "love"
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

// FeedItem is a post in a user's feed with ranking metadata
type FeedItem struct {
	Post      Post    `json:"post"`
	Score     float64 `json:"score"`       // ranking score
	Reason    string  `json:"reason"`      // "connection_post", "recommended", "trending"
	Position  int     `json:"position"`    // position in feed
}
