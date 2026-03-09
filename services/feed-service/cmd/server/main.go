package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"

	"github.com/nexus-platform/feed-service/internal/handler"
	"github.com/nexus-platform/feed-service/internal/repository"
	"github.com/nexus-platform/feed-service/internal/usecase"
)

func main() {
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

	// ── Dependency Injection ────────────────
	feedRepo := repository.NewFeedRepository(pool)
	feedUC := usecase.NewFeedUseCase(feedRepo, logger)
	feedHandler := handler.NewFeedHandler(feedUC, logger)

	// ── Router ──────────────────────────────
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(corsMiddleware())

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "feed-service"})
	})

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "dev-secret-change-in-production"
	}

	v1 := r.Group("/api/v1")
	v1.Use(authMiddleware(jwtSecret))
	{
		// Feed
		v1.GET("/feed", feedHandler.GetFeed)

		// Posts
		v1.POST("/posts", feedHandler.CreatePost)
		v1.GET("/posts/:id", feedHandler.GetPost)
		v1.DELETE("/posts/:id", feedHandler.DeletePost)

		// Reactions
		v1.POST("/posts/:id/react", feedHandler.ReactToPost)
		v1.DELETE("/posts/:id/react", feedHandler.UnreactToPost)

		// Comments
		v1.POST("/posts/:id/comments", feedHandler.AddComment)
	}

	// ── Server ──────────────────────────────
	port := os.Getenv("FEED_SERVICE_PORT")
	if port == "" {
		port = "8081"
	}

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%s", port),
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
	}

	go func() {
		logger.Info("Feed Service starting", zap.String("port", port))
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatal("Server failed", zap.Error(err))
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logger.Info("Shutting down Feed Service...")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	srv.Shutdown(ctx)
	logger.Info("Feed Service stopped")
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}

func authMiddleware(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization required"})
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid auth format"})
			return
		}

		token, err := jwt.Parse(parts[1], func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(jwtSecret), nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		claims, _ := token.Claims.(jwt.MapClaims)
		c.Set("user_id", claims["sub"])
		c.Set("user_name", claims["name"])
		c.Next()
	}
}
