# Vercel Dashboard Configuration Fix

## Critical Issues Found

Based on the Vercel dashboard screenshot, there are several configuration mismatches that need to be fixed:

### 1. **Framework Setting Mismatch** ⚠️ CRITICAL

**Current Production Override:**
- Framework: **"Other"** ❌

**Should Be:**
- Framework: **"Next.js"** ✅

**Why This Matters:**
- Setting Framework to "Other" explains why Vercel can't find `routes-manifest.json`
- Vercel's Next.js framework detection handles App Router vs Pages Router automatically
- Without proper framework detection, Vercel doesn't know how to process the build output

### 2. **Output Directory Mismatch**

**Dashboard Shows:**
- Output Directory: `web/.next` (Override ON) ❌

**vercel.json Has:**
- Output Directory: `web` ✅

**Problem:**
- Dashboard settings override `vercel.json` when both are present
- Dashboard still shows old value (`web/.next`)
- Need to update dashboard to match `vercel.json` or remove override

### 3. **Build Command Mismatch**

**Production Override (Currently Active):**
- Build Command: `pnpm nx build web --skip-nx-cache` ✅ (CORRECT)

**Project Settings:**
- Build Command: `pnpm nx build web` ❌ (Missing `--skip-nx-cache`)

**Recommendation:**
- Enable override toggle for Build Command
- Set to: `pnpm nx build web --skip-nx-cache`

### 4. **Node.js Version**

**Current:**
- Node.js Version: **24.x** ❌

**Should Be:**
- Node.js Version: **22.x** ✅

**Why:**
- `.nvmrc` specifies Node 22
- Node 24.x can cause compatibility issues with some dependencies

### 5. **Install Command**

**Dashboard Shows:**
- Install Command: `pnpm install` (Override ON)

**Production Override Shows:**
- Install Command: `pnpm install --frozen-lockfile` ✅ (CORRECT)

**Recommendation:**
- Update Project Settings Install Command to: `pnpm install --frozen-lockfile`
- Or keep override and ensure it matches

### 6. **Root Directory**

**Current:**
- Root Directory: Empty

**Recommendation:**
- Leave empty (default) OR
- Set to `./` if needed for monorepo detection

## Step-by-Step Fix Instructions

1. **Go to Project Settings → Build and Deployment**

2. **Update Framework:**
   - In "Production Overrides" section
   - Change Framework from "Other" to **"Next.js"**
   - This is the most critical fix!

3. **Update Output Directory:**
   - In "Project Settings" section
   - Change Output Directory from `web/.next` to **`web`**
   - Keep Override toggle **ON**

4. **Update Build Command:**
   - In "Project Settings" section
   - Turn ON the Override toggle for Build Command
   - Set Build Command to: **`pnpm nx build web --skip-nx-cache`**

5. **Update Install Command:**
   - In "Project Settings" section
   - Ensure Install Command is: **`pnpm install --frozen-lockfile`**
   - Keep Override toggle **ON**

6. **Update Node.js Version:**
   - Change from "24.x" to **"22.x"**

7. **Click "Save"** on each section

## Expected Result After Fixes

After these changes:
- ✅ Framework detection will work properly
- ✅ `routes-manifest.json` error should disappear (Next.js framework handles this)
- ✅ Build output will be found correctly
- ✅ App should deploy successfully and be accessible

## Why This Happened

- Dashboard settings can override `vercel.json` when project was created via dashboard
- The "Production Overrides" section shows what's actually being used in deployments
- Framework being set to "Other" instead of "Next.js" was likely the root cause of routing issues

## Alternative: Use vercel.json Only

If you want to rely solely on `vercel.json`:
1. Turn OFF all override toggles in dashboard
2. Remove Production Overrides
3. Let `vercel.json` control everything

However, some settings (like Node.js version) may need to be set in dashboard regardless.
