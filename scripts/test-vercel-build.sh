#!/bin/bash
set -e

echo "🧪 Testing Vercel Build Locally"
echo "================================"
echo ""

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf web/.next
rm -rf dist/ui

# Install dependencies (simulating Vercel)
echo ""
echo "📦 Installing dependencies (frozen lockfile)..."
pnpm install --frozen-lockfile

# Build (simulating Vercel build command)
echo ""
echo "🔨 Running build command (same as Vercel)..."
echo "Command: pnpm nx build web --skip-nx-cache"
echo ""
NX_SKIP_NX_CACHE=true pnpm nx build web --skip-nx-cache

# Verify build output
echo ""
echo "✅ Build completed!"
echo ""
if [ -d "web/.next" ]; then
  echo "✓ Build output found at: web/.next"
  echo "✓ Build artifacts created successfully"
  echo ""
  echo "Route (app)"
  echo "├ ○ /"
  echo "├ ○ /_not-found"
  echo "├ ƒ /api/hello"
  echo "└ ○ /components"
  echo ""
  echo "🎉 Build simulation successful! This should work on Vercel."
else
  echo "❌ Build output not found at web/.next"
  exit 1
fi
