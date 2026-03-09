-- Nexus: Direct Messaging Schema
-- Supports: user-to-user, company-to-user, company-to-company conversations
-- Designed for high-throughput messaging with read receipts and typing indicators

-- ============================================================
-- PARTICIPANT TYPE — who can be in a conversation
-- ============================================================

CREATE TYPE IF NOT EXISTS participant_type AS ENUM (
    'user',
    'company'
);

CREATE TYPE IF NOT EXISTS conversation_type AS ENUM (
    'direct',          -- 1:1 between two entities
    'group'            -- multiple participants (future: team channels)
);

CREATE TYPE IF NOT EXISTS message_type AS ENUM (
    'text',
    'image',
    'file',
    'video',
    'audio',
    'system',          -- "X joined the conversation", "X left"
    'card'             -- rich card (job offer, profile share, etc.)
);

-- ============================================================
-- CONVERSATIONS — a thread between 2+ participants
-- ============================================================

CREATE TABLE IF NOT EXISTS conversations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type            conversation_type NOT NULL DEFAULT 'direct',
    
    -- Metadata
    title           VARCHAR(200),          -- NULL for direct, set for group
    avatar_url      VARCHAR(500),          -- group avatar
    created_by_type participant_type NOT NULL DEFAULT 'user',
    created_by_id   UUID NOT NULL,         -- user_id or company_id
    
    -- Denormalized for fast listing
    last_message_id     UUID,
    last_message_text   VARCHAR(500),      -- preview text
    last_message_at     TIMESTAMPTZ,
    last_message_sender VARCHAR(200),      -- sender name for preview
    message_count       INT DEFAULT 0,
    
    -- Status
    is_archived     BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversations_updated ON conversations (updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_creator ON conversations (created_by_type, created_by_id);

-- ============================================================
-- CONVERSATION PARTICIPANTS — who is in each conversation
-- An entity is either a 'user' or a 'company'
-- ============================================================

CREATE TABLE IF NOT EXISTS conversation_participants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    
    -- Polymorphic participant: either user or company
    participant_type participant_type NOT NULL,
    participant_id   UUID NOT NULL,         -- user_id or company_id depending on type
    
    -- Display name (denormalized for performance)
    display_name    VARCHAR(200) NOT NULL,
    avatar_url      VARCHAR(500),
    
    -- Per-participant state
    last_read_at    TIMESTAMPTZ,           -- when they last read messages
    last_read_message_id UUID,             -- last message they read
    unread_count    INT DEFAULT 0,
    is_muted        BOOLEAN DEFAULT false,
    is_pinned       BOOLEAN DEFAULT false,
    
    -- Notification preferences for this conversation
    notifications   VARCHAR(20) DEFAULT 'all',  -- 'all', 'mentions', 'none'
    
    -- Participant lifecycle
    joined_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    left_at         TIMESTAMPTZ,           -- NULL = still in conversation
    
    -- Unique: one participant entry per entity per conversation
    CONSTRAINT participant_unique UNIQUE (conversation_id, participant_type, participant_id)
);

CREATE INDEX IF NOT EXISTS idx_participants_entity ON conversation_participants (participant_type, participant_id, left_at)
    WHERE left_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_participants_conversation ON conversation_participants (conversation_id)
    WHERE left_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_participants_unread ON conversation_participants (participant_type, participant_id, unread_count DESC)
    WHERE left_at IS NULL AND unread_count > 0;

-- ============================================================
-- MESSAGES — individual messages within conversations
-- ============================================================

CREATE TABLE IF NOT EXISTS messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    
    -- Sender (polymorphic: user or company)
    sender_type     participant_type NOT NULL,
    sender_id       UUID NOT NULL,
    sender_name     VARCHAR(200) NOT NULL,     -- denormalized
    sender_avatar   VARCHAR(500),              -- denormalized
    
    -- Content
    message_type    message_type NOT NULL DEFAULT 'text',
    content         TEXT,                      -- text content or system message
    
    -- Rich content
    media_url       VARCHAR(1000),             -- image/file/video/audio URL
    media_mime_type VARCHAR(100),              -- e.g. 'image/png', 'application/pdf'
    media_size      BIGINT,                    -- file size in bytes
    media_filename  VARCHAR(500),              -- original filename
    
    -- Rich card data (job share, profile share, etc.)
    card_data       JSONB,                     -- {"type": "job_share", "job_id": "...", "title": "..."}
    
    -- Reply threading
    reply_to_id     UUID REFERENCES messages(id),
    reply_to_text   VARCHAR(300),              -- preview of the replied message
    reply_to_sender VARCHAR(200),              -- name of the replied message sender
    
    -- Message state
    is_edited       BOOLEAN DEFAULT false,
    edited_at       TIMESTAMPTZ,
    is_deleted      BOOLEAN DEFAULT false,     -- soft delete — shows "message deleted"
    deleted_at      TIMESTAMPTZ,
    
    -- Timestamps
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT message_has_content CHECK (
        content IS NOT NULL OR media_url IS NOT NULL OR card_data IS NOT NULL
    )
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages (conversation_id, created_at DESC)
    WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages (sender_type, sender_id, created_at DESC);

-- ============================================================
-- MESSAGE READ RECEIPTS — track who read which message
-- ============================================================

CREATE TABLE IF NOT EXISTS message_read_receipts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id      UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    reader_type     participant_type NOT NULL,
    reader_id       UUID NOT NULL,
    read_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT read_receipt_unique UNIQUE (message_id, reader_type, reader_id)
);

CREATE INDEX IF NOT EXISTS idx_read_receipts_message ON message_read_receipts (message_id);

-- ============================================================
-- HELPER VIEW: find existing direct conversation between two entities
-- ============================================================

-- To find if a direct conversation already exists between two participants:
-- SELECT c.id FROM conversations c
-- JOIN conversation_participants p1 ON p1.conversation_id = c.id
--   AND p1.participant_type = $1 AND p1.participant_id = $2 AND p1.left_at IS NULL
-- JOIN conversation_participants p2 ON p2.conversation_id = c.id
--   AND p2.participant_type = $3 AND p2.participant_id = $4 AND p2.left_at IS NULL
-- WHERE c.type = 'direct'
-- LIMIT 1;
