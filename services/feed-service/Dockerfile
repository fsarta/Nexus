# syntax=docker/dockerfile:1

FROM golang:1.23-alpine AS builder
WORKDIR /app
COPY go.mod go.sum* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /feed-service ./cmd/server

FROM alpine:3.20
RUN apk --no-cache add ca-certificates tzdata
RUN adduser -D -g '' appuser
WORKDIR /app
COPY --from=builder /feed-service .
USER appuser
EXPOSE 8081
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8081/health || exit 1
ENTRYPOINT ["./feed-service"]
