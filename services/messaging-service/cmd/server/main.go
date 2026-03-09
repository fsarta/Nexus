package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"

	"github.com/nexus-platform/messaging-service/internal/handler"
	"github.com/nexus-platform/messaging-service/internal/repository"
	"github.com/nexus-platform/messaging-service/internal/usecase"
	"github.com/nexus-platform/messaging-service/internal/ws"
)

func main() {
	// ── Logger ──────────────────────────────
	logger, _ := zap.NewProduction()
	defer logger.Sync()

	// ── Database ────────────────────────────
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgresql://root@localhost:26257/nexus?sslmode=disable"
	}

	pool, err := pgxpool.New(context.Background(), dbURL)
	if err != nil {
		logger.Fatal("Failed to connect to CockroachDB", zap.Error(err))
	}
	defer pool.Close()
	logger.Info("Connected to CockroachDB")

	// ── WebSocket Hub ───────────────────────
	hub := ws.NewHub(logger)

	// ── Dependency Injection ────────────────
	msgRepo := repository.NewMessageRepository(pool)
	msgUC := usecase.NewMessagingUseCase(msgRepo, hub, logger)
	msgHandler := handler.NewMessagingHandler(msgUC, hub, logger)

	// ── Gin Router ──────────────────────────
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(corsMiddleware())
	r.Use(requestLogger(logger))

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "messaging-service"})
	})

	// JWT Secret
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "dev-secret-change-in-production"
	}

	// ── API Routes (v1) ─────────────────────
	v1 := r.Group("/api/v1/messages")
	v1.Use(authMiddleware(jwtSecret))
	{
		// Conversations
		v1.POST("/conversations", msgHandler.CreateConversation)
		v1.GET("/conversations", msgHandler.GetInbox)

		// Messages within a conversation
		v1.POST("/conversations/:id/messages", msgHandler.SendMessage)
		v1.GET("/conversations/:id/messages", msgHandler.GetMessages)
		v1.POST("/conversations/:id/read", msgHandler.MarkRead)

		// Individual message operations
		v1.PUT("/:messageId", msgHandler.EditMessage)
		v1.DELETE("/:messageId", msgHandler.DeleteMessage)

		// WebSocket
		v1.GET("/ws", msgHandler.HandleWebSocket)
	}

	// ── Server ──────────────────────────────
	port := os.Getenv("MESSAGING_SERVICE_PORT")
	if port == "" {
		port = "8082"
	}

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%s", port),
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		logger.Info("Messaging Service starting", zap.String("port", port))
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatal("Server failed", zap.Error(err))
		}
	}()

	// ── Graceful Shutdown ───────────────────
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logger.Info("Shutting down Messaging Service...")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		logger.Fatal("Server forced to shutdown", zap.Error(err))
	}
	logger.Info("Messaging Service stopped")
}

// ── Middleware (same pattern as user-service) ──

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization, X-Request-ID, X-Act-As-Type, X-Act-As-ID")
		c.Header("Access-Control-Max-Age", "86400")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}

func requestLogger(logger *zap.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next()
		logger.Info("request",
			zap.String("method", c.Request.Method),
			zap.String("path", c.Request.URL.Path),
			zap.Int("status", c.Writer.Status()),
			zap.Duration("latency", time.Since(start)),
		)
	}
}

func authMiddleware(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// For WebSocket connections, check query param token
		if c.Request.URL.Path == "/api/v1/messages/ws" {
			token := c.Query("token")
			if token != "" {
				// Simplified: in production, parse JWT from query param
				c.Set("user_id", c.Query("user_id"))
				c.Next()
				return
			}
		}

		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization required"})
			return
		}

		// Reuse JWT parsing from user-service middleware pattern
		// Simplified for now — in production, extract and validate JWT
		parts := make([]string, 0)
		for i, b := range authHeader {
			if b == ' ' {
				parts = append(parts, authHeader[:i], authHeader[i+1:])
				break
			}
		}
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid auth format"})
			return
		}

		// In production, validate JWT and extract claims
		// For now, setting user context from JWT claims would happen here
		c.Set("user_id", "dev-user-id") // placeholder
		c.Set("user_name", "Dev User")
		c.Next()
	}
}
