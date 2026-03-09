package model

import (
	"time"

	"github.com/google/uuid"
)

// AccountTier represents the user's subscription level
type AccountTier string

const (
	TierFree             AccountTier = "free"
	TierProfessional     AccountTier = "professional"
	TierProBusiness      AccountTier = "pro_business"
	TierStartup          AccountTier = "startup"
	TierEnterpriseSocial AccountTier = "enterprise_social"
	TierEnterpriseSales  AccountTier = "enterprise_sales"
	TierCustomEnterprise AccountTier = "custom_enterprise"
)

// VerificationStatus represents the user's identity verification level
type VerificationStatus string

const (
	VerificationUnverified       VerificationStatus = "unverified"
	VerificationEmailVerified    VerificationStatus = "email_verified"
	VerificationIdentityVerified VerificationStatus = "identity_verified"
	VerificationEnterprise       VerificationStatus = "enterprise_verified"
)

// OpenToWork represents job-seeking visibility
type OpenToWork string

const (
	OpenToWorkNo       OpenToWork = "not_open"
	OpenToWorkPrivate  OpenToWork = "open_private"
	OpenToWorkPublic   OpenToWork = "open_public"
	OpenToWorkTargeted OpenToWork = "open_targeted"
)

// User represents the core user entity
type User struct {
	ID               uuid.UUID          `json:"id" db:"id"`
	Username         string             `json:"username" db:"username"`
	Email            string             `json:"email" db:"email"`
	PasswordHash     *string            `json:"-" db:"password_hash"` // never serialize
	FullName         string             `json:"full_name" db:"full_name"`
	Headline         *string            `json:"headline,omitempty" db:"headline"`
	Bio              *string            `json:"bio,omitempty" db:"bio"`
	AvatarURL        *string            `json:"avatar_url,omitempty" db:"avatar_url"`
	CoverURL         *string            `json:"cover_url,omitempty" db:"cover_url"`
	Location         *string            `json:"location,omitempty" db:"location"`
	CountryCode      *string            `json:"country_code,omitempty" db:"country_code"`
	Industry         *string            `json:"industry,omitempty" db:"industry"`
	Pronouns         *string            `json:"pronouns,omitempty" db:"pronouns"`
	Languages        []string           `json:"languages,omitempty" db:"languages"`
	WebsiteURL       *string            `json:"website_url,omitempty" db:"website_url"`
	AccountTier      AccountTier        `json:"account_tier" db:"account_tier"`
	Verification     VerificationStatus `json:"verification" db:"verification"`
	CareerScore      int16              `json:"career_score" db:"career_score"`
	OpenToWork       OpenToWork         `json:"open_to_work" db:"open_to_work"`
	ConnectionCount  int                `json:"connection_count" db:"connection_count"`
	FollowerCount    int                `json:"follower_count" db:"follower_count"`
	FollowingCount   int                `json:"following_count" db:"following_count"`
	PostCount        int                `json:"post_count" db:"post_count"`
	CreatedAt        time.Time          `json:"created_at" db:"created_at"`
	UpdatedAt        time.Time          `json:"updated_at" db:"updated_at"`
	DeletedAt        *time.Time         `json:"-" db:"deleted_at"`
	LastLoginAt      *time.Time         `json:"last_login_at,omitempty" db:"last_login_at"`
	EmailVerifiedAt  *time.Time         `json:"email_verified_at,omitempty" db:"email_verified_at"`
}

// UserSkill represents a user's skill with proficiency and verification
type UserSkill struct {
	ID                 uuid.UUID  `json:"id" db:"id"`
	UserID             uuid.UUID  `json:"user_id" db:"user_id"`
	SkillID            uuid.UUID  `json:"skill_id" db:"skill_id"`
	SkillName          string     `json:"skill_name" db:"skill_name"` // joined from skills table
	ProficiencyLevel   int16      `json:"proficiency_level" db:"proficiency_level"`
	YearsExperience    *int16     `json:"years_experience,omitempty" db:"years_experience"`
	VerificationMethod string     `json:"verification_method" db:"verification_method"`
	VerifiedAt         *time.Time `json:"verified_at,omitempty" db:"verified_at"`
	EndorsementCount   int        `json:"endorsement_count" db:"endorsement_count"`
	IsPrimary          bool       `json:"is_primary" db:"is_primary"`
	CreatedAt          time.Time  `json:"created_at" db:"created_at"`
}

// UserExperience represents a professional experience entry
type UserExperience struct {
	ID             uuid.UUID              `json:"id" db:"id"`
	UserID         uuid.UUID              `json:"user_id" db:"user_id"`
	CompanyName    string                 `json:"company_name" db:"company_name"`
	CompanyID      *uuid.UUID             `json:"company_id,omitempty" db:"company_id"`
	Title          string                 `json:"title" db:"title"`
	Description    *string                `json:"description,omitempty" db:"description"`
	Location       *string                `json:"location,omitempty" db:"location"`
	EmploymentType *string                `json:"employment_type,omitempty" db:"employment_type"`
	StartDate      time.Time              `json:"start_date" db:"start_date"`
	EndDate        *time.Time             `json:"end_date,omitempty" db:"end_date"`
	IsCurrent      bool                   `json:"is_current" db:"is_current"`
	ImpactMetrics  map[string]interface{} `json:"impact_metrics,omitempty" db:"impact_metrics"`
	SkillsUsed     []string               `json:"skills_used,omitempty" db:"skills_used"`
	Verified       bool                   `json:"verified" db:"verified"`
	CreatedAt      time.Time              `json:"created_at" db:"created_at"`
	UpdatedAt      time.Time              `json:"updated_at" db:"updated_at"`
}
