# Build stage
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Copy dependency definition
COPY go.mod ./
RUN go mod download

# Copy source files
COPY . .

# Build standard statically linked binary
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o server ./cmd/server

# Runner stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /

COPY --from=builder /app/server /server

EXPOSE 8080
ENV PORT=8080

CMD ["/server"]
