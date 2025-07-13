FROM node:20-alpine as webbuilder

# Build the web application
WORKDIR /app
COPY web-app/package.json web-app/yarn.lock ./

# Enable Corepack and install dependencies first (layer caching)
RUN corepack enable && \
    corepack prepare yarn@4.4.0 --activate && \
    yarn install --immutable

# Copy source and build
COPY web-app ./
RUN yarn build

FROM golang:1.24-alpine as builder

# Build the console binary
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
COPY --from=webbuilder /app/build ./web-app/build
RUN apk add --no-cache make && \
    make console

FROM alpine:latest

# Add ca-certificates for HTTPS
RUN apk add --no-cache ca-certificates

WORKDIR /app

# Copy the console binary from builder
COPY --from=builder /app/console /app/console

# Create directory for certs
RUN mkdir -p /root/.console/certs

# Expose the default console port
EXPOSE 9090

# Default command
ENTRYPOINT ["/app/console", "server"]