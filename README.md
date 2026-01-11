# Voli

A volunteer platform connecting students with volunteer opportunities. Students can discover opportunities, apply to positions, log volunteer hours, and track their community impact. Organizations can post opportunities, manage applications, and verify volunteer hours.

---

## What is Voli?

Voli is a full-stack platform designed to streamline the volunteer ecosystem. The platform enables:

- **Students** to discover volunteer opportunities, apply to positions, log their volunteer hours, and build a portfolio of community service
- **Organizations** to post volunteer opportunities, review applications, manage volunteers, and verify completed hours
- **Schools/Institutions** to track and verify student volunteer hours for academic or program requirements

### Problem We're Solving

Managing volunteer programs involves manual coordination between students, organizations, and institutions. Voli digitizes this process, providing a centralized platform for opportunity discovery, application management, hour tracking, and verification.

---

## Architecture

Voli is built as a modern monorepo using **Nx** for workspace management, enabling code sharing and consistent tooling across the entire stack.

### Tech Stack

**Frontend:**
- **Next.js 16** (App Router) - React framework for the web application
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - Component library (via Storybook)
- **Vercel** - Frontend hosting and deployment

**Backend:**
- **ASP.NET Core 8.0** - REST API built with C#
- **Azure Cosmos DB** - NoSQL database for flexible data storage
- **Azure AD** - Authentication and authorization
- **Azure Web App** - API hosting and deployment

**Infrastructure:**
- **Nx Monorepo** - Workspace management and tooling
- **pnpm** - Fast, efficient package management
- **GitHub Actions** - CI/CD for both frontend and backend
- **TypeScript API Client** - Auto-generated from OpenAPI spec

### How It Works

```
┌─────────────────┐
│   Web App       │  Next.js (Vercel)
│   (Next.js)     │  ────────────────
└────────┬────────┘         │
         │                  │
         │  HTTP/REST       │  JWT Auth
         │  API Calls       │  (Azure AD)
         ▼                  ▼
┌─────────────────┐
│   API           │  ASP.NET Core (Azure Web App)
│   (C#/.NET)     │  ───────────────────────────
└────────┬────────┘
         │
         │  Cosmos DB SDK
         ▼
┌─────────────────┐
│   Cosmos DB     │  Azure Cosmos DB
│   (NoSQL)       │
└─────────────────┘
```

**Request Flow:**
1. User interacts with the Next.js web app
2. Web app makes authenticated API calls to the ASP.NET Core API
3. API validates JWT tokens from Azure AD
4. API queries/updates data in Azure Cosmos DB
5. Response flows back to the web app
6. UI updates with the data

---

## Directory Structure

```
voli/
├── apps/
│   ├── api/              # ASP.NET Core Web API (C#)
│   │   ├── Controllers/  # REST API endpoints
│   │   ├── Services/     # Business logic layer
│   │   ├── Repositories/ # Data access layer (Cosmos DB)
│   │   ├── Models/       # Domain models
│   │   ├── DTOs/         # Data transfer objects
│   │   └── Data/         # Cosmos DB client wrapper
│   │
│   ├── web/              # Next.js web application
│   │   ├── app/          # Next.js App Router pages
│   │   ├── src/
│   │   │   ├── lib/      # API utilities, helpers
│   │   │   └── hooks/    # React hooks (API client)
│   │   └── public/       # Static assets
│   │
│   └── e2e/              # End-to-end tests (Playwright)
│
├── libs/
│   ├── ui/               # Shared UI component library (Storybook)
│   │   └── src/
│   │       └── lib/
│   │           └── components/  # shadcn/ui components
│   │
│   ├── api-client/       # Generated TypeScript API client
│   │   └── src/          # Auto-generated from OpenAPI spec
│   │
│   └── shared/           # Shared utilities and types
│
├── docs/                 # Project documentation
│   ├── API_OVERVIEW.md   # Complete API documentation
│   ├── API_BUILD_PLAN.md # Development plan
│   ├── DECISION_LOG.md   # Technical decisions log
│   └── ...
│
├── scripts/              # Utility scripts
│   ├── deploy.sh         # Deployment automation
│   └── ...
│
├── .github/
│   └── workflows/        # CI/CD pipelines
│       ├── staging.yml   # Staging deployments
│       └── production.yml # Production deployments
│
├── package.json          # Workspace dependencies (pnpm)
├── nx.json               # Nx workspace configuration
└── tsconfig.base.json    # TypeScript base configuration
```

### Key Directories Explained

**`apps/api/`** - The backend API built with ASP.NET Core. Contains controllers for REST endpoints, services for business logic, and repositories for Cosmos DB access. Uses JWT authentication via Azure AD.

**`apps/web/`** - The frontend Next.js application. Uses App Router, server components, and client components. Consumes the API via auto-generated TypeScript client.

**`libs/ui/`** - Shared component library built with Storybook. Contains all shadcn/ui components that can be reused across the platform. Exported as `@voli/ui` package.

**`libs/api-client/`** - TypeScript client generated from the API's OpenAPI specification. Provides type-safe API calls from the web app to the backend.

---

## Getting Started

### Prerequisites

- **Node.js 22.x** (or use `.nvmrc`)
- **pnpm 10.x** (installed automatically via `package.json`)
- **.NET 8.0 SDK** (for API development)
- **Azure account** (for Cosmos DB and hosting - optional for local dev)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd voli
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```
   This automatically:
   - Installs all npm dependencies
   - Sets up Git hooks (Husky) for commit message validation
   - Configures Git commit template

3. **Configure API (Optional - for local API development)**
   
   Copy the example configuration files:
   ```bash
   cp apps/api/appsettings.Development.json.example apps/api/appsettings.Development.json
   ```
   
   Update `apps/api/appsettings.Development.json` with your Cosmos DB credentials (or use Azure Cosmos DB Emulator for local development).

4. **Configure Web App (Optional - for API integration)**
   
   Create `.env.local` in the `web/` directory:
   ```bash
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
   ```

### Running the Application

**Development Mode:**
```bash
# Run both web and API together
pnpm dev

