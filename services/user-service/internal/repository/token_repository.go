package repository

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// TokenRepository handles refresh token persistence
type TokenRepository struct {
	pool *pgxpool.Pool
}

// NewTokenRepository creates a new TokenRepository
func NewTokenRepository(pool *pgxpool.Pool) *TokenRepository {
	return &TokenRepository{pool: pool}
}

// StoreRefreshToken persists a hashed refresh token
func (r *TokenRepository) StoreRefreshToken(ctx context.Context, userID uuid.UUID, tokenHash string, deviceInfo string, expiresAt time.Time) error {
	query := `
		INSERT INTO refresh_tokens (user_id, token_hash, device_info, expires_at)
		VALUES ($1, $2, $3, $4)`

	_, err := r.pool.Exec(ctx, query, userID, tokenHash, deviceInfo, expiresAt)
	if err != nil {
		return fmt.Errorf("store refresh token: %w", err)
	}
	return nil
}

// ValidateRefreshToken checks if a token hash exists and is valid
func (r *TokenRepository) ValidateRefreshToken(ctx context.Context, tokenHash string) (uuid.UUID, error) {
	query := `
		SELECT user_id FROM refresh_tokens
		WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > now()`

	var userID uuid.UUID
	err := r.pool.QueryRow(ctx, query, tokenHash).Scan(&userID)
	if err != nil {
		if err == pgx.ErrNoRows {
			return uuid.Nil, fmt.Errorf("refresh token not found or expired")
		}
		return uuid.Nil, fmt.Errorf("validate refresh token: %w", err)
	}
	return userID, nil
}

// RevokeRefreshToken marks a token as revoked
func (r *TokenRepository) RevokeRefreshToken(ctx context.Context, tokenHash string) error {
	query := `UPDATE refresh_tokens SET revoked_at = now() WHERE token_hash = $1`
	_, err := r.pool.Exec(ctx, query, tokenHash)
	return err
}

// RevokeAllUserTokens revokes all refresh tokens for a user (logout everywhere)
func (r *TokenRepository) RevokeAllUserTokens(ctx context.Context, userID uuid.UUID) error {
	query := `UPDATE refresh_tokens SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL`
	_, err := r.pool.Exec(ctx, query, userID)
	return err
}

// CleanupExpiredTokens removes expired tokens (run periodically)
func (r *TokenRepository) CleanupExpiredTokens(ctx context.Context) (int64, error) {
	query := `DELETE FROM refresh_tokens WHERE expires_at < now() OR revoked_at IS NOT NULL`
	result, err := r.pool.Exec(ctx, query)
	if err != nil {
		return 0, fmt.Errorf("cleanup tokens: %w", err)
	}
	return result.RowsAffected(), nil
}
