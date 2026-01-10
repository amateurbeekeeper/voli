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
   - **Build Command**: `pnpm nx build web`
   - **Output Directory**: `web/.next`
   - **Install Command**: `pnpm install`

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

## Troubleshooting

- **Build fails**: Make sure `pnpm install` runs successfully
- **Cannot find module**: Check that `@voli/ui` path mapping works
- **Deployment timeout**: Increase build timeout in Vercel dashboard if needed