# Or run individually:
pnpm nx serve web    # Web app (http://localhost:3000)
pnpm nx serve api    # API (http://localhost:5000)
```

**Build:**
```bash
# Build all projects
pnpm build

# Build specific project
pnpm nx build web
pnpm nx build api
```

**Other Commands:**
```bash
# Linting
pnpm lint

# Testing
pnpm test              # Run all tests
pnpm nx test web       # Test web app
pnpm nx test api       # Test API

# Storybook (UI component library)
pnpm storybook         # Start Storybook dev server
pnpm storybook:build   # Build Storybook for deployment

# API Client Generation (requires running API)
pnpm nx openapi api                    # Fetch OpenAPI spec
pnpm nx generate api-client            # Generate TypeScript client

# Database Seeding (requires running API)
pnpm seed:dev                          # Seed local database
```

---

## Development Workflow

### Code Standards

**Commit Messages:**
All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) format:
```
<type>(<scope>): <subject>

[optional body]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`  
**Scopes:** `api`, `web`, `ui`, `docs`, `vercel`, `azure`, `deps`, `config`, `scripts`, `types`

**Examples:**
```
feat(web): add opportunities list page
fix(api): resolve Cosmos DB query issue
docs(api): update deployment instructions
```

Commit messages are automatically validated via Git hooks (Husky + commitlint).

### Working with the Monorepo

**Nx Commands:**
```bash
# Run commands for specific projects
pnpm nx <target> <project>

# Examples:
pnpm nx build web
pnpm nx serve api
pnpm nx lint ui

# Run commands for multiple projects
pnpm nx run-many -t build --projects=web,api
```

**Understanding Project Dependencies:**
```bash
# Visualize project graph
pnpm nx graph

# See what depends on a project
pnpm nx show project web --with-target build
```

---

## Deployment

### Frontend (Web App)

The web app is deployed to **Vercel** automatically via GitHub Actions when code is pushed to `develop` (staging) or `main` (production) branches.

**Manual Deployment:**
```bash
pnpm deploy
```

### Backend (API)

The API is deployed to **Azure Web App** via GitHub Actions. See `docs/API_DEPLOYMENT_CHECKLIST.md` for complete setup instructions.

**Prerequisites:**
- Azure Web App created and configured
- GitHub secrets configured (`AZURE_WEBAPP_NAME_STAGING`, `AZURE_WEBAPP_PUBLISH_PROFILE_STAGING`, etc.)

**Deployment Flow:**
1. Push to `develop` branch → Deploys to staging
2. Push to `main` branch → Deploys to production
3. API deployment runs first, then web app deployment depends on it

---

## Documentation

- **`docs/API_OVERVIEW.md`** - Complete API documentation, architecture, authentication, deployment
- **`docs/API_BUILD_PLAN.md`** - Development plan and task tracking
- **`docs/API_DEPLOYMENT_CHECKLIST.md`** - Step-by-step Azure deployment guide
- **`docs/DECISION_LOG.md`** - Technical decisions and rationale (chronological)
- **`docs/MVP.md`** - Product requirements and features
- **`docs/CONTRIBUTING.md`** - Contribution guidelines and commit message rules
- **`docs/SETUP.md`** - Detailed setup instructions
- **`docs/COMMANDS.md`** - Complete command reference

---

## Project Status

**Current Status:**
- ✅ Web app deployed to Vercel (staging & production)
- ✅ API infrastructure complete and ready for deployment
- ✅ CI/CD pipelines configured
- ✅ API client generation infrastructure ready
- ⏳ Azure deployment pending (see `docs/API_DEPLOYMENT_CHECKLIST.md`)
- ⏳ Authentication integration in progress
- ⏳ End-to-end testing in progress

---

## TODO / Future Plans

### Testing Infrastructure
- **Unit Tests**: Implement comprehensive unit tests for API services, repositories, and web app components
- **E2E Testing**: Set up headless browser tests (Playwright) that run automatically once the application is more functional
  - Test complete user flows (student application, organization management, hours logging)
  - Integrate E2E tests into CI/CD pipeline
  - Add visual regression testing

### UI Development & Design
- **Webflow Integration**: Explore using Webflow code export for UI components and integrate them into Storybook
  - Export components from Webflow
  - Integrate exported code with existing Storybook setup
  - Maintain design system consistency between Webflow and Storybook

### AI Integration
- **AI Features**: Integrate AI capabilities into the platform (planned for later phases)
  - Potential use cases: smart opportunity matching, automated application review, intelligent hours verification
  - Technical approach to be determined based on requirements

---

## Technologies & Decisions

This project uses modern, production-ready technologies:

- **Nx Monorepo** - Enables code sharing, consistent tooling, and efficient builds
- **Next.js 16** - Latest React framework with App Router, Server Components, and excellent performance
- **ASP.NET Core 8.0** - Mature, performant backend framework with excellent Azure integration
- **Azure Cosmos DB** - Globally distributed NoSQL database with automatic scaling
- **Azure AD** - Enterprise-grade authentication integrated with Azure ecosystem
- **TypeScript** - Type safety across the entire stack
- **pnpm** - Fast, disk-efficient package management ideal for monorepos

See `docs/DECISION_LOG.md` for detailed rationale behind technology choices and architectural decisions.

---

## Contributing

See `docs/CONTRIBUTING.md` for contribution guidelines, including commit message standards and development workflow.

---

## License

[Your License Here]
