package repository

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/nexus-platform/user-service/internal/model"
)

// UserRepository handles user data persistence in CockroachDB
type UserRepository struct {
	pool *pgxpool.Pool
}

// NewUserRepository creates a new UserRepository
func NewUserRepository(pool *pgxpool.Pool) *UserRepository {
	return &UserRepository{pool: pool}
}

// ErrNotFound is returned when a user is not found
var ErrNotFound = errors.New("user not found")

// ErrDuplicate is returned when a unique constraint is violated
var ErrDuplicate = errors.New("user already exists")

// Create inserts a new user into the database
func (r *UserRepository) Create(ctx context.Context, user *model.User) error {
	query := `
		INSERT INTO users (id, username, email, password_hash, full_name, headline, bio, location, country_code, industry, account_tier, verification)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING created_at, updated_at`

	user.ID = uuid.New()
	err := r.pool.QueryRow(ctx, query,
		user.ID, user.Username, user.Email, user.PasswordHash,
		user.FullName, user.Headline, user.Bio,
		user.Location, user.CountryCode, user.Industry,
		user.AccountTier, user.Verification,
	).Scan(&user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		if isDuplicateError(err) {
			return ErrDuplicate
		}
		return fmt.Errorf("create user: %w", err)
	}
	return nil
}

// GetByID retrieves a user by their UUID
func (r *UserRepository) GetByID(ctx context.Context, id uuid.UUID) (*model.User, error) {
	query := `
		SELECT id, username, email, password_hash, full_name, headline, bio,
			avatar_url, cover_url, location, country_code, industry, pronouns,
			languages, website_url, account_tier, verification, career_score,
			open_to_work, connection_count, follower_count, following_count,
			post_count, created_at, updated_at, last_login_at, email_verified_at
		FROM users
		WHERE id = $1 AND deleted_at IS NULL`

	user := &model.User{}
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&user.ID, &user.Username, &user.Email, &user.PasswordHash,
		&user.FullName, &user.Headline, &user.Bio,
		&user.AvatarURL, &user.CoverURL, &user.Location,
		&user.CountryCode, &user.Industry, &user.Pronouns,
		&user.Languages, &user.WebsiteURL, &user.AccountTier,
		&user.Verification, &user.CareerScore, &user.OpenToWork,
		&user.ConnectionCount, &user.FollowerCount, &user.FollowingCount,
		&user.PostCount, &user.CreatedAt, &user.UpdatedAt,
		&user.LastLoginAt, &user.EmailVerifiedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("get user by id: %w", err)
	}
	return user, nil
}

// GetByEmail retrieves a user by email (for auth)
func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*model.User, error) {
	query := `
		SELECT id, username, email, password_hash, full_name, headline, bio,
			avatar_url, cover_url, location, country_code, industry,
			account_tier, verification, career_score, open_to_work,
			connection_count, follower_count, following_count, post_count,
			created_at, updated_at
		FROM users
		WHERE email = $1 AND deleted_at IS NULL`

	user := &model.User{}
	err := r.pool.QueryRow(ctx, query, email).Scan(
		&user.ID, &user.Username, &user.Email, &user.PasswordHash,
		&user.FullName, &user.Headline, &user.Bio,
		&user.AvatarURL, &user.CoverURL, &user.Location,
		&user.CountryCode, &user.Industry,
		&user.AccountTier, &user.Verification, &user.CareerScore,
		&user.OpenToWork, &user.ConnectionCount, &user.FollowerCount,
		&user.FollowingCount, &user.PostCount,
		&user.CreatedAt, &user.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("get user by email: %w", err)
	}
	return user, nil
}

// Update updates a user's profile fields
func (r *UserRepository) Update(ctx context.Context, id uuid.UUID, req *model.UpdateUserRequest) (*model.User, error) {
	query := `
		UPDATE users SET
			full_name = COALESCE($2, full_name),
			headline = COALESCE($3, headline),
			bio = COALESCE($4, bio),
			location = COALESCE($5, location),
			country_code = COALESCE($6, country_code),
			industry = COALESCE($7, industry),
			pronouns = COALESCE($8, pronouns),
			website_url = COALESCE($9, website_url),
			updated_at = now()
		WHERE id = $1 AND deleted_at IS NULL
		RETURNING id, username, email, full_name, headline, bio, location, country_code,
			industry, account_tier, verification, career_score, open_to_work,
			connection_count, follower_count, post_count, created_at, updated_at`

	user := &model.User{}
	err := r.pool.QueryRow(ctx, query,
		id, req.FullName, req.Headline, req.Bio,
		req.Location, req.CountryCode, req.Industry,
		req.Pronouns, req.WebsiteURL,
	).Scan(
		&user.ID, &user.Username, &user.Email, &user.FullName,
		&user.Headline, &user.Bio, &user.Location, &user.CountryCode,
		&user.Industry, &user.AccountTier, &user.Verification,
		&user.CareerScore, &user.OpenToWork, &user.ConnectionCount,
		&user.FollowerCount, &user.PostCount, &user.CreatedAt, &user.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("update user: %w", err)
	}
	return user, nil
}

