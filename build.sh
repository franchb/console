#!/bin/bash
set -e

echo "Building for local development..."
echo ""

echo "1. Building web application..."
cd web-app
yarn install
yarn build
cd ..

echo ""
echo "2. Building console binary..."
make console

echo ""
echo "Build complete. You can now run the console locally with:"
echo "./console server"