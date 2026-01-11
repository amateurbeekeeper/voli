# Decision Log

This document tracks all significant technical decisions, issues encountered, and solutions implemented during the development of the Voli volunteer platform. This serves as a reference for interviews, blog posts, and understanding the project's technical journey.

---

## Table of Contents

1. [Project Setup Decisions](#project-setup-decisions)
2. [Build System Issues](#build-system-issues)
3. [Styling & UI Library](#styling--ui-library)
4. [TypeScript & Module Resolution](#typescript--module-resolution)
5. [Linting & Code Quality](#linting--code-quality)
6. [Deployment & CI/CD](#deployment--cicd)
7. [Nx Monorepo Configuration](#nx-monorepo-configuration)

---

## Project Setup Decisions

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

## Build System Issues

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

## Styling & UI Library

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

## TypeScript & Module Resolution

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

## Linting & Code Quality

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

## Deployment & CI/CD

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

## Nx Monorepo Configuration

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

## Development Workflow Decisions

### Decision: Detailed Commit Messages

**Date:** January 2026

**Decision:**
- Follow Conventional Commits specification
- Always write detailed commit messages explaining:
  - What changed
  - Why it changed
  - How it was tested

**Rationale:**
- Better project history for debugging
- Easier code reviews
- Helps with automated changelog generation
- Shows professional development practices

**Created:**
- `CONTRIBUTING.md` - Detailed commit message guidelines

**Key Learning:**
- Good commit messages are a form of documentation
- Future you (and teammates) will thank you for detailed commits

---

## Tooling Decisions

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

## Summary of Key Principles Established

1. **Pragmatism over Bleeding Edge:** Choose mature, stable tools over the latest versions when stability matters more than features

2. **Explicit > Implicit:** Explicit configuration is more reliable than magic/auto-generated configs

3. **Local = Production:** Strive to make local and production builds use the same tooling (led to Next.js 15 downgrade decision)

4. **Documentation is Part of Development:** Document decisions, issues, and solutions as you go

5. **Iterative Problem Solving:** Fix one issue at a time, test, then move to the next

6. **Simple Solutions First:** Try the simplest solution before complex workarounds (e.g., relative imports vs. complex module resolution)

---

## Future Considerations

### Things to Revisit Later

1. **Re-enable ESLint:** Once ESLint flat config ecosystem stabilizes for Nx
2. **Upgrade to Next.js 16:** When Turbopack improves monorepo support
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

---

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

**Last Updated:** January 11, 2026
