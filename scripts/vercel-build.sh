#!/bin/bash
set -e

echo "🚀 Starting Vercel build for Voli web app..."

# Disable Nx cache for Vercel builds to ensure fresh builds
export NX_SKIP_NX_CACHE=true

# Build web app (Nx will automatically build dependencies first)
echo "🌐 Building Next.js web app with dependencies..."
pnpm nx build web --skip-nx-cache

echo "✅ Build completed successfully!"
echo "📁 Output directory: web/.next"
