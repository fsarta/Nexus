# syntax=docker/dockerfile:1

# ── Build Stage ──────────────────────────────────
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Dependencies first (cache layer)
COPY go.mod go.sum* ./
RUN go mod download

# Source code
COPY . .

# Build static binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /user-service ./cmd/server

# ── Runtime Stage ────────────────────────────────
FROM alpine:3.20

RUN apk --no-cache add ca-certificates tzdata
RUN adduser -D -g '' appuser

WORKDIR /app

COPY --from=builder /user-service .

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

ENTRYPOINT ["./user-service"]
