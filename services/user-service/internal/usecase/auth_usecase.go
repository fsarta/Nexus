package usecase

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"

	"github.com/nexus-platform/user-service/internal/model"
	"github.com/nexus-platform/user-service/internal/repository"
)

// AuthUseCase handles authentication business logic
type AuthUseCase struct {
	userRepo  *repository.UserRepository
	tokenRepo *repository.TokenRepository
	cacheRepo *repository.CacheRepository
	jwtSecret string
	logger    *zap.Logger
}

// NewAuthUseCase creates a new AuthUseCase
func NewAuthUseCase(
	userRepo *repository.UserRepository,
	tokenRepo *repository.TokenRepository,
	cacheRepo *repository.CacheRepository,
	jwtSecret string,
	logger *zap.Logger,
) *AuthUseCase {
	return &AuthUseCase{
		userRepo:  userRepo,
		tokenRepo: tokenRepo,
		cacheRepo: cacheRepo,
		jwtSecret: jwtSecret,
		logger:    logger,
	}
}

// Register creates a new user account
func (uc *AuthUseCase) Register(ctx context.Context, req *model.RegisterRequest) (*model.AuthResponse, error) {
	// Hash password with bcrypt (cost 12 — good balance of security vs performance)
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), 12)
	if err != nil {
		return nil, fmt.Errorf("hash password: %w", err)
	}

	passwordHash := string(hashedPassword)
	user := &model.User{
		Username:     req.Username,
		Email:        req.Email,
		PasswordHash: &passwordHash,
		FullName:     req.FullName,
		AccountTier:  model.TierFree,
		Verification: model.VerificationUnverified,
		OpenToWork:   model.OpenToWorkNo,
	}

	if err := uc.userRepo.Create(ctx, user); err != nil {
		if errors.Is(err, repository.ErrDuplicate) {
			return nil, fmt.Errorf("user with this email or username already exists")
		}
		return nil, err
	}

	uc.logger.Info("User registered",
		zap.String("user_id", user.ID.String()),
		zap.String("email", user.Email),
	)

	// Generate tokens
	return uc.generateAuthResponse(ctx, user, "")
}

// Login authenticates a user with email and password
func (uc *AuthUseCase) Login(ctx context.Context, req *model.LoginRequest, deviceInfo string) (*model.AuthResponse, error) {
	user, err := uc.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, fmt.Errorf("invalid email or password")
		}
		return nil, err
	}

	// Verify password
	if user.PasswordHash == nil {
		return nil, fmt.Errorf("this account uses social login — please sign in with your provider")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(*user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, fmt.Errorf("invalid email or password")
	}

	// Update last login
	_ = uc.userRepo.UpdateLastLogin(ctx, user.ID)

	uc.logger.Info("User logged in",
		zap.String("user_id", user.ID.String()),
	)

	return uc.generateAuthResponse(ctx, user, deviceInfo)
}

// RefreshToken generates a new access token from a valid refresh token
func (uc *AuthUseCase) RefreshToken(ctx context.Context, refreshToken string) (*model.AuthResponse, error) {
	tokenHash := hashToken(refreshToken)

	userID, err := uc.tokenRepo.ValidateRefreshToken(ctx, tokenHash)
	if err != nil {
		return nil, fmt.Errorf("invalid or expired refresh token")
	}

	// Revoke old token (token rotation for security)
	_ = uc.tokenRepo.RevokeRefreshToken(ctx, tokenHash)

	user, err := uc.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("user not found")
	}

	return uc.generateAuthResponse(ctx, user, "")
}

// Logout revokes the refresh token
func (uc *AuthUseCase) Logout(ctx context.Context, refreshToken string) error {
	tokenHash := hashToken(refreshToken)
	return uc.tokenRepo.RevokeRefreshToken(ctx, tokenHash)
}

// generateAuthResponse creates JWT access token + refresh token
func (uc *AuthUseCase) generateAuthResponse(ctx context.Context, user *model.User, deviceInfo string) (*model.AuthResponse, error) {
	// Access token — short lived (15 min)
	accessExpiry := 15 * time.Minute
	accessToken, err := uc.generateAccessToken(user, accessExpiry)
	if err != nil {
		return nil, fmt.Errorf("generate access token: %w", err)
	}

	// Refresh token — long lived (7 days)
	refreshToken, err := generateRandomToken(64)
	if err != nil {
		return nil, fmt.Errorf("generate refresh token: %w", err)
	}

	tokenHash := hashToken(refreshToken)
	refreshExpiry := 7 * 24 * time.Hour
	if err := uc.tokenRepo.StoreRefreshToken(ctx, user.ID, tokenHash, deviceInfo, time.Now().Add(refreshExpiry)); err != nil {
		return nil, fmt.Errorf("store refresh token: %w", err)
	}

	return &model.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		TokenType:    "Bearer",
		ExpiresIn:    int64(accessExpiry.Seconds()),
		User:         user.ToDTO(),
	}, nil
}

// generateAccessToken creates a signed JWT
func (uc *AuthUseCase) generateAccessToken(user *model.User, expiry time.Duration) (string, error) {
	now := time.Now()
	claims := jwt.MapClaims{
		"sub":   user.ID.String(),
		"email": user.Email,
		"name":  user.FullName,
		"tier":  string(user.AccountTier),
		"iat":   now.Unix(),
		"exp":   now.Add(expiry).Unix(),
		"iss":   "nexus",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(uc.jwtSecret))
}

// generateRandomToken creates a cryptographically secure random token
func generateRandomToken(length int) (string, error) {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(bytes), nil
}

// hashToken creates a hash of a refresh token for storage
// Using a simple approach; in production, use bcrypt or SHA-256
func hashToken(token string) string {
	// Simple base64 encode for dev; swap to bcrypt/SHA-256 in production
	return base64.StdEncoding.EncodeToString([]byte(token))
}

// Ensure uuid is used
var _ = uuid.New
