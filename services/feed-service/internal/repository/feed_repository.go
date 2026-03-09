package repository

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/nexus-platform/feed-service/internal/model"
)

var ErrNotFound = errors.New("not found")

// FeedRepository handles post and feed data persistence
type FeedRepository struct {
	pool *pgxpool.Pool
}

func NewFeedRepository(pool *pgxpool.Pool) *FeedRepository {
	return &FeedRepository{pool: pool}
}

// ── Posts ───────────────────────────────────────

// CreatePost inserts a new post
func (r *FeedRepository) CreatePost(ctx context.Context, post *model.Post) error {
	post.ID = uuid.New()
	query := `
		INSERT INTO posts (id, author_id, post_type, visibility, content, media_url, link_url, original_post_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING created_at, updated_at`

	return r.pool.QueryRow(ctx, query,
		post.ID, post.AuthorID, post.PostType, post.Visibility,
		post.Content, post.MediaURL, post.LinkURL, post.OriginalPostID,
	).Scan(&post.CreatedAt, &post.UpdatedAt)
}

// GetPost retrieves a single post by ID
func (r *FeedRepository) GetPost(ctx context.Context, postID uuid.UUID) (*model.Post, error) {
	query := `
		SELECT p.id, p.author_id, p.post_type, p.visibility, p.content, p.media_url, p.link_url,
			p.original_post_id, p.like_count, p.comment_count, p.repost_count, p.view_count,
			p.created_at, p.updated_at,
			u.full_name, u.headline, u.avatar_url
		FROM posts p
		LEFT JOIN users u ON u.id = p.author_id
		WHERE p.id = $1 AND p.deleted_at IS NULL`

	var post model.Post
	err := r.pool.QueryRow(ctx, query, postID).Scan(
		&post.ID, &post.AuthorID, &post.PostType, &post.Visibility,
		&post.Content, &post.MediaURL, &post.LinkURL, &post.OriginalPostID,
		&post.LikeCount, &post.CommentCount, &post.RepostCount, &post.ViewCount,
		&post.CreatedAt, &post.UpdatedAt,
		&post.AuthorName, &post.AuthorHeadline, &post.AuthorAvatarURL,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("get post: %w", err)
	}
	return &post, nil
}

// DeletePost soft-deletes a post
func (r *FeedRepository) DeletePost(ctx context.Context, postID uuid.UUID, authorID uuid.UUID) error {
	query := `UPDATE posts SET deleted_at = now() WHERE id = $1 AND author_id = $2 AND deleted_at IS NULL`
	result, err := r.pool.Exec(ctx, query, postID, authorID)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return ErrNotFound
	}
	return nil
}

// ── Feed ───────────────────────────────────────

// GetUserFeed returns the paginated feed for a user
func (r *FeedRepository) GetUserFeed(ctx context.Context, userID uuid.UUID, limit int, before *time.Time) ([]model.Post, error) {
	args := []interface{}{userID, limit}
	query := `
		SELECT p.id, p.author_id, p.post_type, p.visibility, p.content, p.media_url, p.link_url,
			p.original_post_id, p.like_count, p.comment_count, p.repost_count, p.view_count,
			p.created_at, p.updated_at,
			u.full_name, u.headline, u.avatar_url
		FROM user_feed uf
		JOIN posts p ON p.id = uf.post_id AND p.deleted_at IS NULL
		LEFT JOIN users u ON u.id = p.author_id
		WHERE uf.user_id = $1`

	if before != nil {
		query += ` AND uf.created_at < $3`
		args = append(args, *before)
	}
	query += ` ORDER BY uf.created_at DESC LIMIT $2`

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("get user feed: %w", err)
	}
	defer rows.Close()

	return scanPosts(rows)
}

// GetPublicFeed returns latest public posts (for unauthenticated or explore)
func (r *FeedRepository) GetPublicFeed(ctx context.Context, limit int, before *time.Time) ([]model.Post, error) {
	args := []interface{}{limit}
	query := `
		SELECT p.id, p.author_id, p.post_type, p.visibility, p.content, p.media_url, p.link_url,
			p.original_post_id, p.like_count, p.comment_count, p.repost_count, p.view_count,
			p.created_at, p.updated_at,
			u.full_name, u.headline, u.avatar_url
		FROM posts p
		LEFT JOIN users u ON u.id = p.author_id
		WHERE p.visibility = 'public' AND p.deleted_at IS NULL`

	if before != nil {
		query += ` AND p.created_at < $2`
		args = append(args, *before)
	}
	query += ` ORDER BY p.created_at DESC LIMIT $1`

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("get public feed: %w", err)
	}
	defer rows.Close()

	return scanPosts(rows)
}

