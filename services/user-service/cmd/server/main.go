package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"

	"github.com/nexus-platform/user-service/internal/handler"
	"github.com/nexus-platform/user-service/internal/middleware"
	"github.com/nexus-platform/user-service/internal/repository"
	"github.com/nexus-platform/user-service/internal/usecase"
)

func main() {
	// ── Logger ─────────────────────────────────────
	logger, err := zap.NewProduction()
	if err != nil {
		log.Fatalf("failed to initialize logger: %v", err)
	}
	defer logger.Sync()

	sugar := logger.Sugar()
	sugar.Info("Starting Nexus User Service")

	// ── Database Connection ────────────────────────
	dbURL := getEnv("COCKROACHDB_URL", "postgresql://nexus_app@localhost:26257/nexus?sslmode=disable")
	
	poolConfig, err := pgxpool.ParseConfig(dbURL)
	if err != nil {
		sugar.Fatalf("Unable to parse database URL: %v", err)
	}
	poolConfig.MaxConns = 50
	poolConfig.MinConns = 10
	poolConfig.MaxConnLifetime = 30 * time.Minute
	poolConfig.MaxConnIdleTime = 5 * time.Minute

	ctx := context.Background()
	pool, err := pgxpool.NewWithConfig(ctx, poolConfig)
	if err != nil {
		sugar.Fatalf("Unable to connect to database: %v", err)
	}
	defer pool.Close()

	// Verify connection
	if err := pool.Ping(ctx); err != nil {
		sugar.Fatalf("Database ping failed: %v", err)
	}
	sugar.Info("Connected to CockroachDB")

	// ── Redis Connection ───────────────────────────
	redisURL := getEnv("REDIS_URL", "redis://localhost:6379/0")
	redisOpts, err := redis.ParseURL(redisURL)
	if err != nil {
		sugar.Fatalf("Unable to parse Redis URL: %v", err)
	}
	rdb := redis.NewClient(redisOpts)
	defer rdb.Close()

	if err := rdb.Ping(ctx).Err(); err != nil {
		sugar.Warnf("Redis connection failed (non-fatal): %v", err)
	} else {
		sugar.Info("Connected to Redis")
	}

	// ── Dependency Injection ───────────────────────
	jwtSecret := getEnv("JWT_SECRET", "dev-secret-change-in-production-32chars-minimum!!")
	
	userRepo := repository.NewUserRepository(pool)
	tokenRepo := repository.NewTokenRepository(pool)
	cacheRepo := repository.NewCacheRepository(rdb)

	authUseCase := usecase.NewAuthUseCase(userRepo, tokenRepo, cacheRepo, jwtSecret, logger)
	userUseCase := usecase.NewUserUseCase(userRepo, cacheRepo, logger)

	authHandler := handler.NewAuthHandler(authUseCase, logger)
	userHandler := handler.NewUserHandler(userUseCase, logger)

	// ── Router ─────────────────────────────────────
	if os.Getenv("GIN_MODE") == "" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(middleware.CORS())
	router.Use(middleware.RequestLogger(logger))
	router.Use(middleware.RequestID())

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "healthy",
			"service": "user-service",
			"version": "0.1.0",
		})
	})

	// API v1
	v1 := router.Group("/api/v1")
	{
		// Auth routes (public)
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.POST("/refresh", authHandler.RefreshToken)
			auth.POST("/logout", authHandler.Logout)
		}

		// User routes (protected)
		users := v1.Group("/users")
		users.Use(middleware.AuthRequired(jwtSecret))
		{
			users.GET("/me", userHandler.GetCurrentUser)
			users.GET("/:id", userHandler.GetUser)
			users.PUT("/:id", userHandler.UpdateUser)
			users.GET("/:id/skills", userHandler.GetUserSkills)
			users.POST("/:id/skills", userHandler.AddUserSkill)
			users.DELETE("/:id/skills/:skillId", userHandler.RemoveUserSkill)
			users.GET("/:id/experiences", userHandler.GetUserExperiences)
			users.POST("/:id/experiences", userHandler.AddExperience)
		}
	}

	// ── Server ─────────────────────────────────────
	port := getEnv("USER_SERVICE_PORT", "8080")
	srv := &http.Server{
		Addr:         fmt.Sprintf(":%s", port),
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Graceful shutdown
	go func() {
		sugar.Infof("User Service listening on :%s", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			sugar.Fatalf("Server failed: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	sugar.Info("Shutting down gracefully...")
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		sugar.Fatalf("Server forced shutdown: %v", err)
	}
	sugar.Info("User Service stopped")
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
