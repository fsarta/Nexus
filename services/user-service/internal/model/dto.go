package model

import (
	"time"

	"github.com/google/uuid"
)

// RegisterRequest represents the user registration payload
type RegisterRequest struct {
	Username string `json:"username" binding:"required,min=3,max=50"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8,max=128"`
	FullName string `json:"full_name" binding:"required,min=2,max=200"`
}

// LoginRequest represents the login payload
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// RefreshRequest represents the token refresh payload
type RefreshRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

// AuthResponse is returned after successful login/register
type AuthResponse struct {
	AccessToken  string    `json:"access_token"`
	RefreshToken string    `json:"refresh_token"`
	TokenType    string    `json:"token_type"`
	ExpiresIn    int64     `json:"expires_in"` // seconds
	User         UserDTO   `json:"user"`
}

// UserDTO is the public user representation (no sensitive data)
type UserDTO struct {
	ID              uuid.UUID          `json:"id"`
	Username        string             `json:"username"`
	Email           string             `json:"email"`
	FullName        string             `json:"full_name"`
	Headline        *string            `json:"headline,omitempty"`
	Bio             *string            `json:"bio,omitempty"`
	AvatarURL       *string            `json:"avatar_url,omitempty"`
	CoverURL        *string            `json:"cover_url,omitempty"`
	Location        *string            `json:"location,omitempty"`
	CountryCode     *string            `json:"country_code,omitempty"`
	Industry        *string            `json:"industry,omitempty"`
	AccountTier     AccountTier        `json:"account_tier"`
	Verification    VerificationStatus `json:"verification"`
	CareerScore     int16              `json:"career_score"`
	OpenToWork      OpenToWork         `json:"open_to_work"`
	ConnectionCount int                `json:"connection_count"`
	FollowerCount   int                `json:"follower_count"`
	PostCount       int                `json:"post_count"`
	CreatedAt       time.Time          `json:"created_at"`
}

// UpdateUserRequest represents a profile update
type UpdateUserRequest struct {
	FullName    *string  `json:"full_name,omitempty" binding:"omitempty,min=2,max=200"`
	Headline    *string  `json:"headline,omitempty" binding:"omitempty,max=300"`
	Bio         *string  `json:"bio,omitempty"`
	Location    *string  `json:"location,omitempty" binding:"omitempty,max=200"`
	CountryCode *string  `json:"country_code,omitempty" binding:"omitempty,len=2"`
	Industry    *string  `json:"industry,omitempty" binding:"omitempty,max=100"`
	Pronouns    *string  `json:"pronouns,omitempty" binding:"omitempty,max=30"`
	WebsiteURL  *string  `json:"website_url,omitempty" binding:"omitempty,url,max=500"`
	Languages   []string `json:"languages,omitempty"`
}

// AddSkillRequest represents adding a skill to a user's profile
type AddSkillRequest struct {
	SkillID          uuid.UUID `json:"skill_id" binding:"required"`
	ProficiencyLevel int16     `json:"proficiency_level" binding:"required,min=1,max=100"`
	YearsExperience  *int16    `json:"years_experience,omitempty" binding:"omitempty,min=0,max=50"`
	IsPrimary        bool      `json:"is_primary"`
}

// AddExperienceRequest represents adding professional experience
type AddExperienceRequest struct {
	CompanyName    string                 `json:"company_name" binding:"required,max=200"`
	Title          string                 `json:"title" binding:"required,max=200"`
	Description    *string                `json:"description,omitempty"`
	Location       *string                `json:"location,omitempty" binding:"omitempty,max=200"`
	EmploymentType *string                `json:"employment_type,omitempty"`
	StartDate      string                 `json:"start_date" binding:"required"` // YYYY-MM-DD
	EndDate        *string                `json:"end_date,omitempty"`
	IsCurrent      bool                   `json:"is_current"`
	ImpactMetrics  map[string]interface{} `json:"impact_metrics,omitempty"`
	SkillsUsed     []string               `json:"skills_used,omitempty"`
}

// ToDTO converts a User model to the public DTO
func (u *User) ToDTO() UserDTO {
	return UserDTO{
		ID:              u.ID,
		Username:        u.Username,
		Email:           u.Email,
		FullName:        u.FullName,
		Headline:        u.Headline,
		Bio:             u.Bio,
		AvatarURL:       u.AvatarURL,
		CoverURL:        u.CoverURL,
		Location:        u.Location,
		CountryCode:     u.CountryCode,
		Industry:        u.Industry,
		AccountTier:     u.AccountTier,
		Verification:    u.Verification,
		CareerScore:     u.CareerScore,
		OpenToWork:      u.OpenToWork,
		ConnectionCount: u.ConnectionCount,
		FollowerCount:   u.FollowerCount,
		PostCount:       u.PostCount,
		CreatedAt:       u.CreatedAt,
	}
}

// ErrorResponse is the standard API error format
type ErrorResponse struct {
	Error   string `json:"error"`
	Code    string `json:"code,omitempty"`
	Details string `json:"details,omitempty"`
}

// PaginatedResponse wraps paginated results
type PaginatedResponse struct {
	Data       interface{} `json:"data"`
	Cursor     *string     `json:"cursor,omitempty"`
	HasMore    bool        `json:"has_more"`
	TotalCount *int64      `json:"total_count,omitempty"`
}
