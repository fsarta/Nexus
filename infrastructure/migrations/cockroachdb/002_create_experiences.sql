-- Nexus: User Experiences Schema
-- Professional experience with AI-generated impact metrics

CREATE TABLE IF NOT EXISTS user_experiences (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name    VARCHAR(200) NOT NULL,
    company_id      UUID,                          -- FK to companies table (when exists)
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    location        VARCHAR(200),
    employment_type VARCHAR(50),                   -- full-time, part-time, contract, freelance, internship
    
    -- Duration
    start_date      DATE NOT NULL,
    end_date        DATE,                          -- NULL = current position
    is_current      BOOLEAN NOT NULL DEFAULT false,
    
    -- AI-enhanced fields
    impact_metrics  JSONB DEFAULT '{}',            -- {"revenue_impact": "$2M ARR", "team_size": 12, "key_achievement": "..."}
    skills_used     TEXT[],                        -- ['Go', 'Kubernetes', 'PostgreSQL']
    
    -- Verification
    verified        BOOLEAN NOT NULL DEFAULT false,
    verified_by     UUID,                          -- user who endorsed this experience
    verified_at     TIMESTAMPTZ,
    
    -- Ordering & timestamps
    display_order   SMALLINT DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT exp_dates_valid CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_experiences_user ON user_experiences (user_id, display_order);
CREATE INDEX IF NOT EXISTS idx_experiences_company ON user_experiences (company_id) WHERE company_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_experiences_current ON user_experiences (user_id) WHERE is_current = true;

-- GIN index for skills array search
CREATE INDEX IF NOT EXISTS idx_experiences_skills ON user_experiences USING GIN (skills_used);
