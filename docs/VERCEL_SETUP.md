# Vercel Deployment Setup

## Initial Setup

1. **Install Vercel CLI globally:**
   ```bash
   pnpm add -g vercel
   ```

2. **Link your project to Vercel:**
   ```bash
   vercel login
   vercel link
   ```
   - Select your Vercel account
   - Choose "Create a new project" or link to existing
   - Use default settings for now

3. **Deploy to preview:**
   ```bash
   vercel
   ```

4. **Deploy to production:**
   ```bash
   vercel --prod
   ```

## GitHub Integration (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (root of monorepo)
   - **Build Command**: `pnpm nx build web --skip-nx-cache`
   - **Output Directory**: `web/.next`
   - **Install Command**: `pnpm install --frozen-lockfile`
   - **Node.js Version**: `22.x`

5. **Environment Variables:**
   Add in Vercel dashboard:
   - `NEXT_PUBLIC_API_BASE_URL` - Your API URL (local or staging)
   - `NEXT_PUBLIC_AI_ENABLED` - Set to `false` for now

## GitHub Actions Setup

To enable automated deployments via GitHub Actions:

1. **Get Vercel Token:**
   - Go to Vercel Settings → Tokens
   - Create a new token
   - Copy the token

2. **Add GitHub Secret:**
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Add secret: `VERCEL_TOKEN` with your token value
   - Add secret: `STAGING_WEB_URL` with your staging URL (after first deploy)

3. **Workflows will automatically:**
   - Deploy to preview on every push
   - Deploy to production when pushing to `main`

## Project Structure for Vercel

Vercel is configured to:
- Build from the root directory
- Use `pnpm` as package manager
- Build the `web` app using Nx
- Deploy only the web app (API stays local for now)

## Testing Build Locally

You can test the Vercel build locally before deploying:

### Quick Test Script

Run the test script that simulates Vercel's build process:

```bash
bash scripts/test-vercel-build.sh
```

This will:
- Clean previous builds
- Install dependencies (frozen lockfile)
- Run the build command (`pnpm nx build web --skip-nx-cache`)
- Verify the build output exists at `web/.next`

### Manual Testing

You can also run the build commands manually:

```bash
# Install dependencies (same as Vercel)
pnpm install --frozen-lockfile

# Run build (same as Vercel)
pnpm nx build web --skip-nx-cache

# Verify output exists
ls -la web/.next
```

### Using Vercel CLI

**Note:** You'll need to update Node version in Vercel dashboard first (see below).

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Run local build (requires Vercel project to be linked)
vercel build
```

## Troubleshooting

### Common Build Issues

1. **Node Version Mismatch**
   - ⚠️ **Issue**: Vercel project settings may have Node 24.x but need 22.x
   - ✅ **Solution**: Go to Vercel Dashboard → Project Settings → General → Node.js Version
   - ✅ Set Node.js Version to `22.x` (or match `.nvmrc` file which specifies Node 22)
   - ✅ The `vercel.json` specifies `"nodeVersion": "22.x"` but you may need to update in dashboard
   - ✅ After updating, the build should work correctly

2. **Build fails with "Cannot find module @voli/ui"**
   - ✅ Solution: The build command `pnpm nx build web --skip-nx-cache` automatically builds dependencies first
   - ✅ Ensure `tsconfig.base.json` has the correct path mapping: `"@voli/ui": ["ui/src/index.ts"]`
   - ✅ Verify `web/next.config.js` has `transpilePackages: ['@voli/ui']`

3. **Build fails with dependency errors**
   - ✅ Solution: Ensure `pnpm install --frozen-lockfile` runs successfully
   - ✅ Check that all dependencies in `package.json` are compatible
   - ✅ Verify Node version is 20+ (check `.nvmrc` file)

4. **Build timeout**
   - ✅ Solution: Increase build timeout in Vercel dashboard (Settings → General)
   - ✅ Consider optimizing the build by removing unnecessary dependencies

5. **Output directory not found**
   - ✅ Solution: Ensure output directory is set to `web/.next`
   - ✅ Verify the build completes successfully (check build logs)
   - ✅ Test locally first using `bash scripts/test-vercel-build.sh`

6. **Nx cache issues**
   - ✅ Solution: The build command uses `--skip-nx-cache` to ensure fresh builds
   - ✅ If issues persist, you can manually clear cache: `rm -rf .nx/cache`

7. **Testing Build Locally**
   - ✅ Use `bash scripts/test-vercel-build.sh` to simulate Vercel build
   - ✅ This will catch most issues before deploying
   - ✅ Verify build output exists at `web/.next` after running the script

### Environment Variables Needed

Make sure to set these in Vercel dashboard (Settings → Environment Variables):
- `NEXT_PUBLIC_API_BASE_URL` - Your API URL
- `NEXT_PUBLIC_AI_ENABLED` - Set to `false` if not using AI features

### Build Command

The current build command is:
```bash
pnpm nx build web --skip-nx-cache
```

This will:
1. Automatically build the `ui` library dependency first (Nx handles this)
2. Build the Next.js web app
3. Skip Nx cache for fresh builds on Vercel

If you need to debug, you can also use the build script:
```bash
bash scripts/vercel-build.sh
```


