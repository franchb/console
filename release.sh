#!/bin/bash
set -e

echo "Building web application..."
cd web-app
yarn install
yarn build
cd ..

echo "Building console binaries..."

echo "Building for amd64..."
GOOS=linux GOARCH=amd64 make console
mv console console-amd64

echo "Building for arm64..."
GOOS=linux GOARCH=arm64 make console
mv console console-arm64

echo "Setting up Docker buildx..."
docker buildx ls | grep -q multiarch-builder || docker buildx create --name multiarch-builder
docker buildx use multiarch-builder

echo "Building and pushing multi-architecture Docker images..."
docker buildx build \
  -f Dockerfile.release \
  --platform linux/amd64,linux/arm64 \
  --build-arg TARGETARCH \
  -t opens3/console:latest \
  --provenance=true \
  --sbom=true \
  --push \
  .

rm console-amd64 console-arm64 