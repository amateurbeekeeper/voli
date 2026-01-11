#!/bin/bash
# Setup commit message enforcement for new developers
# This script runs automatically after pnpm install

set -e

# Only show output if running interactively or if there's an issue
QUIET=true

# Configure git commit template
if [ -f .gitmessage ]; then
  # Only set if not already set
  if ! git config commit.template > /dev/null 2>&1; then
    git config commit.template .gitmessage
    if [ "$QUIET" != "true" ]; then
      echo "✅ Git commit template configured"
    fi
  fi
else
  echo "⚠️  Warning: .gitmessage not found"
fi

# Verify husky is set up
if [ -d .husky ]; then
  echo "✅ Husky hooks directory found"
else
  echo "⚠️  Warning: .husky directory not found"
  echo "   Run: pnpm install (this should set up husky)"
fi

# Verify commitlint is installed
if pnpm list @commitlint/cli > /dev/null 2>&1; then
  echo "✅ Commitlint is installed"
else
  echo "⚠️  Warning: Commitlint not found"
  echo "   Run: pnpm install"
fi

echo ""
echo "🎉 Commit message enforcement is set up!"
echo ""
echo "📝 Commit format: <type>(<scope>): <subject>"
echo "   Example: feat(api): add authentication endpoint"
echo ""
echo "📖 See docs/CONTRIBUTING.md for full format guide"
echo ""
