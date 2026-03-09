-- Nexus: Posts & Feed Schema
-- Initial SQL-based post storage (will migrate to Cassandra for scale)

CREATE TYPE IF NOT EXISTS content_type AS ENUM (
    'text',
    'photo',
    'video',
    'document',
    'article',
    'poll',
    'event',
    'job_posting',
    'presentation',
    'case_study'
);

CREATE TYPE IF NOT EXISTS post_visibility AS ENUM (
    'public',
    'connections',
    'company',
    'department',
    'private'
);

-- ============================================================
-- POSTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS posts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Content
    content_type    content_type NOT NULL DEFAULT 'text',
    text_content    TEXT,                          -- markdown-formatted text
    media_urls      TEXT[],                        -- array of media URLs
    link_url        VARCHAR(1000),                 -- shared link
    link_preview    JSONB,                         -- {"title": "...", "description": "...", "image": "..."}
    
    -- Metadata
    visibility      post_visibility NOT NULL DEFAULT 'public',
    hashtags        TEXT[],
    mentions        UUID[],                        -- mentioned user IDs
    
    -- Engagement counters (denormalized)
    like_count      INT DEFAULT 0,
    comment_count   INT DEFAULT 0,
    share_count     INT DEFAULT 0,
    view_count      INT DEFAULT 0,
    
    -- AI-generated
    ai_summary      TEXT,                          -- AI-generated summary for search
    embedding_id    VARCHAR(100),                  -- reference to Qdrant vector
    readability_score FLOAT,                       -- AI readability score
    
    -- Status
    is_pinned       BOOLEAN DEFAULT false,
    is_edited       BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ,                   -- soft delete
    
    -- Parent for shares/reposts
    original_post_id UUID REFERENCES posts(id),
    
    CONSTRAINT posts_content_not_empty CHECK (text_content IS NOT NULL OR media_urls IS NOT NULL OR link_url IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_posts_author ON posts (author_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts (created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts (content_type) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_posts_hashtags ON posts USING GIN (hashtags) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_posts_visibility ON posts (visibility) WHERE deleted_at IS NULL;

-- ============================================================
-- POST REACTIONS (likes, celebrates, insightful, etc.)
-- ============================================================

CREATE TYPE IF NOT EXISTS reaction_type AS ENUM (
    'like',
    'celebrate',
    'insightful',
    'curious',
    'support'
);

CREATE TABLE IF NOT EXISTS post_reactions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id         UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reaction        reaction_type NOT NULL DEFAULT 'like',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT reaction_unique UNIQUE (post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reactions_post ON post_reactions (post_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user ON post_reactions (user_id);

-- ============================================================
-- COMMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS comments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id         UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id       UUID REFERENCES comments(id),  -- threaded comments
    content         TEXT NOT NULL,
    media_url       VARCHAR(500),
    
    like_count      INT DEFAULT 0,
    reply_count     INT DEFAULT 0,
    
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_comments_post ON comments (post_id, created_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_comments_author ON comments (author_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments (parent_id) WHERE parent_id IS NOT NULL;

-- ============================================================
-- FEED TABLE — denormalized for fast feed reads
-- (Replaces Cassandra home_feed in Phase 0)
-- ============================================================

CREATE TABLE IF NOT EXISTS user_feed (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL,
    post_id         UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id       UUID NOT NULL,
    score           FLOAT DEFAULT 0,               -- ML ranking score
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT feed_entry_unique UNIQUE (user_id, post_id)
);

CREATE INDEX IF NOT EXISTS idx_feed_user ON user_feed (user_id, score DESC, created_at DESC);