// FanoutPost distributes a post to the feeds of all followers/connections
func (r *FeedRepository) FanoutPost(ctx context.Context, postID uuid.UUID, authorID uuid.UUID) error {
	// Insert into user_feed for all connections + followers
	query := `
		INSERT INTO user_feed (user_id, post_id, author_id)
		SELECT
			CASE
				WHEN c.user_id_1 = $2 THEN c.user_id_2
				ELSE c.user_id_1
			END AS follower_id,
			$1, $2
		FROM connections c
		WHERE (c.user_id_1 = $2 OR c.user_id_2 = $2) AND c.status = 'accepted'
		UNION
		SELECT f.follower_id, $1, $2
		FROM follows f
		WHERE f.following_id = $2
		ON CONFLICT (user_id, post_id) DO NOTHING`

	_, err := r.pool.Exec(ctx, query, postID, authorID)
	if err != nil {
		return fmt.Errorf("fanout post: %w", err)
	}

	// Also insert into the author's own feed
	ownQuery := `INSERT INTO user_feed (user_id, post_id, author_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`
	_, _ = r.pool.Exec(ctx, ownQuery, authorID, postID, authorID)

	return nil
}

// ── Reactions ──────────────────────────────────

// AddReaction adds a reaction (like, celebrate, etc.) to a post
func (r *FeedRepository) AddReaction(ctx context.Context, postID uuid.UUID, userID uuid.UUID, reactionType string) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	insertQuery := `
		INSERT INTO post_reactions (id, post_id, user_id, reaction_type) VALUES ($1, $2, $3, $4)
		ON CONFLICT (post_id, user_id) DO UPDATE SET reaction_type = $4`
	_, err = tx.Exec(ctx, insertQuery, uuid.New(), postID, userID, reactionType)
	if err != nil {
		return err
	}

	updateQuery := `UPDATE posts SET like_count = (SELECT COUNT(*) FROM post_reactions WHERE post_id = $1) WHERE id = $1`
	_, err = tx.Exec(ctx, updateQuery, postID)
	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}

// RemoveReaction removes a user's reaction from a post
func (r *FeedRepository) RemoveReaction(ctx context.Context, postID uuid.UUID, userID uuid.UUID) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	deleteQuery := `DELETE FROM post_reactions WHERE post_id = $1 AND user_id = $2`
	_, err = tx.Exec(ctx, deleteQuery, postID, userID)
	if err != nil {
		return err
	}

	updateQuery := `UPDATE posts SET like_count = (SELECT COUNT(*) FROM post_reactions WHERE post_id = $1) WHERE id = $1`
	_, _ = tx.Exec(ctx, updateQuery, postID)

	return tx.Commit(ctx)
}

// HasReacted checks if a user has reacted to a post
func (r *FeedRepository) HasReacted(ctx context.Context, postID uuid.UUID, userID uuid.UUID) (bool, error) {
	var exists bool
	err := r.pool.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM post_reactions WHERE post_id = $1 AND user_id = $2)`, postID, userID).Scan(&exists)
	return exists, err
}

// ── Comments ───────────────────────────────────

// AddComment inserts a comment on a post
func (r *FeedRepository) AddComment(ctx context.Context, comment *model.Comment) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	comment.ID = uuid.New()
	insertQuery := `
		INSERT INTO comments (id, post_id, author_id, content, parent_comment_id)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING created_at`
	err = tx.QueryRow(ctx, insertQuery, comment.ID, comment.PostID, comment.AuthorID, comment.Content, comment.ParentID).Scan(&comment.CreatedAt)
	if err != nil {
		return err
	}

	updateQuery := `UPDATE posts SET comment_count = comment_count + 1 WHERE id = $1`
	_, _ = tx.Exec(ctx, updateQuery, comment.PostID)

	return tx.Commit(ctx)
}

// GetComments retrieves comments for a post
func (r *FeedRepository) GetComments(ctx context.Context, postID uuid.UUID, limit int) ([]model.Comment, error) {
	query := `
		SELECT c.id, c.post_id, c.author_id, c.content, c.parent_comment_id, c.like_count, c.created_at,
			u.full_name
		FROM comments c
		LEFT JOIN users u ON u.id = c.author_id
		WHERE c.post_id = $1 AND c.deleted_at IS NULL
		ORDER BY c.created_at ASC
		LIMIT $2`

	rows, err := r.pool.Query(ctx, query, postID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var comments []model.Comment
	for rows.Next() {
		var c model.Comment
		if err := rows.Scan(&c.ID, &c.PostID, &c.AuthorID, &c.Content, &c.ParentID, &c.LikeCount, &c.CreatedAt, &c.AuthorName); err != nil {
			return nil, err
		}
		comments = append(comments, c)
	}
	return comments, nil
}

// ── Helpers ────────────────────────────────────

func scanPosts(rows pgx.Rows) ([]model.Post, error) {
	var posts []model.Post
	for rows.Next() {
		var p model.Post
		if err := rows.Scan(
			&p.ID, &p.AuthorID, &p.PostType, &p.Visibility,
			&p.Content, &p.MediaURL, &p.LinkURL, &p.OriginalPostID,
			&p.LikeCount, &p.CommentCount, &p.RepostCount, &p.ViewCount,
			&p.CreatedAt, &p.UpdatedAt,
			&p.AuthorName, &p.AuthorHeadline, &p.AuthorAvatarURL,
		); err != nil {
			return nil, fmt.Errorf("scan post: %w", err)
		}
		posts = append(posts, p)
	}
	return posts, nil
}
