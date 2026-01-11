#!/bin/bash
set -e

echo "🔍 Checking Vercel Deployment Status"
echo "===================================="
echo ""

# Get the latest deployment URL from vercel ls output
echo "📋 Fetching latest deployments..."
DEPLOYMENT_LIST=$(npx vercel ls 2>&1)
echo "$DEPLOYMENT_LIST" | head -8
echo ""

# Extract the latest deployment URL (first URL in the table)
LATEST_DEPLOYMENT=$(echo "$DEPLOYMENT_LIST" | grep -E "https://.*\.vercel\.app" | head -1 | awk '{for(i=1;i<=NF;i++) if($i ~ /https:\/\//) print $i; exit}')

if [ -z "$LATEST_DEPLOYMENT" ]; then
  echo "⚠️  Could not determine latest deployment URL"
  exit 1
fi

echo "✅ Latest deployment: $LATEST_DEPLOYMENT"
echo ""

# Get deployment status
echo "📊 Deployment Status:"
echo "---------------------"
npx vercel inspect "$LATEST_DEPLOYMENT" 2>&1 | grep -E "(status|target|url|created)" | head -5
echo ""

# Check build logs for errors
echo "🔍 Checking build logs for errors..."
LOG_OUTPUT=$(npx vercel inspect "$LATEST_DEPLOYMENT" --logs 2>&1 | tail -30)

# Check if there are errors in the logs
if echo "$LOG_OUTPUT" | grep -qiE "(error|Error|ERROR|failed|Failed|FAILED)"; then
  echo "❌ Build errors found:"
  echo "----------------------"
  echo "$LOG_OUTPUT" | grep -iE "(error|Error|ERROR|failed|Failed|FAILED|Cannot find)" | head -10
  echo ""
  echo "💡 Full build logs:"
  echo "   npx vercel inspect $LATEST_DEPLOYMENT --logs"
else
  STATUS=$(npx vercel inspect "$LATEST_DEPLOYMENT" 2>&1 | grep "status" | head -1)
  if echo "$STATUS" | grep -qi "Error"; then
    echo "❌ Build failed. Latest errors from logs:"
    echo "------------------------------------------"
    echo "$LOG_OUTPUT" | tail -20
  elif echo "$STATUS" | grep -qi "Ready"; then
    echo "✅ Build successful!"
    echo ""
    echo "🌐 Deployment URL: $LATEST_DEPLOYMENT"
  else
    echo "⏳ $STATUS"
    echo ""
    echo "💡 To see full logs:"
    echo "   npx vercel inspect $LATEST_DEPLOYMENT --logs"
  fi
fi
