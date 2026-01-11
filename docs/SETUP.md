# Setup Guide

This guide will help you set up the Voli volunteer platform locally.

## Prerequisites

- Node.js 20+ and pnpm
- .NET SDK 8.0
- Azure Cosmos DB account (for dev and staging environments)
- Auth provider account (Auth0, Clerk, or Entra ID B2C)

## Initial Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```
   
   This automatically sets up commit message enforcement via husky hooks.

2. (Optional) Configure git commit template:
   ```bash
   git config commit.template .gitmessage
   ```
   
   Or run the setup script:
   ```bash
   bash scripts/setup-commit-enforcement.sh
   ```

2. Configure API environment:
   - Copy `apps/api/appsettings.Development.json` and update:
     - `CosmosDb:Endpoint` - Your Cosmos DB endpoint
     - `CosmosDb:Key` - Your Cosmos DB key
     - `CosmosDb:DatabaseName` - Set to `voli-dev`
     - `Auth:Authority` - Your auth provider authority
     - `Auth:Audience` - Your auth provider audience

3. Configure Web environment:
   - Create `web/.env.local` (copy from `web/.env.local.example`)
   - Update `NEXT_PUBLIC_API_BASE_URL` to `http://localhost:5000`
   - Add auth provider configuration

4. Seed the dev database:
   ```bash
   # Start the API first
   pnpm nx serve api
   
   # In another terminal, seed the database
   pnpm nx seed:dev
   ```

## Running Locally

Run both web and API together:
```bash
pnpm nx dev
```

Or run separately:
```bash
# Terminal 1: API
pnpm nx serve api

# Terminal 2: Web
pnpm nx serve web
```

## Testing

Run unit tests:
```bash
pnpm nx test:unit
```

Run e2e tests:
```bash
pnpm nx test:e2e
```

## Building

Build all projects:
```bash
pnpm nx build web
pnpm nx build api
```

## OpenAPI Client Generation

After starting the API:
```bash
# Fetch OpenAPI spec
pnpm nx api:openapi

# Generate TypeScript client
pnpm nx api:client
```

## API Setup

### Prerequisites

- **.NET 8.0 SDK** - Required for API development
- **Azure Cosmos DB** - For data storage (or use Cosmos DB Emulator for local development)

### Configuration

1. **Copy example configuration:**
   ```bash
   cp apps/api/appsettings.Development.json.example apps/api/appsettings.Development.json
   ```

2. **Update `appsettings.Development.json`** with your Cosmos DB credentials:
   ```json
   {
     "CosmosDb": {
       "Endpoint": "https://your-cosmos-account.documents.azure.com:443/",
       "Key": "your-cosmos-primary-key",
       "DatabaseName": "voli-dev"
     }
   }
   ```

3. **Run the API:**
   ```bash
   pnpm nx serve api
   ```

4. **Verify API is running:**
   - Health check: http://localhost:5000/api/health
   - Swagger UI: http://localhost:5000/swagger

### Azure Cosmos DB Emulator (Local Development)

For local development without Azure subscription:

1. Install [Azure Cosmos DB Emulator](https://learn.microsoft.com/en-us/azure/cosmos-db/local-emulator)
2. Start the emulator
3. Use endpoint: `https://localhost:8081`
4. Use key from emulator (shown in emulator UI)

### API Documentation

- **Complete API Reference**: See [API_ENDPOINTS.md](./API_ENDPOINTS.md)
- **Architecture & Deployment**: See [API_OVERVIEW.md](./API_OVERVIEW.md)
- **Troubleshooting**: See [API_TROUBLESHOOTING.md](./API_TROUBLESHOOTING.md)
- **Deployment Guide**: See [API_DEPLOYMENT_CHECKLIST.md](./API_DEPLOYMENT_CHECKLIST.md)

## Storybook

View UI components:
```bash
pnpm nx storybook ui
```

