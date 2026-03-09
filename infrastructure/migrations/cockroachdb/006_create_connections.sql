-- Nexus: Connections & Social Graph (SQL layer)
-- Primary graph lives in Neo4j; this provides transactional consistency

CREATE TYPE IF NOT EXISTS connection_status AS ENUM (
    'pending',
    'accepted',
    'declined',
    'blocked'
);

CREATE TABLE IF NOT EXISTS connections (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status          connection_status NOT NULL DEFAULT 'pending',
    message         VARCHAR(500),                  -- connection request message
    strength_score  FLOAT DEFAULT 0.5,             -- AI-computed relationship strength (0-1)
    
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    connected_at    TIMESTAMPTZ,                   -- when accepted
    
    CONSTRAINT connection_unique UNIQUE (requester_id, receiver_id),
    CONSTRAINT no_self_connection CHECK (requester_id != receiver_id)
);

CREATE INDEX IF NOT EXISTS idx_connections_requester ON connections (requester_id, status);
CREATE INDEX IF NOT EXISTS idx_connections_receiver ON connections (receiver_id, status);
CREATE INDEX IF NOT EXISTS idx_connections_accepted ON connections (requester_id) WHERE status = 'accepted';

-- ============================================================
-- FOLLOWS (asymmetric — follow without connection)
-- ============================================================

CREATE TABLE IF NOT EXISTS follows (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT follow_unique UNIQUE (follower_id, following_id),
    CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows (follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows (following_id);
