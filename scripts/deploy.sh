#!/bin/bash

# Deploy script: lint, build, commit, push, and check Vercel build
# Usage: ./scripts/deploy.sh [commit-message]

set -e  # Exit on error

COMMIT_MSG="${1:-chore(vercel): deploy changes}"

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
echo "   Linting UI library..."
pnpm nx lint ui
if [ $? -ne 0 ]; then
  echo "❌ UI lint failed. Fix errors before deploying."
  exit 1
fi
echo "✅ UI lint passed"
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

# Check if vercel CLI is available (use npx as fallback)
VERCEL_CMD="vercel"
if ! command -v vercel &> /dev/null; then
  VERCEL_CMD="npx vercel"
fi

echo "📊 Fetching recent Vercel deployments..."
DEPLOYMENTS=$($VERCEL_CMD ls 2>&1 | head -12)
echo "$DEPLOYMENTS"
echo ""

# Extract the latest deployment URL
LATEST_URL=$(echo "$DEPLOYMENTS" | grep -oE 'https://[^ ]+\.vercel\.app' | head -1)

# Check for failed builds
if echo "$DEPLOYMENTS" | grep -q "● Error"; then
  echo "❌ VERCEL BUILD FAILED!"
  echo ""
  
  if [ -n "$LATEST_URL" ]; then
    echo "📋 Latest deployment: $LATEST_URL"
    echo ""
    echo "🔍 Fetching build logs (last 50 lines)..."
    echo "----------------------------------------"
    BUILD_LOGS=$($VERCEL_CMD inspect "$LATEST_URL" --logs 2>&1 | tail -50)
    echo "$BUILD_LOGS"
    echo "----------------------------------------"
    echo ""
    
    # Extract key error messages
    KEY_ERRORS=$(echo "$BUILD_LOGS" | grep -iE "(error|Error|ERROR|failed|Failed|FAILED|Cannot find|module-not-found)" | head -10)
    if [ -n "$KEY_ERRORS" ]; then
      echo "🔴 Key Error Messages:"
      echo "$KEY_ERRORS"
      echo ""
    fi
  fi
  
  echo "⚠️  ACTION REQUIRED:"
  echo "   1. Review build logs above"
  echo "   2. Fix errors and run deploy again"
  echo "   3. Check Vercel dashboard: https://vercel.com/dashboard"
  echo ""
  exit 1
elif echo "$DEPLOYMENTS" | grep -q "● Ready"; then
  echo "✅ Vercel build successful!"
  if [ -n "$LATEST_URL" ]; then
    echo "🌐 Latest deployment: $LATEST_URL"
  fi
else
  echo "⚠️  Could not determine build status"
  echo "   Check manually: https://vercel.com/dashboard"
fi

echo ""
echo "💡 To view full logs: $VERCEL_CMD inspect <deployment-url> --logs"
echo "✅ Deployment workflow complete!"
