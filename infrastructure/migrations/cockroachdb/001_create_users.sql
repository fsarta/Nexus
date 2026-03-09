-- Nexus: User Profiles & Authentication Schema
-- Database: CockroachDB (SQL-compatible, globally distributed)
-- Designed for 1B+ accounts with geo-partitioning support

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE IF NOT EXISTS account_tier AS ENUM (
    'free',
    'professional',
    'pro_business',
    'startup',
    'enterprise_social',
    'enterprise_sales',
    'custom_enterprise'
);

CREATE TYPE IF NOT EXISTS verification_status AS ENUM (
    'unverified',
    'email_verified',
    'identity_verified',
    'enterprise_verified'
);

CREATE TYPE IF NOT EXISTS open_to_work_status AS ENUM (
    'not_open',
    'open_private',        -- visible only to recruiters
    'open_public',         -- visible to everyone
    'open_targeted'        -- visible to selected companies only
);

-- ============================================================
-- USERS TABLE
-- Core identity table — every account starts here
-- UUID v7 (time-ordered) for range-based sharding without hot spots
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username        VARCHAR(50) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    password_hash   VARCHAR(255),                  -- NULL for OAuth-only users
    full_name       VARCHAR(200) NOT NULL,
    headline        VARCHAR(300),                  -- "Senior Engineer at Google"
    bio             TEXT,
    avatar_url      VARCHAR(500),
    cover_url       VARCHAR(500),
    location        VARCHAR(200),
    country_code    CHAR(2),                       -- ISO 3166-1 alpha-2
    industry        VARCHAR(100),
    pronouns        VARCHAR(30),
    languages       TEXT[],                        -- ['en', 'it', 'de']
    website_url     VARCHAR(500),
    
    -- Nexus-specific fields
    account_tier    account_tier NOT NULL DEFAULT 'free',
    verification    verification_status NOT NULL DEFAULT 'unverified',
    career_score    SMALLINT DEFAULT 0 CHECK (career_score >= 0 AND career_score <= 100),
    open_to_work    open_to_work_status NOT NULL DEFAULT 'not_open',
    
    -- Video intro
    video_intro_url     VARCHAR(500),
    video_intro_transcript TEXT,
    
    -- Counters (denormalized for performance)
    connection_count    INT DEFAULT 0,
    follower_count      INT DEFAULT 0,
    following_count     INT DEFAULT 0,
    post_count          INT DEFAULT 0,
    
    -- Timestamps
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ,                   -- soft delete for GDPR
    last_login_at   TIMESTAMPTZ,
    email_verified_at TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT users_username_unique UNIQUE (username),
    CONSTRAINT users_email_unique UNIQUE (email),
    CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- ============================================================
-- INDEXES — optimized for common access patterns
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_username ON users (username) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_industry ON users (industry) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_location ON users (country_code, location) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_tier ON users (account_tier) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_career_score ON users (career_score DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_open_to_work ON users (open_to_work) WHERE open_to_work != 'not_open' AND deleted_at IS NULL;

-- ============================================================
-- REFRESH TOKENS — JWT refresh token storage
-- ============================================================

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash      VARCHAR(255) NOT NULL,         -- bcrypt hash of the refresh token
    device_info     VARCHAR(500),                  -- user agent / device fingerprint
    ip_address      INET,
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    revoked_at      TIMESTAMPTZ,
    
    CONSTRAINT refresh_tokens_hash_unique UNIQUE (token_hash)
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens (user_id) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires ON refresh_tokens (expires_at) WHERE revoked_at IS NULL;
