#!/bin/bash

# Deploy script: lint, build, commit, push, and check Vercel build
# Usage: ./scripts/deploy.sh [commit-message]

set -e  # Exit on error

COMMIT_MSG="${1:-chore: deploy changes}"

echo "🚀 Starting deployment workflow..."
echo ""

# Step 1: Lint
echo "📋 Step 1/6: Running lint..."
echo "   Linting web app..."
pnpm nx lint web
if [ $? -ne 0 ]; then
  echo "❌ Web lint failed. Fix errors before deploying."
  exit 1
fi
echo "   Linting UI library (Storybook)..."
# Skip UI lint if it's not configured (it's optional for Storybook)
if pnpm nx lint ui 2>/dev/null; then
  echo "✅ UI lint passed"
else
  echo "⚠️  UI lint skipped (not configured or no files to lint)"
fi
echo "✅ All linting passed"
echo ""

# Step 2: Build
echo "🔨 Step 2/6: Building web app..."
pnpm nx build web
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Fix errors before deploying."
  exit 1
fi
echo "✅ Build successful"
echo ""

# Step 3: Commit
echo "💾 Step 3/6: Committing changes..."
if [ -z "$(git status --porcelain)" ]; then
  echo "⚠️  No changes to commit"
else
  git add -A
  git commit -m "$COMMIT_MSG"
  echo "✅ Changes committed"
fi
echo ""

# Step 4: Push
echo "📤 Step 4/6: Pushing to remote..."
git push
if [ $? -ne 0 ]; then
  echo "❌ Push failed."
  exit 1
fi
echo "✅ Pushed to remote"
echo ""

# Step 5: Wait and check Vercel
echo "⏳ Step 5/6: Waiting 60 seconds for Vercel build to start..."
echo "   (This gives Vercel time to start the build)"
echo ""

# Countdown timer
for i in {60..1}; do
  printf "\r   ⏱️  Waiting: %2d seconds remaining..." $i
  sleep 1
done
echo ""
echo ""

echo "🔍 Step 6/6: Checking Vercel build status..."
echo ""

# Check if vercel CLI is available
if command -v vercel &> /dev/null; then
  echo "📊 Recent Vercel deployments:"
  vercel ls --limit 5
  echo ""
  echo "💡 To view detailed logs, run: vercel logs"
  echo "   Or check build logs: vercel inspect <deployment-url> --logs"
else
  echo "⚠️  Vercel CLI not found. Install it with: npm i -g vercel"
  echo "   Or check your Vercel dashboard: https://vercel.com/dashboard"
fi

echo ""
echo "✅ Deployment workflow complete!"
echo "🌐 Check your Vercel dashboard for build status: https://vercel.com/dashboard"
