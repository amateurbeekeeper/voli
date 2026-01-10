#!/bin/bash
# Check if web app or UI library has changed
# Returns 0 (success) if changes detected, 1 (failure) if no changes

# Get the previous commit hash (or empty if first commit)
PREVIOUS_COMMIT=$(git rev-parse HEAD^ 2>/dev/null || echo "")

if [ -z "$PREVIOUS_COMMIT" ]; then
  # First commit, always build
  exit 0
fi

# Check if any frontend-related files changed
if git diff --quiet "$PREVIOUS_COMMIT" HEAD -- web/ ui/ libs/ui/ package.json pnpm-lock.yaml tsconfig.base.json nx.json; then
  # No changes to frontend, skip build
  echo "No frontend changes detected, skipping build"
  exit 1
else
  # Changes detected, proceed with build
  echo "Frontend changes detected, proceeding with build"
  exit 0
fi


