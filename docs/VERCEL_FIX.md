# Vercel Build Fix Instructions

## Issues Found from Vercel Build Logs

1. **Build Command Mismatch**: Vercel is using `pnpm nx build web` (old) instead of `pnpm nx build web --skip-nx-cache` (from vercel.json)
2. **Node Version**: Vercel project settings have Node 24.x but need 22.x
3. **Nx Plugin Initialization**: Error "Cannot find configuration for task web:build" suggests Nx plugins aren't initializing

## Required Fixes in Vercel Dashboard

### 1. Update Build Command

1. Go to Vercel Dashboard → Your Project → Settings → General
2. Find **Build Command**
3. Change from: `pnpm nx build web`
4. Change to: `pnpm nx build web --skip-nx-cache`
5. Save changes

### 2. Update Node Version

1. In the same Settings → General page
2. Find **Node.js Version**
3. Change from: `24.x`
4. Change to: `22.x`
5. Save changes

### 3. Verify Settings

Your settings should match:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (leave empty or set to root)
- **Build Command**: `pnpm nx build web --skip-nx-cache`
- **Output Directory**: `web/.next`
- **Install Command**: `pnpm install --frozen-lockfile` (or leave default)
- **Node.js Version**: `22.x`

## Alternative: Use vercel.json

The `vercel.json` file should override dashboard settings, but if it's not working:

1. Delete the `.vercel` directory locally (if it exists)
2. Run `vercel pull` to re-sync settings
3. The `vercel.json` should then take precedence

Or manually update in dashboard as above.

## After Making Changes

1. Trigger a new deployment
2. Check build logs to verify the correct command is being used
3. Build should complete successfully

## Testing Locally

Test the exact command Vercel will use:

```bash
bash scripts/test-vercel-build.sh
```

Or manually:

```bash
pnpm install --frozen-lockfile
pnpm nx build web --skip-nx-cache
ls -la web/.next  # Verify output exists
```
