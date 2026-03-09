package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/nexus-platform/user-service/internal/model"
	"github.com/nexus-platform/user-service/internal/usecase"
)

// UserHandler handles user profile HTTP endpoints
type UserHandler struct {
	userUC *usecase.UserUseCase
	logger *zap.Logger
}

// NewUserHandler creates a new UserHandler
func NewUserHandler(userUC *usecase.UserUseCase, logger *zap.Logger) *UserHandler {
	return &UserHandler{userUC: userUC, logger: logger}
}

// GetCurrentUser returns the authenticated user's profile
// GET /api/v1/users/me
func (h *UserHandler) GetCurrentUser(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, model.ErrorResponse{
			Error: "User not authenticated",
			Code:  "UNAUTHORIZED",
		})
		return
	}

	id, err := uuid.Parse(userID.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{Error: "Invalid user ID"})
		return
	}

	user, err := h.userUC.GetUser(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, model.ErrorResponse{Error: "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// GetUser returns a user's public profile
// GET /api/v1/users/:id
func (h *UserHandler) GetUser(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{Error: "Invalid user ID format"})
		return
	}

	user, err := h.userUC.GetUser(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, model.ErrorResponse{Error: "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// UpdateUser updates the authenticated user's profile
// PUT /api/v1/users/:id
func (h *UserHandler) UpdateUser(c *gin.Context) {
	targetID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{Error: "Invalid user ID format"})
		return
	}

	requestorID, _ := uuid.Parse(c.GetString("user_id"))

	var req model.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Error:   "Invalid request body",
			Details: err.Error(),
		})
		return
	}

	user, err := h.userUC.UpdateUser(c.Request.Context(), targetID, requestorID, &req)
	if err != nil {
		c.JSON(http.StatusForbidden, model.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, user)
}

// GetUserSkills returns a user's skills
// GET /api/v1/users/:id/skills
func (h *UserHandler) GetUserSkills(c *gin.Context) {
	userID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{Error: "Invalid user ID"})
		return
	}

	skills, err := h.userUC.GetUserSkills(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, model.ErrorResponse{Error: "Failed to retrieve skills"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": skills})
}

// AddUserSkill adds a skill to the user's profile
// POST /api/v1/users/:id/skills
func (h *UserHandler) AddUserSkill(c *gin.Context) {
	// Placeholder — will implement with skill repository
	c.JSON(http.StatusNotImplemented, model.ErrorResponse{
		Error: "Skill addition coming soon",
		Code:  "NOT_IMPLEMENTED",
	})
}

// RemoveUserSkill removes a skill from the user's profile
// DELETE /api/v1/users/:id/skills/:skillId
func (h *UserHandler) RemoveUserSkill(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, model.ErrorResponse{
		Error: "Skill removal coming soon",
		Code:  "NOT_IMPLEMENTED",
	})
}

// GetUserExperiences returns a user's professional experiences
// GET /api/v1/users/:id/experiences
func (h *UserHandler) GetUserExperiences(c *gin.Context) {
	userID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{Error: "Invalid user ID"})
		return
	}

	experiences, err := h.userUC.GetUserExperiences(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, model.ErrorResponse{Error: "Failed to retrieve experiences"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": experiences})
}

// AddExperience adds a professional experience
// POST /api/v1/users/:id/experiences
func (h *UserHandler) AddExperience(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, model.ErrorResponse{
		Error: "Experience addition coming soon",
		Code:  "NOT_IMPLEMENTED",
	})
}
