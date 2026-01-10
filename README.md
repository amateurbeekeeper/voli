# Voli - Volunteer Platform

A portfolio-grade volunteer platform built with modern technologies demonstrating component-driven UI development, REST APIs, NoSQL database integration, and comprehensive testing.

## Architecture

- **Monorepo**: Nx workspace with pnpm
- **Frontend**: Next.js (App Router) with shadcn/ui components
- **Backend**: ASP.NET Core Web API (C#)
- **Database**: Azure Cosmos DB NoSQL (JSON documents)
- **Testing**: Vitest (frontend), xUnit (backend), Playwright (E2E)
- **UI Development**: Storybook for component documentation

## Project Structure

```
apps/
  web/          # Next.js frontend application
  api/          # ASP.NET Core Web API
  e2e/          # Playwright end-to-end tests
libs/
  ui/           # Shared UI components with Storybook
  api-client/   # Generated TypeScript API client
  shared/       # Shared utilities and types
```

## Quick Start

See [SETUP.md](./SETUP.md) for detailed setup instructions.

```bash
# Install dependencies
pnpm install

# Run development servers (web + API)
pnpm nx dev

# Run tests
pnpm nx test:unit

# Run E2E tests
pnpm nx test:e2e

# View Storybook
pnpm nx storybook ui
```

## Key Features

### ✅ Implemented

- [x] Nx monorepo setup with pnpm
- [x] Next.js app with App Router
- [x] UI component library with Storybook
- [x] ASP.NET Core Web API with Swagger
- [x] Cosmos DB integration with repositories
- [x] Seed runner for deterministic test data
- [x] Unit testing setup (Vitest + xUnit)
- [x] Playwright E2E testing
- [x] CI/CD workflows (GitHub Actions)
- [x] Environment configuration

### 🚧 Next Steps

- [ ] Generate TypeScript API client from OpenAPI
- [ ] Wire web app to use generated API client
- [ ] Implement authentication (Auth0/Clerk/Entra ID)
- [ ] Add API unit tests
- [ ] Implement E2E test flows
- [ ] Configure Azure deployments

## API Endpoints

- `GET /api/opportunities` - List published opportunities
- `GET /api/opportunities/{id}` - Get opportunity details
- `POST /api/opportunities` - Create opportunity (organisation)
- `PATCH /api/opportunities/{id}` - Update opportunity (organisation)
- `POST /api/applications` - Apply to opportunity (student)
- `GET /api/applications/opportunities/{id}` - List applications (organisation)
- `POST /api/hours` - Log volunteer hours (student)
- `GET /api/hours/organisations/{id}` - List hours logs (organisation)
- `PATCH /api/hours/{id}/approve` - Approve hours (organisation)
- `GET /api/me` - Get current user profile
- `GET /api/health` - Health check

## Database Schema

Cosmos DB containers:
- `users` - User accounts (partition: `/id`)
- `organisations` - Organisation profiles (partition: `/id`)
- `opportunities` - Volunteer opportunities (partition: `/organisationId`)
- `applications` - Student applications (partition: `/opportunityId`)
- `hoursLogs` - Volunteer hours logs (partition: `/organisationId`)

## Development Commands

```bash
# Development
pnpm nx dev                    # Run web and API together
pnpm nx serve web              # Run web only
pnpm nx serve api              # Run API only

# Testing
pnpm nx test:unit              # Run all unit tests
pnpm nx test web               # Test web app
pnpm nx test:e2e               # Run E2E tests

# Building
pnpm nx build web              # Build web app
pnpm nx build api              # Build API

# UI Development
pnpm nx storybook ui           # View Storybook

# Seeding
pnpm nx seed:dev               # Seed dev database

# API Client Generation
pnpm nx api:openapi            # Fetch OpenAPI spec
pnpm nx api:client             # Generate TypeScript client
```

## Environment Setup

### API (appsettings.Development.json)
```json
{
  "CosmosDb": {
    "Endpoint": "your-cosmos-endpoint",
    "Key": "your-cosmos-key",
    "DatabaseName": "voli-dev"
  },
  "Auth": {
    "Authority": "your-auth-authority",
    "Audience": "your-auth-audience"
  }
}
```

### Web (.env.local)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_AI_ENABLED=false
```

## License

MIT
