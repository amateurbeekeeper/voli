#!/bin/bash
# Ignore build step if no frontend changes
# This script returns 1 (skip build) if no frontend changes, 0 (build) if changes detected

PREVIOUS_COMMIT=$(git rev-parse HEAD^ 2>/dev/null || echo "")

if [ -z "$PREVIOUS_COMMIT" ]; then
  exit 0  # Always build on first commit
fi

# Check if web app, UI library, or shared configs changed
if git diff --quiet "$PREVIOUS_COMMIT" HEAD -- web/ ui/ libs/ui/ package.json pnpm-lock.yaml tsconfig.base.json nx.json web/.env*; then
  exit 1  # Skip build - no frontend changes
else
  exit 0  # Build - frontend changes detected
fi
