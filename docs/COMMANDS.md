# Development Commands

Quick reference for all available commands in the Voli project.

## Development

```bash
# Run web and API together
pnpm dev

# Run web only
pnpm nx dev web

# Run API only
pnpm nx serve api
# or
pnpm nx dev api

# Run Storybook (UI component library)
pnpm storybook
# or
pnpm nx storybook ui
```

## Building

```bash
# Build all projects
pnpm build

# Build web app only
pnpm build:web
# or
pnpm nx build web

# Build API only
pnpm build:api
# or
pnpm nx build api
```

## Linting

```bash
# Lint all projects
pnpm lint

# Lint web app only
pnpm lint:web
# or
pnpm nx lint web

# Lint UI library only
pnpm nx lint ui

# Lint API (format check)
pnpm lint:api
# or
pnpm nx lint api

# Format API code
pnpm nx format api
```

## Vercel Deployment

```bash
# Check latest Vercel deployment status and build logs
pnpm vercel:status

# View deployment logs
pnpm vercel:logs
```

The `vercel:status` command is useful after pushing to check if the deployment succeeded and view any build errors.

## Testing

```bash
# Run all unit tests
pnpm test
# or
pnpm test:unit

# Run web tests only
pnpm test:web
# or
pnpm nx test web

# Run web tests in watch mode
pnpm nx test:watch web

# Run API tests only
pnpm test:api
# or
pnpm nx test api

# Run E2E tests
pnpm test:e2e
# or
pnpm nx e2e e2e

# Run tests in watch mode
pnpm test:watch
```

## Storybook

```bash
# Start Storybook locally (interactive mode)
pnpm storybook
# or
pnpm nx storybook ui

# Build Storybook static site
pnpm storybook:build
# or
pnpm nx build-storybook ui

# Serve static Storybook build
pnpm storybook:static
# or
pnpm nx static-storybook ui
```

**Note:** Storybook is currently only available locally. See [STORYBOOK_DEPLOYMENT.md](./STORYBOOK_DEPLOYMENT.md) for deployment options.

## Other Commands

```bash
# Seed dev database
pnpm seed:dev

# Generate OpenAPI client
pnpm nx api:openapi
pnpm nx api:client

# Run affected commands (for CI)
pnpm nx affected -t lint
pnpm nx affected -t test
pnpm nx affected -t build
```

## Nx Commands

```bash
# Show project graph
pnpm nx graph

# Show project details
pnpm nx show project web

# Run command for affected projects
pnpm nx affected:test
pnpm nx affected:build
pnpm nx affected:lint
```

