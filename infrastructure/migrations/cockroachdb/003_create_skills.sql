-- Nexus: Skills & Verification Schema
-- Multi-level verified skill system with on-chain attestation support

CREATE TYPE IF NOT EXISTS skill_category AS ENUM (
    'technical',
    'soft_skill',
    'language',
    'certification',
    'tool',
    'methodology',
    'industry_knowledge'
);

CREATE TYPE IF NOT EXISTS verification_method AS ENUM (
    'self_declared',
    'test_passed',
    'peer_endorsement',
    'blockchain_attestation',
    'certification_upload'
);

-- ============================================================
-- SKILLS CATALOG — global skills taxonomy
-- ============================================================

CREATE TABLE IF NOT EXISTS skills (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(100) NOT NULL,
    category        skill_category NOT NULL DEFAULT 'technical',
    parent_id       UUID REFERENCES skills(id),    -- hierarchical skills (e.g., "JavaScript" → "React")
    description     TEXT,
    icon_url        VARCHAR(500),
    
    -- Popularity & matching
    user_count      INT DEFAULT 0,                 -- how many users have this skill
    job_demand      INT DEFAULT 0,                 -- how many open jobs require this
    trending_score  FLOAT DEFAULT 0,               -- AI-computed trending score
    
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT skills_slug_unique UNIQUE (slug)
);

CREATE INDEX IF NOT EXISTS idx_skills_name ON skills (name);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills (category);
CREATE INDEX IF NOT EXISTS idx_skills_parent ON skills (parent_id);

-- ============================================================
-- USER_SKILLS — junction table with proficiency & verification
-- ============================================================

CREATE TABLE IF NOT EXISTS user_skills (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id            UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    
    -- Proficiency
    proficiency_level   SMALLINT NOT NULL DEFAULT 50 CHECK (proficiency_level >= 1 AND proficiency_level <= 100),
    years_experience    SMALLINT,
    
    -- Verification
    verification_method verification_method NOT NULL DEFAULT 'self_declared',
    verified_at         TIMESTAMPTZ,
    certificate_hash    VARCHAR(255),              -- on-chain attestation hash (Ethereum/Polygon)
    certificate_url     VARCHAR(500),
    test_score          SMALLINT,                  -- score from skill test (0-100)
    
    -- Endorsements
    endorsement_count   INT DEFAULT 0,
    
    -- Display
    is_primary          BOOLEAN DEFAULT false,     -- top skills shown on profile
    display_order       SMALLINT DEFAULT 0,
    
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT user_skills_unique UNIQUE (user_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_user_skills_user ON user_skills (user_id, display_order);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill ON user_skills (skill_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_verified ON user_skills (user_id) WHERE verification_method != 'self_declared';
CREATE INDEX IF NOT EXISTS idx_user_skills_primary ON user_skills (user_id) WHERE is_primary = true;

-- ============================================================
-- SKILL ENDORSEMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS skill_endorsements (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_skill_id   UUID NOT NULL REFERENCES user_skills(id) ON DELETE CASCADE,
    endorser_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message         VARCHAR(500),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT endorsement_unique UNIQUE (user_skill_id, endorser_id)
);

CREATE INDEX IF NOT EXISTS idx_endorsements_skill ON skill_endorsements (user_skill_id);
CREATE INDEX IF NOT EXISTS idx_endorsements_endorser ON skill_endorsements (endorser_id);
