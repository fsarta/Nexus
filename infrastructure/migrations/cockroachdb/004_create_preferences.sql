-- Nexus: User Preferences & Work Settings
-- Confidential salary and work preference data

CREATE TYPE IF NOT EXISTS work_mode AS ENUM ('remote', 'hybrid', 'onsite', 'flexible');

CREATE TABLE IF NOT EXISTS user_preferences (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Work style preferences
    preferred_work_mode     work_mode DEFAULT 'flexible',
    preferred_company_sizes TEXT[],            -- ['startup', 'mid-market', 'enterprise']
    preferred_industries    TEXT[],            -- ['fintech', 'healthcare', 'saas']
    willing_to_relocate     BOOLEAN DEFAULT false,
    preferred_locations     TEXT[],            -- ['Berlin', 'Remote EU', 'San Francisco']
    
    -- Salary expectations (encrypted at application level)
    salary_expectations     JSONB,             -- {"min": 80000, "max": 120000, "currency": "EUR", "includes_equity": true}
    equity_expectations     JSONB,             -- {"min_percentage": 0.1, "vesting_years": 4}
    
    -- Culture preferences
    culture_values          TEXT[],            -- ['innovation', 'work-life-balance', 'diversity']
    team_size_preference    VARCHAR(50),       -- 'small' / 'medium' / 'large'
    
    -- Notification preferences
    email_digest            VARCHAR(20) DEFAULT 'daily',  -- 'realtime', 'daily', 'weekly', 'off'
    push_notifications      BOOLEAN DEFAULT true,
    job_alerts              BOOLEAN DEFAULT true,
    connection_alerts       BOOLEAN DEFAULT true,
    
    -- Privacy settings
    profile_visibility      VARCHAR(20) DEFAULT 'public', -- 'public', 'connections', 'private'
    show_email              BOOLEAN DEFAULT false,
    show_activity           BOOLEAN DEFAULT true,
    allow_indexing           BOOLEAN DEFAULT true,         -- search engine indexing
    
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT user_preferences_user_unique UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_prefs_user ON user_preferences (user_id);
