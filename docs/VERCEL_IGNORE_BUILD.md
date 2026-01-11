# Vercel Ignored Build Step Setup

To make Vercel only deploy when frontend code changes, you need to configure the "Ignored Build Step" in Vercel's dashboard.

## Setup Instructions

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Git**
3. Scroll down to **"Ignored Build Step"** section
4. Paste this command:

```bash
bash .vercelignore-build.sh
```

## How It Works

The script checks if any of these paths have changed:
- `web/` - Next.js app
- `ui/` - UI component library
- `libs/ui/` - UI library path
- `package.json` - Dependencies
- `pnpm-lock.yaml` - Lock file
- `tsconfig.base.json` - TypeScript config
- `nx.json` - Nx config
- `web/.env*` - Environment files

If **none** of these changed, the build is skipped. This means:
- ✅ Changes to `apps/api/` → **Skip build**
- ✅ Changes to `apps/e2e/` → **Skip build**
- ✅ Changes to `.github/` → **Skip build**
- ✅ Changes to `web/` → **Build**
- ✅ Changes to `ui/` → **Build**
- ✅ Changes to `package.json` → **Build**

## Alternative: Using Git Diff Directly

If the script doesn't work, you can also use this simpler command in Vercel's "Ignored Build Step":

```bash
git diff HEAD^ HEAD --quiet -- web/ ui/ libs/ui/ package.json pnpm-lock.yaml || exit 0; exit 1
```

This returns:
- `0` (build) if changes detected in frontend files
- `1` (skip) if no changes

