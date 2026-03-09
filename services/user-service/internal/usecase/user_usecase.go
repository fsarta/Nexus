package usecase

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/nexus-platform/user-service/internal/model"
	"github.com/nexus-platform/user-service/internal/repository"
)

// UserUseCase handles user profile business logic
type UserUseCase struct {
	userRepo  *repository.UserRepository
	cacheRepo *repository.CacheRepository
	logger    *zap.Logger
}

// NewUserUseCase creates a new UserUseCase
func NewUserUseCase(
	userRepo *repository.UserRepository,
	cacheRepo *repository.CacheRepository,
	logger *zap.Logger,
) *UserUseCase {
	return &UserUseCase{
		userRepo:  userRepo,
		cacheRepo: cacheRepo,
		logger:    logger,
	}
}

// GetUser retrieves a user profile by ID
func (uc *UserUseCase) GetUser(ctx context.Context, id uuid.UUID) (*model.UserDTO, error) {
	user, err := uc.userRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	dto := user.ToDTO()
	return &dto, nil
}

// UpdateUser updates a user's profile
func (uc *UserUseCase) UpdateUser(ctx context.Context, id uuid.UUID, requestorID uuid.UUID, req *model.UpdateUserRequest) (*model.UserDTO, error) {
	// Authorization: only the user themselves can update their profile
	if id != requestorID {
		return nil, fmt.Errorf("unauthorized: cannot update another user's profile")
	}

	user, err := uc.userRepo.Update(ctx, id, req)
	if err != nil {
		return nil, err
	}

	// Invalidate cache
	_ = uc.cacheRepo.Delete(ctx, repository.UserCacheKey(id.String()))

	uc.logger.Info("User profile updated",
		zap.String("user_id", id.String()),
	)

	dto := user.ToDTO()
	return &dto, nil
}

// GetUserSkills retrieves a user's skills
func (uc *UserUseCase) GetUserSkills(ctx context.Context, userID uuid.UUID) ([]model.UserSkill, error) {
	return uc.userRepo.GetSkills(ctx, userID)
}

// GetUserExperiences retrieves a user's professional experiences
func (uc *UserUseCase) GetUserExperiences(ctx context.Context, userID uuid.UUID) ([]model.UserExperience, error) {
	return uc.userRepo.GetExperiences(ctx, userID)
}
