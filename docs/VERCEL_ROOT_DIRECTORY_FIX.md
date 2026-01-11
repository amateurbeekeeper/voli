# Vercel Root Directory Fix - Quick Instructions

## The Problem
Vercel can't detect App Router pages when output is in `web/.next`. The build works, but Vercel's detection fails.

## The Solution
Set **Root Directory** to `web` in Vercel Dashboard. This makes Vercel treat `web/` as the project root.

## Steps to Fix (2 minutes)

### 1. Update Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Select your project: **voli**
3. Go to: **Settings** → **General** → **Build & Development Settings**
4. Scroll to **Root Directory**
5. **Set Root Directory to:** `web`
6. Click **Save**

### 2. Verify Other Settings

While you're there, ensure these settings match:

- **Framework Preset:** Next.js ✅
- **Build Command:** `cd .. && pnpm install --frozen-lockfile && pnpm nx build ui && cd web && next build`
- **Output Directory:** `.next` (relative to web/, not `web/.next`)
- **Install Command:** `cd .. && pnpm install --frozen-lockfile`
- **Node.js Version:** `22.x`

### 3. What This Does

- Vercel will build from `web/` directory
- Builds `@voli/ui` first (dependency)
- Then runs `next build` inside `web/`
- Output goes to `web/.next` (which Vercel sees as `.next` relative to root)
- Vercel's Next.js detection works normally ✅

### 4. Test

After saving, trigger a new deployment. It should work immediately.

---

## Alternative: If Dashboard Doesn't Work

If setting Root Directory in dashboard doesn't work, you can also add it to `vercel.json`:

```json
{
  "rootDirectory": "web",
  ...
}
```

But Vercel docs recommend setting it in the dashboard for monorepos.

---

## Why This Works

The issue is that Vercel's Next.js detection looks for App Router structure relative to the project root. When root is the monorepo root, it can't find the structure in `web/.next`. By setting root to `web`, Vercel sees a standard Next.js project structure and detection works automatically.
