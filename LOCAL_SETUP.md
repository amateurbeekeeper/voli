# Local Development Setup

This guide helps you run the project locally without Azure resources.

## Prerequisites

- Node.js 20+ and pnpm installed
- .NET SDK 8.0 (for API development, optional if only working on frontend)
- Git

## Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Run the web app locally:**
   ```bash
   # In one terminal
   pnpm nx serve web
   ```
   Visit http://localhost:3000

3. **Run the API locally (if you have .NET SDK):**
   ```bash
   # In another terminal
   pnpm nx serve api
   ```
   Visit http://localhost:5000/swagger

## Running Both Together

```bash
pnpm nx dev
```

This runs both web and API in parallel (web on port 3000, API on port 5000).

## Note About API

The API requires Cosmos DB connection strings to function fully. For now:
- The API will start but endpoints requiring Cosmos DB will fail
- You can still work on the frontend independently
- Configure Cosmos DB later when you set up Azure resources

## Testing Locally

```bash
# Unit tests
pnpm nx test:unit

# E2E tests (requires both web and API running)
pnpm nx test:e2e
```

## Next Steps

1. Set up Vercel deployment (see below)
2. Configure Azure Cosmos DB when ready
3. Set up authentication provider

