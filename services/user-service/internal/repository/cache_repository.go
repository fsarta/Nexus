package repository

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

// CacheRepository handles Redis caching
type CacheRepository struct {
	client *redis.Client
}

// NewCacheRepository creates a new CacheRepository
func NewCacheRepository(client *redis.Client) *CacheRepository {
	return &CacheRepository{client: client}
}

// Set stores a value in cache with expiration
func (r *CacheRepository) Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
	data, err := json.Marshal(value)
	if err != nil {
		return fmt.Errorf("cache marshal: %w", err)
	}
	return r.client.Set(ctx, key, data, expiration).Err()
}

// Get retrieves a cached value and unmarshals it
func (r *CacheRepository) Get(ctx context.Context, key string, dest interface{}) error {
	data, err := r.client.Get(ctx, key).Bytes()
	if err != nil {
		if err == redis.Nil {
			return fmt.Errorf("cache miss: %s", key)
		}
		return fmt.Errorf("cache get: %w", err)
	}
	return json.Unmarshal(data, dest)
}

// Delete removes a key from cache
func (r *CacheRepository) Delete(ctx context.Context, key string) error {
	return r.client.Del(ctx, key).Err()
}

// UserCacheKey returns the cache key for a user profile
func UserCacheKey(userID string) string {
	return fmt.Sprintf("user:profile:%s", userID)
}

// SessionCacheKey returns the cache key for a user session
func SessionCacheKey(sessionID string) string {
	return fmt.Sprintf("session:%s", sessionID)
}