// SoftDelete marks a user as deleted (GDPR right to erasure)
func (r *UserRepository) SoftDelete(ctx context.Context, id uuid.UUID) error {
	query := `UPDATE users SET deleted_at = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL`
	result, err := r.pool.Exec(ctx, query, id)
	if err != nil {
		return fmt.Errorf("soft delete user: %w", err)
	}
	if result.RowsAffected() == 0 {
		return ErrNotFound
	}
	return nil
}

// UpdateLastLogin updates the user's last login timestamp
func (r *UserRepository) UpdateLastLogin(ctx context.Context, id uuid.UUID) error {
	query := `UPDATE users SET last_login_at = now() WHERE id = $1`
	_, err := r.pool.Exec(ctx, query, id)
	return err
}

// GetSkills returns all skills for a user
func (r *UserRepository) GetSkills(ctx context.Context, userID uuid.UUID) ([]model.UserSkill, error) {
	query := `
		SELECT us.id, us.user_id, us.skill_id, s.name as skill_name,
			us.proficiency_level, us.years_experience, us.verification_method,
			us.verified_at, us.endorsement_count, us.is_primary, us.created_at
		FROM user_skills us
		JOIN skills s ON s.id = us.skill_id
		WHERE us.user_id = $1
		ORDER BY us.is_primary DESC, us.proficiency_level DESC`

	rows, err := r.pool.Query(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("get user skills: %w", err)
	}
	defer rows.Close()

	var skills []model.UserSkill
	for rows.Next() {
		var skill model.UserSkill
		if err := rows.Scan(
			&skill.ID, &skill.UserID, &skill.SkillID, &skill.SkillName,
			&skill.ProficiencyLevel, &skill.YearsExperience,
			&skill.VerificationMethod, &skill.VerifiedAt,
			&skill.EndorsementCount, &skill.IsPrimary, &skill.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan user skill: %w", err)
		}
		skills = append(skills, skill)
	}
	return skills, nil
}

// GetExperiences returns all experiences for a user
func (r *UserRepository) GetExperiences(ctx context.Context, userID uuid.UUID) ([]model.UserExperience, error) {
	query := `
		SELECT id, user_id, company_name, company_id, title, description,
			location, employment_type, start_date, end_date, is_current,
			impact_metrics, skills_used, verified, created_at, updated_at
		FROM user_experiences
		WHERE user_id = $1
		ORDER BY is_current DESC, start_date DESC`

	rows, err := r.pool.Query(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("get user experiences: %w", err)
	}
	defer rows.Close()

	var experiences []model.UserExperience
	for rows.Next() {
		var exp model.UserExperience
		if err := rows.Scan(
			&exp.ID, &exp.UserID, &exp.CompanyName, &exp.CompanyID,
			&exp.Title, &exp.Description, &exp.Location, &exp.EmploymentType,
			&exp.StartDate, &exp.EndDate, &exp.IsCurrent,
			&exp.ImpactMetrics, &exp.SkillsUsed, &exp.Verified,
			&exp.CreatedAt, &exp.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan experience: %w", err)
		}
		experiences = append(experiences, exp)
	}
	return experiences, nil
}

// isDuplicateError checks if a pgx error is a unique constraint violation
func isDuplicateError(err error) bool {
	// CockroachDB returns error code 23505 for unique violations
	return err != nil && (errors.Is(err, pgx.ErrNoRows) == false) &&
		(fmt.Sprintf("%v", err) != "" && containsDuplicateMsg(err.Error()))
}

func containsDuplicateMsg(msg string) bool {
	return len(msg) > 0 && (contains(msg, "duplicate key") || contains(msg, "unique constraint"))
}

func contains(s, substr string) bool {
	return len(s) >= len(substr) && searchString(s, substr)
}

func searchString(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}

// Ensure unused import doesn't cause compile error
var _ = time.Now
