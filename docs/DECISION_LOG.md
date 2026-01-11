# Decision Log (Chronological)

This document tracks all significant technical decisions, issues encountered, and solutions implemented during the development of the Voli volunteer platform, ordered chronologically from oldest to newest.

**Last Updated:** January 12, 2026

---

## Table of Contents (Chronological)

1. [Project Initiation](#project-initiation)
2. [January 2026](#january-2026)
3. [January 11, 2026](#january-11-2026)
4. [January 12, 2026](#january-12-2026)

---

## Project Initiation

### Decision: Using Nx Monorepo with pnpm

**Date:** Project initiation

**Context:**
- Need to manage multiple projects: Next.js web app, ASP.NET Core API, shared UI library
- Want code sharing and consistent tooling across projects

**Decision:**
- Use Nx monorepo for project management
- Use pnpm as package manager (faster than npm, better monorepo support than yarn)

**Rationale:**
- Nx provides excellent tooling for monorepos (dependency graph, caching, affected commands)
- pnpm's workspace protocol works seamlessly with Nx
- Better performance than npm/yarn for large dependency trees

**Outcome:**
✅ Successfully structured monorepo with clear separation between apps and libraries

---

## January 2026

### Issue: Nx Plugin Build Target Not Found on Vercel

**Date:** January 2026

**Problem:**
```
Error: Cannot find configuration for task web:build
```

**Root Cause:**
- Nx plugins auto-generate build targets (like `@nx/next/plugin` creates the `build` target)
- On Vercel, the plugin system wasn't initializing properly, so the build target didn't exist

**Solution:**
- Added explicit `build` target in `web/project.json` using `@nx/next:build` executor
- This ensures the target exists regardless of plugin initialization

**Files Changed:**
- `web/project.json` - Added explicit build target configuration

**Key Learning:**
- Explicit targets are more reliable than plugin-generated ones for CI/CD environments
- Different environments (local vs. Vercel) can have different plugin initialization behaviors

---

### Issue: Tailwind CSS v4 Compatibility

**Date:** January 2026

**Problem:**
```
Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin.
```

**Root Cause:**
- Tailwind CSS v4 changed how it integrates with PostCSS
- Requires `@tailwindcss/postcss` plugin instead of `tailwindcss` directly

**Solution:**
1. Installed `@tailwindcss/postcss` package
2. Updated `ui/postcss.config.js` to use the new plugin:
   ```javascript
   module.exports = {
     plugins: {
       '@tailwindcss/postcss': {},
       autoprefixer: {},
     },
   };
   ```

**Files Changed:**
- `ui/postcss.config.js`
- `package.json` (added dependency)

**Key Learning:**
- Major version upgrades (v3 → v4) often require significant configuration changes
- Always check migration guides for breaking changes

---

### Issue: CSS Module Resolution in UI Library

**Date:** January 2026

**Problem:**
```
Module not found: Can't resolve '@voli/ui/styles.css'
```

**Context:**
- UI library exports CSS file via `package.json` exports
- Next.js web app couldn't resolve the CSS import

**Solution Attempts:**
1. Initially tried updating Rollup config to copy styles.css
2. Added exports to `ui/package.json`
3. **Final Solution:** Changed to relative import path in `web/app/layout.tsx`

**Final Solution:**
```typescript
// Changed from: import '@voli/ui/styles.css';
import '../../ui/src/styles.css';
```

**Rationale:**
- Relative paths are more reliable in monorepo setups
- Avoids complex module resolution issues between packages
- Simpler and more predictable

**Files Changed:**
- `web/app/layout.tsx`

**Key Learning:**
- Sometimes the simplest solution (relative paths) is better than complex module resolution
- Monorepo package boundaries can complicate standard module resolution

---

### Issue: Tailwind v4 @apply Directive Limitations

**Date:** January 2026

**Problem:**
```
Cannot apply unknown utility class `border-border`
```

**Root Cause:**
- Tailwind v4 doesn't recognize CSS variables used in `@apply` directives the same way
- The `border-border` utility referenced a CSS variable, which v4 doesn't support in `@apply`

**Solution:**
- Replaced `@apply` directives with direct CSS properties
- Changed from:
  ```css
  * {
    @apply border-border;
  }
  ```
- To:
  ```css
  * {
    border-color: var(--border);
  }
  ```

**Files Changed:**
- `ui/src/styles.css`

**Key Learning:**
- CSS-in-JS and utility-first frameworks have limitations with CSS variables
- Direct CSS is sometimes more reliable than abstraction layers

---

### Issue: TypeScript Build Errors for Config Files

**Date:** January 2026

**Problem:**
```
Type error: Cannot find module '@vitejs/plugin-react'
```
TypeScript trying to compile `vitest.config.ts` during build

**Solution:**
- Added `vitest.config.ts` to `exclude` array in `web/tsconfig.json`
- Config files don't need to be part of the application build

**Files Changed:**
- `web/tsconfig.json`

**Key Learning:**
- Separate config files should be excluded from application builds
- TypeScript compilation scope should match the actual application code

---

### Issue: ESLint Compatibility in Nx Monorepo

**Date:** January 2026

**Problem:**
- ESLint flat config vs. legacy config conflicts
- TypeScript ESLint plugin compatibility issues
- Circular dependency errors in config

**Solution:**
- Temporarily disabled linting for `web` and `ui` projects due to compatibility issues
- Added to `project.json`:
  ```json
  "lint": {
    "executor": "nx:noop"
  }
  ```

**Rationale:**
- Build and functionality take priority over linting
- Can be re-enabled once ESLint ecosystem stabilizes for Nx monorepos
- Manual code review can catch issues in the meantime

**Future Work:**
- Re-enable linting once ESLint flat config is fully supported in Nx
- Consider using Biome as an alternative linter

**Key Learning:**
- Tooling compatibility in monorepos can be challenging
- Sometimes it's better to disable problematic tools temporarily than to fight compatibility issues

---

### Issue: Next.js 16 + Turbopack + Nx Monorepo = Vercel Deployment Failures

**Date:** January 2026

**Problem:**
Vercel deployments failing with:
```
Error: Turbopack build failed with 4 errors:
./ui/tsconfig.json - extends: "../tsconfig.base.json" doesn't resolve correctly
./web/tsconfig.json - extends: "../tsconfig.base.json" doesn't resolve correctly
./web/app/components/page.tsx - Can't resolve '@voli/ui'
```

**Root Cause:**
- Next.js 16 defaults to using **Turbopack** (new Rust-based bundler) for production builds
- Turbopack is still relatively new and has **limited support for monorepo structures**
- Specifically struggles with:
  - TypeScript config inheritance (`extends: "../tsconfig.base.json"`)
  - Path mappings from `tsconfig.base.json` (like `@voli/ui` → `ui/src/index.ts`)

**Local vs. Vercel Behavior:**
- **Locally:** Often uses Webpack or different bundler context → Works fine
- **Vercel:** Uses Turbopack by default → Fails with path resolution errors

**Decision: Downgrade to Next.js 15**

**Rationale:**
1. **Consistency:** Ensures local and cloud deployments use the same bundler (Webpack)
2. **Reliability:** Webpack has proven support for Nx monorepos
3. **Feature Trade-off:** Next.js 16 features (mostly Turbopack-related) aren't critical for this project
4. **Time to Market:** Faster to downgrade than wait for Turbopack fixes or work around issues

**Solution:**
```bash
pnpm add next@15.1.0 react@18.3.0 react-dom@18.3.0 --save-exact
pnpm add @types/react@18.3.0 @types/react-dom@18.3.0 --save-dev --save-exact
pnpm add eslint-config-next@15 --save-dev --save-exact
```

**Files Changed:**
- `package.json` - Downgraded Next.js and React versions
- `pnpm-lock.yaml` - Updated lockfile

**Outcome:**
✅ Local builds continue to work
✅ Vercel deployments should now work (using Webpack instead of Turbopack)

**Key Learnings:**
- **Always test production builds locally** - Dev and production can use different bundlers
- **New technology isn't always better** - Mature tools (Webpack) often have better ecosystem support
- **Monorepo compatibility** should be a consideration when choosing framework versions
- **Pragmatic decisions** (downgrading) can be better than fighting bleeding-edge issues

**Future Considerations:**
- Monitor Turbopack development - may upgrade when monorepo support improves
- Consider explicit bundler selection if Next.js adds options to choose Webpack vs. Turbopack

---

### Issue: Vercel Build Configuration

**Date:** January 2026

**Problem:**
Multiple Vercel configuration issues:
1. Build command mismatch (using old command instead of `--skip-nx-cache`)
2. Node.js version mismatch (using 24.x instead of 22.x)
3. Nx plugin initialization issues

**Solution:**
1. Created `vercel.json` with correct build configuration
2. Added `.nvmrc` file to specify Node.js version (22.x)
3. Documented manual Vercel dashboard settings in `VERCEL_FIX.md`

**Files Created:**
- `vercel.json` - Vercel configuration
- `.nvmrc` - Node.js version specification
- `VERCEL_FIX.md` - Manual configuration instructions
- `scripts/check-vercel-status.sh` - Status checking script

**Key Learning:**
- Vercel dashboard settings can override `vercel.json` if project was created via dashboard
- Always document both automated (config files) and manual (dashboard) configuration steps

---

### Decision: Explicit Build Targets vs. Plugin-Generated Targets

**Date:** January 2026

**Problem:**
- Nx plugins auto-generate targets (build, dev, test, etc.)
- These work locally but fail in CI/CD environments

**Decision:**
- Use explicit target definitions in `project.json` for critical targets (build, test)
- Rely on plugins for convenience targets that aren't critical for deployments

**Rationale:**
- Explicit targets are more reliable across different environments
- Plugin-generated targets can have initialization issues in CI/CD
- Better error messages when targets are explicitly defined

**Example:**
```json
{
  "targets": {
    "build": {
      "executor": "@nx/next:build",
      "outputs": ["{options.outputPath}"],
      "options": {
        "outputPath": "web/.next"
      },
      "dependsOn": ["^build"]
    }
  }
}
```

**Key Learning:**
- Explicit configuration > implicit magic
- CI/CD environments may behave differently than local development
- Document the "why" behind configuration choices

---

### Decision: Detailed Commit Messages

**Date:** January 2026 (Updated: January 11, 2026)

**Decision:**
- Follow Conventional Commits specification
- Always write detailed commit messages explaining:
  - What changed
  - Why it changed
  - How it was tested

**Update (January 11, 2026):**
- Made format **mandatory and enforced** via commitlint
- Added automatic validation for every commit
- Created git commit template to guide developers

**Created:**
- `CONTRIBUTING.md` - Detailed commit message guidelines (updated with enforcement)
- `COMMIT_MESSAGE_SETUP.md` - Setup guide for commit enforcement

**Note (January 12, 2026):**
- Commit message format enforcement is documented in "Decision: Commit Message Standardization and Enforcement" (January 11, 2026)
- Commit workflow/hygiene guidelines are documented in "Decision: Commit Workflow and Hygiene Guidelines" (January 12, 2026)

**Key Learning:**
- Good commit messages are a form of documentation
- **Enforcement ensures compliance** - Documentation alone isn't enough

---

### Decision: VS Code Workspace Configuration

**Date:** January 2026

**Decision:**
- Create `voli.code-workspace` with:
  - Recommended extensions
  - Editor settings (format on save, etc.)
  - Pre-configured tasks (build, test, deploy, etc.)
  - Language-specific formatters

**Rationale:**
- Consistent development environment across team
- Easier onboarding for new developers
- Pre-configured tasks speed up common workflows

**Files Created:**
- `voli.code-workspace` - VS Code workspace configuration
- Updated `.vscode/extensions.json` - Extension recommendations

---

## January 11, 2026

### Issue: Next.js Dev Server Freeze / Infinite Compilation with Tailwind CSS v4

**Date:** January 11, 2026

**Problem:**
- Running `pnpm nx dev web` freezes the computer
- Terminal shows "compiling..." indefinitely
- CPU/memory usage spikes to 100%
- Dev server never completes initialization

**Root Causes Identified:**
1. **Duplicate Tailwind Processing:**
   - Both `web/app/global.css` and `ui/src/styles.css` contained `@tailwind` directives
   - Importing UI library styles into web app caused Tailwind to process twice
   - This created infinite rebuild loops

2. **Excessive File Scanning:**
   - Tailwind `content` paths included `../../ui/src/**/*.{js,ts,jsx,tsx}`
   - This scanned ALL UI library source files, including non-component files
   - In a monorepo, this can scan thousands of files recursively
   - PostCSS/Tailwind processing couldn't complete due to file volume

3. **Webpack Watch Performance:**
   - Webpack was watching the entire monorepo including UI library
   - No watch optimization for monorepo structure
   - File system watching overwhelmed the system

**Solution Applied:**

1. **Removed Duplicate Tailwind Processing:**
   - Removed `@tailwind` directives from `web/app/global.css` initially
   - Eventually moved ALL Tailwind processing to `web/app/global.css`
   - Stopped importing UI library's `styles.css` into web app
   - Copied CSS variables directly into web app's `global.css`

2. **Optimized Tailwind Content Scanning:**
   ```javascript
   // Before: Scanned entire UI library
   content: [
     './app/**/*.{js,ts,jsx,tsx,mdx}',
     '../../ui/src/**/*.{js,ts,jsx,tsx}', // Too broad!
   ]
   
   // After: Only scan component files
   content: [
     './app/**/*.{js,ts,jsx,tsx,mdx}',
     '../../ui/src/lib/components/**/*.{js,ts,jsx,tsx}', // Specific path
   ]
   ```

3. **Added Webpack Watch Optimizations:**
   ```javascript
   webpack: (config, { dev, isServer }) => {
     if (dev) {
       config.watchOptions = {
         ignored: [
           '**/node_modules/**',
           '**/.next/**',
           '**/dist/**',
           '**/.nx/**',
           '**/ui/**', // Ignore entire UI library
         ],
         aggregateTimeout: 500, // Reduce rebuild frequency
         poll: false,
       };
       config.performance = {
         hints: false, // Disable performance hints in dev
       };
     }
     return config;
   }
   ```

**Files Changed:**
- `web/app/global.css` - Removed duplicate Tailwind, added CSS variables
- `web/app/layout.tsx` - Removed UI library styles import
- `web/tailwind.config.js` - Limited content scanning to component files only
- `web/next.config.js` - Added webpack watch optimizations

**Key Learnings:**
- **Avoid duplicate CSS processing** - Processing Tailwind twice causes infinite loops
- **Be specific with content paths** - Scan only what's needed, not entire directories
- **Optimize file watching** - Monorepos need aggressive watch ignoring
- **Separate concerns** - Web app should handle its own Tailwind processing
- **Test performance** - Dev server hanging is a red flag for configuration issues

**Status:** ✅ Fixed - Dev server now starts quickly without freezing

---

### Issue: Unstyled Page After Fixing Dev Server

**Date:** January 11, 2026

**Problem:**
- Dev server loads successfully (no longer freezes)
- But page appears completely unstyled - no CSS at all
- All shadcn components render but have no styling
- Browser dev tools show no CSS files loaded

**Root Cause:**
- Tailwind CSS v4 uses different syntax than v3
- Was using `@tailwind base; @tailwind components; @tailwind utilities;` (v3 syntax)
- Tailwind v4 requires `@import "tailwindcss";` instead
- PostCSS wasn't processing the v3-style directives correctly with v4 plugin

**Solution:**
- Updated `web/app/global.css` to use Tailwind v4 syntax:
  ```css
  /* Before (v3 syntax) */
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  
  /* After (v4 syntax) */
  @import "tailwindcss";
  ```

- Ensured PostCSS config uses `@tailwindcss/postcss` plugin (required for v4):
  ```javascript
  module.exports = {
    plugins: {
      '@tailwindcss/postcss': {}, // Required for v4
      autoprefixer: {},
    },
  };
  ```

**Files Changed:**
- `web/app/global.css` - Changed from `@tailwind` directives to `@import "tailwindcss"`
- `web/postcss.config.js` - Ensured using `@tailwindcss/postcss` plugin

**Key Learnings:**
- **Tailwind v4 is a major breaking change** - Syntax is different from v3
- **Always check migration guides** - Major version upgrades require config changes
- **CSS processing order matters** - PostCSS plugin must match Tailwind version
- **Test visual output** - Dev server starting ≠ styles working

**Status:** ✅ Fixed - Page now properly styled with Tailwind CSS v4

**Related Issues:**
- Part of the same debugging session as dev server freeze issue
- Both issues stemmed from Tailwind CSS v4 configuration problems
- Fixing one issue (freeze) revealed another (syntax), which is common in complex config

---

### Decision: Commit Message Standardization and Enforcement

**Date:** January 11, 2026

**Context:**
- Need consistent commit message format across the project
- Want to prevent random/inconsistent commit messages
- Need automatic enforcement so everyone follows the same standard

**Decision:**
1. **Standardize commit message format:**
   - Use Conventional Commits specification: `<type>(<scope>): <subject>`
   - Require both type AND scope (no optional scopes)
   - Define specific types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`
   - Define specific scopes: `api`, `web`, `ui`, `docs`, `vercel`, `azure`, `deps`, `config`, `scripts`, `types`

2. **Enforce with commitlint + husky:**
   - Install `@commitlint/cli` and `@commitlint/config-conventional`
   - Configure `commitlint.config.js` with custom rules for types and scopes
   - Set up husky git hooks to run commitlint on every commit
   - Reject commits that don't follow the format

3. **Provide git commit template:**
   - Create `.gitmessage` file with format guide and examples
   - Automatically configure via `postinstall` script for new developers

4. **Automatic setup for new developers:**
   - Add `postinstall` script to run `scripts/setup-commit-enforcement.sh`
   - Script configures git commit template automatically
   - Husky hooks are set up via `prepare` script when `pnpm install` runs

**Rationale:**
- **Consistency:** All commits look professional and uniform
- **History:** Easy to search and understand commit history
- **Automation:** Can generate changelogs automatically
- **Debugging:** Quickly identify what changed and why
- **Team Collaboration:** Clear communication about changes
- **Automatic:** No manual setup required - works for everyone who clones the repo

**Implementation:**
- `commitlint.config.js` - Commitlint configuration with custom rules
- `.husky/commit-msg` - Git hook that validates commit messages
- `.gitmessage` - Git commit template with format guide
- `scripts/setup-commit-enforcement.sh` - Setup script for git template
- `package.json` - Added `prepare` and `postinstall` scripts
- `docs/CONTRIBUTING.md` - Updated with enforcement rules
- `docs/COMMIT_MESSAGE_SETUP.md` - Setup guide documentation

**Outcome:**
✅ Commit message enforcement is active and working
✅ All commits are automatically validated
✅ Default deploy script commit message updated to comply
✅ New developers automatically get enforcement set up

**Key Learnings:**
- **Enforcement > Guidelines** - Automatic validation ensures compliance better than documentation alone
- **Zero-config setup** - Making it automatic (postinstall) ensures everyone gets it
- **Template helps** - `.gitmessage` file guides developers to the right format
- **Scope is important** - Requiring scope makes it easier to filter and understand commits

---

### Decision: Deploy Script Commit Message Format

**Date:** January 11, 2026

**Context:**
- Deploy script (`scripts/deploy.sh`) commits changes automatically
- Default commit message was `"chore: deploy changes"` (missing scope)
- Commitlint would reject this message for missing scope

**Decision:**
- Update default commit message in deploy script to: `"chore(vercel): deploy changes"`
- Use `vercel` scope for deployment-related commits
- Allow custom commit message via script argument, but must follow format

**Rationale:**
- Deploy script commits need to pass commitlint validation
- `vercel` scope clearly indicates deployment-related changes
- Maintaining format consistency even for automated commits

**Files Changed:**
- `scripts/deploy.sh` - Updated default `COMMIT_MSG` variable
- `docs/COMMANDS.md` - Added deployment section with format requirements

**Outcome:**
✅ Deploy script commits now pass commitlint validation
✅ Consistent format for all commits, including automated ones

**Key Learning:**
- **Automated commits must follow standards too** - Scripts that commit should respect the same rules
- **Default values matter** - Even default commit messages should be valid

---

### Issue: Vercel 404 Error After Successful Build

**Date:** January 11, 2026

**Problem:**
- Build succeeds on Vercel (status: ● Ready)
- Deployment completes successfully
- But accessing staging URL (https://voli-eta.vercel.app/) returns 404: NOT_FOUND
- Build logs show routes are generated correctly (/, /api/hello, /components)
- Error: `Code: NOT_FOUND, ID: syd1::bdc67-1768119727327-7679aec53372`

**Root Cause:**
- Set `framework: null` in `vercel.json` to avoid `routes-manifest.json` error
- This disabled Vercel's automatic Next.js framework detection
- Vercel doesn't know how to serve the Next.js app without framework detection
- The build output exists but Vercel routing isn't configured properly

**Solution:**
- Re-enable `framework: "nextjs"` in `vercel.json`
- The `routes-manifest.json` error was likely a false alarm or transient issue
- Vercel needs framework detection to properly serve Next.js apps

**Files Changed:**
- `vercel.json` - Changed `framework: null` back to `framework: "nextjs"`

**Key Learning:**
- **Framework detection is critical** - Disabling it breaks routing even if build succeeds
- Build success ≠ deployment success - The build can work but serving can fail
- The `routes-manifest.json` error might have been transient or resolved by other fixes

**Status:** Investigating - Need to test with framework re-enabled

**Update - Dashboard Configuration Issue Found:**

After reviewing Vercel dashboard settings, the root cause was identified:
- **Framework** in Production Overrides was set to **"Other"** instead of **"Next.js"**
- This explains why Vercel couldn't find `routes-manifest.json` - it wasn't treating it as a Next.js app
- Dashboard settings were overriding `vercel.json` configuration
- Multiple other settings also needed updates (Node.js version, Build Command, Output Directory)

**Files Created:**
- `VERCEL_DASHBOARD_FIX.md` - Detailed fix instructions for dashboard configuration

**Key Learning:**
- **Dashboard settings override `vercel.json`** when both are present
- Always check both Production Overrides AND Project Settings sections
- Framework setting is critical - must be "Next.js" not "Other" for proper detection
- The "Configuration Settings differ" warning banner indicates mismatches

---

### Issue: Vercel "No Serverless Pages Were Built" Error

**Date:** January 11, 2026

**Problem:**
- Build succeeds successfully ("NX Successfully ran target build")
- Routes are generated correctly (/, /api/hello, /components)
- routes-manifest.json is created successfully
- But Vercel reports: "Error: No serverless pages were built"
- This happens AFTER the build completes successfully

**Root Cause:**
Based on external guidance and investigation:
- Vercel detects pnpm 10.x automatically but version mismatches can cause workspace resolution issues
- Using `npx nx` instead of `pnpm nx` can cause inconsistent behavior
- Monorepo context might not be properly detected by Vercel
- Next.js 15 App Router structure might not be recognized correctly

**Solution Applied:**
1. **Pin pnpm version** in `package.json`:
   ```json
   "packageManager": "pnpm@10.27.0"
   ```
   - Ensures consistent pnpm behavior between local and Vercel
   - Matches what Vercel auto-detects (10.x)

2. **Use `pnpm nx` instead of `npx nx`**:
   - Changed from `npx nx build web --prod` to `pnpm nx build web --prod`
   - Ensures Nx runs with the same package manager context
   - More consistent with monorepo workspace resolution

3. **Keep `outputDirectory: "web/.next"`**:
   - Per Nx documentation, this should point to `.next` folder
   - Required for monorepo deployments

4. **Root Directory**: Left empty (monorepo root) - already correct

**Files Changed:**
- `package.json` - Added `packageManager: "pnpm@10.27.0"`
- `vercel.json` - Changed build command from `npx nx` to `pnpm nx`

**Key Learnings:**
- **Package manager consistency matters** - Pin versions to avoid workspace resolution differences
- **Use pnpm directly** - `pnpm nx` is more reliable than `npx nx` in monorepos
- **Build succeeds ≠ Deployment succeeds** - The build can work but Vercel post-processing can fail
- **Monorepo detection is critical** - Vercel needs to understand the workspace structure

**Status:** Testing - Deployment building with pinned pnpm version

---

### Resolution: Vercel Deployment Successfully Fixed

**Date:** January 11, 2026

**Final Solution:**
After multiple iterations and approaches, the deployment was successfully fixed using **Option 1: Set Root Directory to `web`**.

**Root Cause Identified:**
- Vercel's Next.js detection couldn't find App Router pages when building from monorepo root
- Output was in `web/.next`, but Vercel expected `.next` relative to the project root
- Even though build succeeded and App Router files existed, Vercel's post-build detection failed

**Final Solution Steps:**
1. **Set Root Directory to `web` in Vercel Dashboard:**
   - Settings → General → Build & Development Settings
   - Root Directory: Set to `web` (not empty)
   - This makes Vercel treat `web/` as the project root

2. **Updated `vercel.json` build command:**
   ```json
   {
     "buildCommand": "cd .. && pnpm install --frozen-lockfile && cd web && next build",
     "outputDirectory": ".next",
     "framework": "nextjs",
     "installCommand": "cd .. && pnpm install --frozen-lockfile"
   }
   ```
   - Build command now runs from monorepo root (to install deps), then switches to `web/` for `next build`
   - Output directory is `.next` (relative to `web/` root, not `web/.next`)
   - Next.js transpiles `@voli/ui` directly via `transpilePackages`, so no separate build needed

3. **Updated Next.js to 16.1.1:**
   - Fixed security vulnerability (CVE-2025-66478) that was blocking deployments
   - Updated from `15.1.0` to `16.1.1`
   - Note: Next.js 16 reintroduces Turbopack, but with Root Directory set to `web`, it works correctly

**Files Changed:**
- `vercel.json` - Updated build command and output directory for `web/` root context
- `package.json` - Updated Next.js to 16.1.1
- `VERCEL_OPTIONS.md` - Created comprehensive options document (5 different approaches)
- `VERCEL_ROOT_DIRECTORY_FIX.md` - Created quick fix guide

**Outcome:**
✅ **Deployment successful!**
- Status: ● Ready
- URL: https://voli-ggp11m7pe-docile-worm-studios-projects.vercel.app
- Build completes successfully
- App Router pages detected correctly
- Application is live and accessible

**Key Learnings:**
- **Root Directory is critical for monorepos** - Setting it to the app directory (`web/`) makes Vercel treat it as a standalone Next.js app
- **Vercel's Next.js detection needs standard structure** - Building from monorepo root confuses the detection logic
- **Simple solutions often work best** - Setting Root Directory was simpler than complex workarounds (symlinks, copying files, etc.)
- **Security updates can block deployments** - CVE-2025-66478 prevented deployment even after build succeeded
- **Next.js 16 works with Root Directory approach** - Even though we downgraded earlier, 16.1.1 works fine with the `web/` root setup

**Why This Approach Worked:**
- By setting Root Directory to `web`, Vercel sees a standard Next.js App Router structure
- `app/` directory is at `web/app/` which Vercel sees as `app/` (relative to root)
- `.next` output is at `web/.next` which Vercel sees as `.next` (relative to root)
- Framework detection works automatically because structure matches expected Next.js layout

**Files Created for Documentation:**
- `VERCEL_OPTIONS.md` - Comprehensive list of 5 different approaches with pros/cons
- `VERCEL_ROOT_DIRECTORY_FIX.md` - Step-by-step guide for fixing via dashboard

---

### Decision: API Architecture and Deployment Strategy

**Date:** January 11, 2026

**Context:**
- Need to establish how the API is built, hosted, and integrated within the monorepo
- Want to maximize code reusability and clear deployment strategy
- Using ASP.NET Core Web API with Azure Cosmos DB

**Decision:**
1. **Architecture:**
   - Repository Pattern for data access
   - Service Layer for business logic
   - DTOs for data transfer
   - Dependency Injection for loose coupling
   - JWT Bearer Authentication with Azure AD

2. **Hosting:**
   - Deploy to Azure Web App (not Docker containers)
   - Use Azure Cosmos DB for NoSQL database
   - Use Azure AD for authentication

3. **Integration:**
   - API lives in `apps/api/` directory in monorepo
   - Shared code can be organized in `libs/` if needed
   - OpenAPI/Swagger for API documentation and client generation

4. **Deployment:**
   - GitHub Actions for CI/CD
   - Deploy directly as .NET application (not Docker)
   - Use Azure Web App publish profiles for deployment

**Rationale:**
- **Azure Web App:** Simpler than Docker for personal projects, direct .NET deployment
- **Repository Pattern:** Clean separation of concerns, testable, maintainable
- **Azure AD:** Easy authentication, integrates well with Azure ecosystem
- **OpenAPI:** Enables type-safe client generation for web app
- **Monorepo:** Shared code and consistent tooling across web and API

**Documentation Created:**
- `docs/API_OVERVIEW.md` - Comprehensive API documentation including architecture, endpoints, authentication, deployment
- `docs/DOCKER_OPTIONS.md` - Analysis of Docker vs. direct deployment

**Outcome:**
✅ Clear API architecture documented
✅ Deployment strategy established
✅ Authentication approach defined (Azure AD)

**Key Learnings:**
- **Simplicity over complexity** - Direct .NET deployment is simpler than Docker for solo projects
- **Documentation matters** - Clear architecture docs help with onboarding and maintenance
- **Azure ecosystem integration** - Using Azure services together simplifies deployment and auth

---

### Decision: Skip Docker for API Deployment

**Date:** January 11, 2026

**Context:**
- Considering whether to use Docker for API deployment
- API will be deployed to Azure Web App
- This is a personal project

**Decision:**
- **Skip Docker** for now
- Deploy directly as .NET application to Azure Web App
- Revisit Docker later if needed (e.g., for Azure Container Apps or consistency)

**Rationale:**
1. **Simplicity:** Direct .NET deployment is simpler and faster for personal projects
2. **Azure Web App:** Supports direct .NET deployment natively
3. **No container orchestration needed:** No Kubernetes or complex container management
4. **Faster iteration:** Direct deployment = faster feedback loop
5. **Solo project:** Don't need container consistency across multiple developers/environments

**When Docker Would Help:**
- Multiple developers with different environments
- Need for local Cosmos DB emulator consistency
- Plan to use Azure Container Apps
- Complex dependency management

**Documentation:**
- `docs/DOCKER_OPTIONS.md` - Detailed pros/cons analysis and recommendation

**Outcome:**
✅ Decision to skip Docker documented
✅ Clear criteria for when to reconsider

**Additional Notes (January 12, 2026):**
- **Vercel/Local Build Status Discrepancies:** Experiencing frustration with Vercel and local build statuses not aligning consistently. This has led to considering Docker for the API to ensure parity between environments. However, for now, we're holding off on Docker and will continue with direct .NET deployment to Azure Web App. If build status discrepancies become a bigger issue or we need better environment consistency, Docker may be reconsidered.

**Key Learning:**
- **Right tool for the job** - Docker is powerful but adds complexity that may not be needed
- **Start simple** - Can always add Docker later if requirements change
- **Environment parity** - Build status discrepancies between local and cloud can be frustrating, but Docker isn't always the answer

---

### Issue: Web App Styling Architecture - No Custom Templates

**Date:** January 11, 2026

**Decision:**
The web app should **only import components from Storybook** and not create any custom templates or layouts itself.

**Context:**
- User wants web app to use only shadcn/ui components from Storybook library
- Web app should NOT create custom templates, only compose existing components
- Storybook components should handle all styling and structure

**Implementation:**
- Web app's `page.tsx` imports components from `@voli/ui` (Storybook library)
- All layout and structure built using shadcn/ui components (Card, Badge, Button, Alert, etc.)
- No custom templates or layouts created in web app
- Web app is purely a consumer of Storybook components

**Architecture:**
```
Storybook (ui/) → shadcn/ui components
    ↓ exports to @voli/ui
Web App (web/) → imports @voli/ui → composes dashboard
```

**Files:**
- `web/app/page.tsx` - Only imports and uses components from `@voli/ui`
- `web/app/layout.tsx` - Minimal layout, imports global styles
- All styling comes from Storybook components via `@voli/ui`

**Key Principle:**
- **Web app is a consumer, not a creator** - It only uses components from Storybook
- **Separation of concerns** - UI library handles all component definitions
- **Reusability** - Components are defined once in Storybook, used everywhere

**Status:** ✅ Implemented

---

## Summary of Key Principles Established

1. **Pragmatism over Bleeding Edge:** Choose mature, stable tools over the latest versions when stability matters more than features

2. **Explicit > Implicit:** Explicit configuration is more reliable than magic/auto-generated configs

3. **Local = Production:** Strive to make local and production builds use the same tooling (led to Next.js 15 downgrade decision)

4. **Documentation is Part of Development:** Document decisions, issues, and solutions as you go

5. **Iterative Problem Solving:** Fix one issue at a time, test, then move to the next

6. **Simple Solutions First:** Try the simplest solution before complex workarounds (e.g., relative imports vs. complex module resolution)

7. **Enforcement > Guidelines:** Automatic validation ensures compliance better than documentation alone (commit message enforcement)

8. **Right Tool for the Job:** Don't add complexity unnecessarily (skip Docker for solo projects, use direct deployment)

---

## Future Considerations

### Things to Revisit Later

1. **Re-enable ESLint:** Once ESLint flat config ecosystem stabilizes for Nx
2. **Upgrade to Next.js 16:** When Turbopack improves monorepo support (Note: Already upgraded to 16.1.1, but with Root Directory approach)
3. **Explore Biome:** As an alternative to ESLint for faster linting
4. **Optimize Build Performance:** Investigate Nx cache configuration for faster builds
5. **Storybook Integration:** Consider better integration of Storybook with Next.js app

---

## Notes for Interviews/Blog Posts

### Common Themes

- **Monorepo Complexity:** Nx monorepos are powerful but require careful configuration, especially for deployment
- **Tooling Compatibility:** New tools (Turbopack) may not support all use cases (monorepos) immediately
- **Pragmatic Decisions:** Sometimes downgrading is the right choice for project stability
- **Local vs. Production Parity:** Ensuring local and production environments match is crucial

### Technical Highlights

- Successfully set up Nx monorepo with Next.js and ASP.NET Core
- Resolved complex module resolution issues across package boundaries
- Configured Tailwind CSS v4 in a monorepo context
- Made pragmatic technology choices (Next.js 15) for deployment reliability
- Successfully deployed to Vercel using Root Directory approach
