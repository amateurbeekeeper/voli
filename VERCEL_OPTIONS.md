# Vercel Deployment Options

## Current Problem
- ✅ Build succeeds locally and on Vercel
- ✅ Routes are generated correctly
- ✅ `routes-manifest.json` is created
- ❌ Vercel reports: "No serverless pages were built"

This error happens AFTER a successful build, meaning Vercel's Next.js runtime can't detect App Router pages in the build output.

---

## Option 1: Set Root Directory to `web` (Recommended - Simplest)

**What it does:** Makes Vercel treat `web/` as the project root, so it works like a standalone Next.js app.

**Changes needed:**
1. **In Vercel Dashboard:**
   - Settings → Build & Development Settings
   - Root Directory: Set to `web` (not empty)
   - Output Directory: Set to `.next` (relative to web/)
   - Build Command: `next build` (instead of `pnpm nx build web`)
   - Install Command: `cd .. && pnpm install --frozen-lockfile` (or keep in vercel.json)

2. **In `vercel.json`:**
   ```json
   {
     "buildCommand": "next build",
     "outputDirectory": ".next",
     "framework": "nextjs",
     "rootDirectory": "web"
   }
   ```

**Pros:**
- ✅ Vercel sees a standard Next.js project structure
- ✅ No monorepo complexity for Vercel
- ✅ Most likely to work

**Cons:**
- ❌ Need to build dependencies (`@voli/ui`) before Next.js build
- ❌ More complex build command if dependencies needed

**Implementation effort:** Low (mostly dashboard config)

---

## Option 2: Build `@voli/ui` as a real npm package

**What it does:** Instead of relying on TypeScript path mappings, build `@voli/ui` as a distributable package that Next.js can import normally.

**Changes needed:**
1. Build `@voli/ui` to `dist/` or `ui/dist/`
2. Update `ui/package.json` with proper `main`, `types`, `exports`
3. Import from `@voli/ui` instead of path mappings
4. Update build order to build UI library first

**Pros:**
- ✅ More robust - works with any bundler
- ✅ Standard monorepo pattern
- ✅ Future-proof

**Cons:**
- ❌ More setup work
- ❌ Need to manage build artifacts
- ❌ May still not fix Vercel detection issue

**Implementation effort:** Medium (requires refactoring imports)

---

## Option 3: Copy App Router files to root temporarily

**What it does:** Build normally, then copy `.next` structure to root so Vercel sees it as a standard Next.js app.

**Changes needed:**
1. After build, copy `web/.next` to `.next` at root
2. Or symlink (but Vercel may not support symlinks)
3. Set Output Directory to `.next` (root)

**Pros:**
- ✅ Minimal code changes
- ✅ Works with current build setup

**Cons:**
- ❌ Hacky workaround
- ❌ May cause issues with other paths
- ❌ Doesn't address root cause

**Implementation effort:** Low (but hacky)

---

## Option 4: Use Vercel's Nx Integration (if available)

**What it does:** If Vercel has native Nx support, use their recommended approach.

**Changes needed:**
1. Check Vercel Nx documentation
2. Use recommended config
3. May need to adjust project structure

**Pros:**
- ✅ Officially supported approach
- ✅ Should handle monorepo correctly

**Cons:**
- ❌ May not exist or may have limitations
- ❌ Could require significant restructuring

**Implementation effort:** Unknown (need to research)

---

## Option 5: Deploy from `web/` subdirectory using Vercel CLI

**What it does:** Treat `web/` as a separate Vercel project, deploy it independently.

**Changes needed:**
1. Create separate Vercel project for `web/`
2. Deploy from `web/` directory
3. Build `@voli/ui` separately or copy it

**Pros:**
- ✅ Complete separation of concerns
- ✅ Works like a standalone app

**Cons:**
- ❌ Lose monorepo benefits for deployment
- ❌ Need to manage two projects
- ❌ Still need to handle `@voli/ui` dependency

**Implementation effort:** Medium (project restructuring)

---

## My Recommendation: Option 1 (Root Directory = `web`)

**Why:**
- Simplest change
- Most likely to work immediately
- Vercel treats it as a standard Next.js app
- Can handle dependency building in build command

**Quick implementation:**
1. Update Vercel Dashboard: Root Directory = `web`
2. Update `vercel.json`: Remove monorepo-specific build commands
3. Build command: `cd .. && pnpm install && pnpm nx build ui && cd web && next build`
   OR: Pre-build `@voli/ui` in a separate step

---

## Questions to Answer First

Before choosing, we need to check:
1. Does `web/.next/server/app` actually contain the App Router pages?
2. What does Vercel's build log show about what it's scanning?
3. Is `@voli/ui` actually needed for the build, or is it already bundled?

Run these to investigate:
```bash
# Check if App Router pages exist in build output
ls -la web/.next/server/app

# Check what Vercel sees in logs
npx vercel inspect <deployment-url> --logs | grep -i "app\|pages\|routes"
```

---

## Next Steps

**If you want me to implement Option 1:**
- I'll update `vercel.json` and provide dashboard instructions
- We'll test immediately

**If you want to investigate first:**
- I'll check the build output structure
- Review full Vercel logs
- Then recommend the best approach

**If you want a different option:**
- Let me know which one and I'll implement it
