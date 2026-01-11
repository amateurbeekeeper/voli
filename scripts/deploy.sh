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
  
  # Generate descriptive commit message if default is used
  if [ "$COMMIT_MSG" = "chore(vercel): deploy changes" ]; then
    # Analyze changes to create better commit message
    CHANGED_FILES=$(git diff --cached --name-only)
    CHANGED_COUNT=$(echo "$CHANGED_FILES" | wc -l | xargs)
    
    # Categorize changes
    API_CHANGES=$(echo "$CHANGED_FILES" | grep -E "^apps/api/" | wc -l | xargs)
    WEB_CHANGES=$(echo "$CHANGED_FILES" | grep -E "^web/" | wc -l | xargs)
    UI_CHANGES=$(echo "$CHANGED_FILES" | grep -E "^ui/" | wc -l | xargs)
    DOCS_CHANGES=$(echo "$CHANGED_FILES" | grep -E "^docs/" | wc -l | xargs)
    CONFIG_CHANGES=$(echo "$CHANGED_FILES" | grep -E "\.(json|js|ts|config|yml|yaml)$" | grep -vE "^apps/|^web/|^ui/" | wc -l | xargs)
    
    # Build scope list
    SCOPES=()
    if [ "$API_CHANGES" -gt 0 ]; then SCOPES+=("api"); fi
    if [ "$WEB_CHANGES" -gt 0 ]; then SCOPES+=("web"); fi
    if [ "$UI_CHANGES" -gt 0 ]; then SCOPES+=("ui"); fi
    if [ "$DOCS_CHANGES" -gt 0 ]; then SCOPES+=("docs"); fi
    if [ "$CONFIG_CHANGES" -gt 0 ]; then SCOPES+=("config"); fi
    
    # Build scope string
    if [ ${#SCOPES[@]} -eq 0 ]; then
      SCOPE_STR="vercel"
    else
      SCOPE_STR=$(IFS=,; echo "${SCOPES[*]}")
    fi
    
    # Create descriptive subject based on what changed
    if [ "$CHANGED_COUNT" -eq 1 ]; then
      MAIN_FILE=$(echo "$CHANGED_FILES" | head -1)
      FILE_NAME=$(basename "$MAIN_FILE" | sed 's/\.[^.]*$//')
      SUBJECT="deploy $FILE_NAME changes"
    elif [ "$CHANGED_COUNT" -le 5 ]; then
      # For small number of files, be more specific
      if [ "$API_CHANGES" -gt 0 ] && [ "$WEB_CHANGES" -eq 0 ] && [ "$UI_CHANGES" -eq 0 ]; then
        SUBJECT="deploy API changes"
      elif [ "$WEB_CHANGES" -gt 0 ] && [ "$API_CHANGES" -eq 0 ] && [ "$UI_CHANGES" -eq 0 ]; then
        SUBJECT="deploy web changes"
      elif [ "$DOCS_CHANGES" -gt 0 ] && [ "$API_CHANGES" -eq 0 ] && [ "$WEB_CHANGES" -eq 0 ] && [ "$UI_CHANGES" -eq 0 ]; then
        SUBJECT="deploy documentation updates"
      else
        SUBJECT="deploy changes ($CHANGED_COUNT files)"
      fi
    else
      # For many files, summarize by scope
      SUBJECT="deploy changes ($CHANGED_COUNT files)"
    fi
    
    COMMIT_MSG="chore($SCOPE_STR): $SUBJECT"
    
    echo "   📝 Generated commit message: $COMMIT_MSG"
    echo "   📊 Changes: $CHANGED_COUNT files (api:$API_CHANGES web:$WEB_CHANGES ui:$UI_CHANGES docs:$DOCS_CHANGES)"
  fi
  
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
