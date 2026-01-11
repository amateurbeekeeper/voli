# Storybook Deployment

Storybook is currently only available locally. To access it easily, you can deploy it to a static hosting service.

## Local Access

```bash
# Start Storybook locally
pnpm nx storybook ui
```

This starts Storybook at `http://localhost:6006`

## Deployment Options

### Option 1: Deploy to Vercel (Recommended - Free & Easy)

1. **Build Storybook:**
   ```bash
   pnpm nx build-storybook ui
   ```
   This creates a static build in `ui/storybook-static/`

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your Git repository
   - Configure the project:
     - **Framework Preset:** Other
     - **Root Directory:** `ui`
     - **Build Command:** `cd .. && pnpm install --frozen-lockfile && pnpm nx build-storybook ui`
     - **Output Directory:** `storybook-static`
     - **Install Command:** `cd .. && pnpm install --frozen-lockfile`
     - **Node.js Version:** `22.x`

3. **Deploy automatically:**
   Vercel will automatically deploy whenever you push changes to your repository.

### Option 2: Deploy to Chromatic (Storybook's Official Hosting)

Chromatic provides free hosting for Storybook with visual testing:

1. **Install Chromatic:**
   ```bash
   pnpm add -D chromatic
   ```

2. **Create account at [chromatic.com](https://www.chromatic.com)**

3. **Run Chromatic:**
   ```bash
   npx chromatic --project-token=YOUR_PROJECT_TOKEN
   ```

4. **Get your project token** from the Chromatic dashboard after creating a project.

5. **Add to package.json:**
   ```json
   {
     "scripts": {
       "chromatic": "chromatic --project-token=YOUR_PROJECT_TOKEN"
     }
   }
   ```

### Option 3: Deploy to Netlify

1. **Install Netlify CLI:**
   ```bash
   pnpm add -D netlify-cli
   ```

2. **Build Storybook:**
   ```bash
   pnpm nx build-storybook ui
   ```

3. **Deploy:**
   ```bash
   netlify deploy --dir=ui/storybook-static --prod
   ```

4. **Or use Netlify Drop:** Drag and drop the `ui/storybook-static` folder to [app.netlify.com/drop](https://app.netlify.com/drop)

## Quick Deploy Script

Add this to your `package.json`:

```json
{
  "scripts": {
    "storybook:build": "nx build-storybook ui",
    "storybook:deploy": "pnpm storybook:build && vercel --prod --cwd ui/storybook-static"
  }
}
```

Then run:
```bash
pnpm storybook:deploy
```

## Recommended Setup: Vercel + GitHub Integration

The easiest way to keep Storybook up-to-date:

1. Deploy once to Vercel (as described in Option 1)
2. Vercel will automatically redeploy on every push
3. Share the Vercel URL with your team
4. Storybook will always reflect the latest code

## Current Status

Storybook is **not currently deployed**. You can:
- Run it locally with `pnpm nx storybook ui`
- Deploy it using one of the options above
- Add it as a separate Vercel project for easy access

## Access URL (After Deployment)

Once deployed, you'll get a URL like:
- Vercel: `https://voli-storybook.vercel.app`
- Chromatic: `https://www.chromatic.com/builds?appId=...`
- Netlify: `https://voli-storybook.netlify.app`

Bookmark the URL for easy access!
