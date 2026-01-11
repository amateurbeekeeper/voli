#!/bin/bash

# Deploy script: lint, build, commit, push, and check Vercel build
# Usage: ./scripts/deploy.sh [commit-message]

set -e  # Exit on error

COMMIT_MSG="${1:-chore: deploy changes}"

echo "🚀 Starting deployment workflow..."
echo ""

# Step 1: Lint
echo "📋 Step 1/5: Running lint..."
pnpm nx lint web
if [ $? -ne 0 ]; then
  echo "❌ Lint failed. Fix errors before deploying."
  exit 1
fi
echo "✅ Lint passed"
echo ""

# Step 2: Build
echo "🔨 Step 2/5: Building web app..."
pnpm nx build web
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Fix errors before deploying."
  exit 1
fi
echo "✅ Build successful"
echo ""

# Step 3: Commit
echo "💾 Step 3/5: Committing changes..."
if [ -z "$(git status --porcelain)" ]; then
  echo "⚠️  No changes to commit"
else
  git add -A
  git commit -m "$COMMIT_MSG"
  echo "✅ Changes committed"
fi
echo ""

# Step 4: Push
echo "📤 Step 4/5: Pushing to remote..."
git push
if [ $? -ne 0 ]; then
  echo "❌ Push failed."
  exit 1
fi
echo "✅ Pushed to remote"
echo ""

# Step 5: Wait and check Vercel
echo "⏳ Step 5/5: Waiting 654 seconds for Vercel build to complete..."
echo "   (This gives Vercel time to start and complete the build)"
echo ""

# Countdown timer
for i in {654..1}; do
  printf "\r   ⏱️  Waiting: %3d seconds remaining..." $i
  sleep 1
done
echo ""
echo ""

echo "🔍 Checking Vercel build status..."
echo ""

# Check if vercel CLI is available
if command -v vercel &> /dev/null; then
  echo "📊 Recent Vercel deployments:"
  vercel ls --limit 5
  echo ""
  echo "💡 To view detailed logs, run: vercel logs"
else
  echo "⚠️  Vercel CLI not found. Install it with: npm i -g vercel"
  echo "   Or check your Vercel dashboard: https://vercel.com/dashboard"
fi

echo ""
echo "✅ Deployment workflow complete!"
echo "🌐 Check your Vercel dashboard for build status: https://vercel.com/dashboard"
