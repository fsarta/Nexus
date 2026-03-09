package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"github.com/nexus-platform/user-service/internal/model"
	"github.com/nexus-platform/user-service/internal/usecase"
)

// AuthHandler handles authentication HTTP endpoints
type AuthHandler struct {
	authUC *usecase.AuthUseCase
	logger *zap.Logger
}

// NewAuthHandler creates a new AuthHandler
func NewAuthHandler(authUC *usecase.AuthUseCase, logger *zap.Logger) *AuthHandler {
	return &AuthHandler{authUC: authUC, logger: logger}
}

// Register handles user registration
// POST /api/v1/auth/register
func (h *AuthHandler) Register(c *gin.Context) {
	var req model.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Error: "Invalid request body",
			Code:  "VALIDATION_ERROR",
			Details: err.Error(),
		})
		return
	}

	resp, err := h.authUC.Register(c.Request.Context(), &req)
	if err != nil {
		h.logger.Warn("Registration failed", zap.Error(err))
		c.JSON(http.StatusConflict, model.ErrorResponse{
			Error: err.Error(),
			Code:  "REGISTRATION_FAILED",
		})
		return
	}

	c.JSON(http.StatusCreated, resp)
}

// Login handles user authentication
// POST /api/v1/auth/login
func (h *AuthHandler) Login(c *gin.Context) {
	var req model.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Error: "Invalid request body",
			Code:  "VALIDATION_ERROR",
			Details: err.Error(),
		})
		return
	}

	deviceInfo := c.GetHeader("User-Agent")
	resp, err := h.authUC.Login(c.Request.Context(), &req, deviceInfo)
	if err != nil {
		c.JSON(http.StatusUnauthorized, model.ErrorResponse{
			Error: err.Error(),
			Code:  "AUTH_FAILED",
		})
		return
	}

	c.JSON(http.StatusOK, resp)
}

// RefreshToken handles token refresh
// POST /api/v1/auth/refresh
func (h *AuthHandler) RefreshToken(c *gin.Context) {
	var req model.RefreshRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Error: "Invalid request body",
			Code:  "VALIDATION_ERROR",
		})
		return
	}

	resp, err := h.authUC.RefreshToken(c.Request.Context(), req.RefreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, model.ErrorResponse{
			Error: err.Error(),
			Code:  "TOKEN_REFRESH_FAILED",
		})
		return
	}

	c.JSON(http.StatusOK, resp)
}

// Logout handles user logout
// POST /api/v1/auth/logout
func (h *AuthHandler) Logout(c *gin.Context) {
	var req model.RefreshRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Error: "Invalid request body",
			Code:  "VALIDATION_ERROR",
		})
		return
	}

	if err := h.authUC.Logout(c.Request.Context(), req.RefreshToken); err != nil {
		c.JSON(http.StatusInternalServerError, model.ErrorResponse{
			Error: "Logout failed",
			Code:  "LOGOUT_FAILED",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully logged out"})
}
