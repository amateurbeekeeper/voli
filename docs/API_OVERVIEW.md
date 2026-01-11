# API Overview - Architecture & Deployment Guide

## API Structure in Monorepo

### Location & Technology
- **Location**: `apps/api/`
- **Technology**: ASP.NET Core Web API (.NET 8.0)
- **Language**: C#
- **Database**: Azure Cosmos DB (NoSQL)

### Current Status
✅ **Built**: API structure is complete  
✅ **Local Development**: Working with Cosmos DB  
⚠️ **Authentication**: Configured but needs Azure AD setup  
⚠️ **API Client**: Not yet generated (TypeScript client from OpenAPI)  
❌ **Hosting**: Not yet deployed (Azure Web App - ready to deploy)

---

## Monorepo Integration

### How API Fits in Nx Workspace

```
voli/
├── apps/
│   ├── api/          ← .NET API (C#)
│   ├── web/          ← Next.js frontend
│   └── e2e/          ← E2E tests
├── libs/
│   ├── ui/           ← Shared UI components
│   ├── api-client/   ← Generated TypeScript API client (future)
│   └── shared/       ← Shared utilities
```

### Nx Project Configuration

**File**: `apps/api/project.json`

```json
{
  "targets": {
    "build": "dotnet build",
    "serve": "dotnet run",
    "lint": "dotnet format --verify-no-changes",
    "format": "dotnet format",
    "test": "dotnet test",
    "openapi": "curl http://localhost:5000/swagger/v1/swagger.json -o libs/api-client/openapi.json"
  }
}
```

**Key Commands:**
- `pnpm nx build api` - Build the API
- `pnpm nx serve api` - Run API locally
- `pnpm dev` - Run both web + API together

---

## API Architecture

### Structure

```
apps/api/
├── Controllers/          # REST API endpoints
│   ├── ApplicationsController.cs
│   ├── OpportunitiesController.cs
│   ├── HoursController.cs
│   ├── MeController.cs
│   └── HealthController.cs
├── Services/            # Business logic
│   ├── ApplicationsService.cs
│   ├── OpportunitiesService.cs
│   └── HoursLogsService.cs
├── Repositories/        # Data access (Cosmos DB)
│   ├── BaseRepository.cs
│   ├── ApplicationsRepository.cs
│   ├── OpportunitiesRepository.cs
│   └── HoursLogsRepository.cs
├── Models/              # Domain models
│   ├── Opportunity.cs
│   ├── Application.cs
│   ├── HoursLog.cs
│   ├── User.cs
│   └── Organisation.cs
├── DTOs/                # Data transfer objects
│   ├── CreateOpportunityDto.cs
│   └── UpdateOpportunityDto.cs
├── Data/                # Cosmos DB client wrapper
│   └── CosmosClientWrapper.cs
└── Program.cs           # API startup & configuration
```

### Design Patterns

**Repository Pattern**
- All data access goes through repositories
- `BaseRepository<T>` provides common Cosmos DB operations
- Each entity has its own repository interface + implementation

**Service Layer**
- Business logic lives in services
- Controllers are thin - delegate to services
- Services use repositories for data access

**Dependency Injection**
- All services/repositories registered in `Program.cs`
- Scoped lifetime for services/repositories
- Singleton for `CosmosClientWrapper`

---

## API Endpoints

### Opportunities
- `GET /api/opportunities` - List all opportunities
- `GET /api/opportunities/{id}` - Get opportunity details
- `POST /api/opportunities` - Create opportunity (Organisation only)
- `PATCH /api/opportunities/{id}` - Update opportunity (Organisation only)

### Applications
- `POST /api/applications` - Apply to opportunity (Volunteer)
- `GET /api/applications/opportunities/{id}` - List applications (Organisation)
- `PATCH /api/applications/{id}/status` - Update application status (Organisation)

### Hours Logs
- `POST /api/hours` - Log volunteer hours (Volunteer)
- `GET /api/hours/organisations/{id}` - List hours for organisation
- `PATCH /api/hours/{id}/approve` - Approve hours (Organisation)

### Other
- `GET /api/me` - Get current user profile
- `GET /api/health` - Health check
- `POST /api/seed` - Seed database (Dev/Staging only)

---

## Authentication & Authorization

### Overview

The API uses **JWT (JSON Web Token) Bearer Authentication**. All authenticated endpoints require a valid JWT token in the `Authorization` header.

**Current Status:**
⚠️ **Configured but not connected** - JWT validation is set up but needs an auth provider (Auth0/Clerk/Entra ID B2C)

### How Auth Works in the API

**1. Configuration (Program.cs)**
```csharp
// JWT Authentication configuration
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var authority = builder.Configuration["Auth:Authority"];
    var audience = builder.Configuration["Auth:Audience"];
    
    options.Authority = authority;
    options.Audience = audience;
    // Validates token signature, expiry, issuer, audience
});
```

**2. Authorization Policies**
```csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Student", policy => policy.RequireClaim("role", "student", "admin"));
    options.AddPolicy("Organisation", policy => policy.RequireClaim("role", "organisation", "admin"));
    options.AddPolicy("Admin", policy => policy.RequireClaim("role", "admin"));
});
```

**3. Controller Usage**
```csharp
[Authorize]  // Requires any authenticated user
[Authorize(Policy = "Student")]  // Requires student or admin role
[Authorize(Policy = "Organisation")]  // Requires organisation or admin role
[Authorize(Policy = "Admin")]  // Requires admin role
```

### Auth Flow

1. **User logs in** via auth provider (Auth0/Clerk/etc) in web app
2. **Auth provider issues JWT token** with claims (userId, email, role, etc.)
3. **Web app sends token** in `Authorization: Bearer <token>` header
4. **API validates token**:
   - Checks signature (from auth provider's public key)
   - Validates issuer (Authority)
   - Validates audience
   - Checks expiry
5. **API extracts claims** from token (userId, role, etc.)
6. **Authorization policies** check role claims
7. **Controller accesses user info** via `User.FindFirstValue()`

### Required JWT Claims

The API expects these claims in the JWT token:

**Standard Claims:**
- `sub` or `nameid` - User ID (accessed as `ClaimTypes.NameIdentifier`)
- `email` - User email (accessed as `ClaimTypes.Email`)
- `name` - User name (accessed as `ClaimTypes.Name`)

**Custom Claims:**
- `role` - User role: `"student"`, `"organisation"`, or `"admin"`
- `organisationId` - Organisation ID (for organisation users)

### Endpoint Authorization

**Public Endpoints (No Auth):**
- `GET /api/opportunities` - List opportunities
- `GET /api/opportunities/{id}` - Get opportunity details
- `GET /api/health` - Health check

**Student Endpoints:**
- `POST /api/applications` - Apply to opportunity
- `POST /api/hours` - Log volunteer hours

**Organisation Endpoints:**
- `POST /api/opportunities` - Create opportunity
- `PATCH /api/opportunities/{id}` - Update opportunity
- `GET /api/applications/opportunities/{id}` - List applications
- `PATCH /api/applications/{id}/status` - Update application status
- `GET /api/hours/organisations/{id}` - List hours logs
- `PATCH /api/hours/{id}/approve` - Approve hours

**Any Authenticated User:**
- `GET /api/me` - Get current user profile
- `GET /api/hours/{id}` - Get hours log (if user has access)

### Configuration

**Environment Variables (appsettings.json):**
```json
{
  "Auth": {
    "Authority": "https://your-auth-provider.auth0.com/",
    "Audience": "https://api.voli.app"
  }
}
```

**For Different Auth Providers:**

**Auth0:**
```json
{
  "Auth": {
    "Authority": "https://your-tenant.auth0.com/",
    "Audience": "https://api.voli.app"
  }
}
```

**Clerk:**
```json
{
  "Auth": {
    "Authority": "https://your-tenant.clerk.accounts.dev",
    "Audience": "https://your-tenant.clerk.accounts.dev"
  }
}
```

**Azure AD (Entra ID) - Recommended:**
```json
{
  "Auth": {
    "Authority": "https://login.microsoftonline.com/{tenant-id}",
    "Audience": "{client-id}"  // Application (client) ID
  }
}
```

**Example:**
```json
{
  "Auth": {
    "Authority": "https://login.microsoftonline.com/12345678-1234-1234-1234-123456789012",
    "Audience": "87654321-4321-4321-4321-210987654321"
  }
}
```

### Where Auth Fits in Architecture

```
┌─────────────┐
│  Web App    │  ← User logs in here
│  (Next.js)  │  ← Gets JWT token from auth provider
└──────┬──────┘
       │ Authorization: Bearer <token>
       ▼
┌─────────────┐
│     API     │  ← Validates JWT token
│ (Program.cs)│  ← Extracts claims (userId, role)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Controllers │  ← Uses [Authorize] attributes
│             │  ← Checks policies (Student/Organisation)
│             │  ← Accesses User.Claims
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Services   │  ← Receives userId from controllers
│             │  ← Business logic uses userId
└──────┬──────┘
       │
       ▼
┌─────────────┐
│Repositories │  ← Data access uses userId for filtering
└─────────────┘
```

### Extracting User Info in Controllers

```csharp
[Authorize]
public class MyController : ControllerBase
{
    [HttpGet]
    public IActionResult GetData()
    {
        // Get user ID from token
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        // Get role
        var role = User.FindFirstValue("role");
        
        // Get organisation ID (for organisation users)
        var organisationId = User.FindFirstValue("organisationId");
        
        // Use in service calls
        var data = _service.GetDataForUser(userId);
        return Ok(data);
    }
}
```

### Azure AD Authentication Setup (Recommended)

Since this is an Azure-hosted project, **Azure AD (Microsoft Entra ID)** is the easiest authentication option. It's free for personal projects and integrates seamlessly with Azure services.

#### Step 1: Register API App in Azure AD

1. **Go to Azure Portal** → Azure Active Directory → App registrations
2. **Click "New registration"**
3. **Configure:**
   - Name: `Voli API`
   - Supported account types: "Accounts in this organizational directory only" (or "Any Azure AD directory" if needed)
   - Redirect URI: Leave blank (API doesn't need it)
   - Click **Register**

4. **Copy the values:**
   - **Application (client) ID** → This is your `Auth:Audience`
   - **Directory (tenant) ID** → Use in Authority URL

#### Step 2: Configure API Permissions

1. **In your API app registration** → API permissions
2. **Click "Add a permission"** → Microsoft Graph → Delegated permissions
3. **Add:**
   - `openid`
   - `profile`
   - `email`
   - `User.Read`
4. **Click "Grant admin consent"** (if you have admin rights)

#### Step 3: Create App Registration for Web App

1. **Create another app registration** for the web app:
   - Name: `Voli Web`
   - Supported account types: Same as API
   - Redirect URI: `http://localhost:3000/api/auth/callback/azure-ad` (for local dev)
   - Click **Register**

2. **Configure Authentication:**
   - Redirect URIs: Add your web app URLs
     - Local: `http://localhost:3000/api/auth/callback/azure-ad`
     - Production: `https://your-domain.vercel.app/api/auth/callback/azure-ad`

3. **Add API Permission:**
   - API permissions → Add a permission → My APIs → Select `Voli API`
   - Add permission (usually no scopes needed for JWT)

4. **Copy values:**
   - **Application (client) ID** → Use in web app
   - **Directory (tenant) ID** → Use in web app

#### Step 4: Update API Configuration

**Update `appsettings.Development.json`:**
```json
{
  "Auth": {
    "Authority": "https://login.microsoftonline.com/{your-tenant-id}",
    "Audience": "{your-api-client-id}"
  }
}
```

**Example:**
```json
{
  "Auth": {
    "Authority": "https://login.microsoftonline.com/12345678-1234-1234-1234-123456789012",
    "Audience": "87654321-4321-4321-4321-210987654321"
  }
}
```

#### Step 5: Add Custom Roles (Optional)

To use the role-based policies (`Student`, `Organisation`, `Admin`), you need to add app roles:

1. **In API app registration** → App roles → Create app role
2. **Add roles:**
   - **student**: "Student", user
   - **organisation**: "Organisation", user
   - **admin**: "Admin", user
3. **Assign users to roles:**
   - Enterprise applications → Your API → Users and groups
   - Assign users to appropriate roles

#### Step 6: Configure in Azure Web App (Production)

When deploying to Azure, add these as **Application Settings** in Azure Portal:

```
Auth__Authority=https://login.microsoftonline.com/{tenant-id}
Auth__Audience={api-client-id}
```

#### Step 7: Integrate in Web App (Next.js)

Install Azure AD provider for NextAuth.js or MSAL:

```bash
# For NextAuth.js
pnpm add next-auth @azure/msal-browser

# Or for MSAL directly
pnpm add @azure/msal-browser @azure/msal-react
```

**Configure in `.env.local`:**
```
AZURE_AD_CLIENT_ID={web-app-client-id}
AZURE_AD_CLIENT_SECRET={web-app-client-secret}
AZURE_AD_TENANT_ID={tenant-id}
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

### Why Azure AD for Personal Projects?

✅ **Free** - Included with Azure subscriptions  
✅ **Easy Setup** - Integrated with Azure Portal  
✅ **No Extra Costs** - No per-user pricing for basic auth  
✅ **Seamless Integration** - Works with all Azure services  
✅ **Enterprise Grade** - Same auth used by Microsoft 365  
✅ **Multiple Auth Methods** - Supports email/password, social logins, MFA

### Next Steps for Auth

1. **Register API in Azure AD** (Step 1-2 above)
2. **Register Web App in Azure AD** (Step 3 above)
3. **Update API Configuration** (Step 4 above)
4. **Configure Roles** (Step 5 above - optional but recommended)
5. **Add to Azure Web App Settings** (Step 6 - when deploying)
6. **Integrate in Web App** (Step 7 - install SDK, configure)
7. **Test Authorization** - Test with different users/roles

---

## Configuration & Environment Variables

### Development (`appsettings.Development.json`)

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
  },
  "Seeding": {
    "AllowSeeding": true
  }
}
```

### Production (`appsettings.Production.json`)

Production settings should be minimal - use environment variables or Azure App Configuration.

**Required Environment Variables:**
- `CosmosDb__Endpoint` - Cosmos DB endpoint URL
- `CosmosDb__Key` - Cosmos DB access key
- `CosmosDb__DatabaseName` - Database name
- `Auth__Authority` - JWT token issuer (Auth0/Clerk/etc)
- `Auth__Audience` - JWT token audience
- `ASPNETCORE_ENVIRONMENT` - Set to `Production`
- `ASPNETCORE_URLS` - Port/binding (usually auto-set by Azure)

**Optional:**
- `Seeding__AllowSeeding` - Always false in production
- `Seeding__Secret` - Secret for seed endpoint (staging only)

---

## Local Development

### Running the API

```bash
# Run API only
pnpm nx serve api
# or
pnpm nx dev api

# Run web + API together
pnpm dev
```

**Default URLs:**
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`
- Swagger UI: `http://localhost:5000/swagger`

### Setup Steps

1. **Install .NET 8.0 SDK**
   ```bash
   # Check if installed
   dotnet --version
   # Should show 8.x.x
   ```

2. **Configure Cosmos DB** (Local Emulator or Azure)
   - Update `appsettings.Development.json` with your Cosmos DB credentials
   - Or use Azure Cosmos DB Emulator for local development

3. **Run the API**
   ```bash
   pnpm nx serve api
   ```

4. **Seed Database** (optional)
   ```bash
   curl -X POST http://localhost:5000/api/seed
   ```

5. **View Swagger UI**
   - Navigate to `http://localhost:5000/swagger`
   - Test endpoints directly from browser

---

## Docker Options (Optional)

See [DOCKER_OPTIONS.md](./DOCKER_OPTIONS.md) for a detailed analysis of whether to use Docker.

**Quick Summary:**
- **For personal projects**: Docker is usually unnecessary - direct .NET deployment is simpler
- **Use Docker if**: You want consistency, local Cosmos DB emulator, or plan to use Azure Container Apps
- **Skip Docker if**: You want the simplest setup, are solo, and only deploying to Azure Web App

**Recommendation:** Start without Docker, add later if needed.

---

## How Web App Uses the API

### Current State

⚠️ **Not Yet Connected**: The web app doesn't currently call the API. This is a next step.

### Planned Integration

1. **Generate TypeScript API Client**
   ```bash
   # Fetch OpenAPI spec from running API
   pnpm nx openapi api
   
   # Generate TypeScript client
   pnpm nx generate api-client
   ```

2. **Use Generated Client in Web App**
   - Import from `@voli/api-client`
   - Type-safe API calls
   - Shared types between frontend/backend

3. **Environment Configuration**
   - Set `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
   - Use different URLs for dev/staging/production

### Example Usage (Future)

```typescript
// In web app
import { OpportunitiesApi } from '@voli/api-client';

const api = new OpportunitiesApi({
  basePath: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
});

// Fetch opportunities
const opportunities = await api.getOpportunities();
```

---

## API Deployment (Azure Web App)

### Current Status

❌ **Not Deployed**: Deployment is configured but commented out in GitHub Actions

### Overview

The API deploys to **Azure App Service (Web App)**, which is perfect for .NET APIs. It's free/low-cost for personal projects and integrates seamlessly with Azure AD authentication and Cosmos DB.

### Step-by-Step Deployment Guide

#### Step 1: Create Azure Web App

1. **Go to Azure Portal** → Create a resource → Web App
2. **Configure Basic Settings:**
   - **Subscription**: Your Azure subscription
   - **Resource Group**: Create new or use existing (e.g., `voli-rg`)
   - **Name**: `voli-api` (must be globally unique, try `voli-api-yourname`)
   - **Publish**: Code
   - **Runtime stack**: `.NET 8 (STS)` or `.NET 8`
   - **Operating System**: Windows (recommended for .NET)
   - **Region**: Choose closest to your users (e.g., `East US`, `West Europe`)
   - **App Service Plan**: 
     - **Free (F1)** - For testing only (limited CPU/memory)
     - **Basic B1** - ~$13/month, better for production
     - **Standard S1** - ~$70/month, recommended for production

3. **Click Review + create** → **Create**

4. **Wait for deployment** (~2-3 minutes)

#### Step 2: Configure Application Settings

1. **Go to your Web App** → Configuration → Application settings
2. **Add these settings** (click "+ New application setting"):

**Required Settings:**
```
CosmosDb__Endpoint=https://your-cosmos-account.documents.azure.com:443/
CosmosDb__Key=your-cosmos-key
CosmosDb__DatabaseName=voli-prod
Auth__Authority=https://login.microsoftonline.com/{your-tenant-id}
Auth__Audience={your-api-client-id}
ASPNETCORE_ENVIRONMENT=Production
```

**Optional Settings:**
```
Seeding__AllowSeeding=false
```

3. **Click Save** (takes ~30 seconds to apply)

#### Step 3: Configure Cosmos DB Access

1. **Go to Cosmos DB account** → Networking
2. **Ensure API can access:**
   - **Public network access**: Enabled (or configure VNet if using private)
   - **Firewall**: Add Azure services (allows Web App to connect)
   - Or: Add your Web App's outbound IP addresses

#### Step 4: Get Publish Profile

1. **Go to Web App** → Overview → Get publish profile
2. **Download** the `.PublishSettings` file
3. **Open the file** and copy its contents (XML format)

#### Step 5: Configure GitHub Secrets

1. **Go to GitHub Repository** → Settings → Secrets and variables → Actions
2. **Add secrets:**
   - **Name**: `AZURE_WEBAPP_NAME_PROD`
     - **Value**: Your Web App name (e.g., `voli-api`)
   
   - **Name**: `AZURE_WEBAPP_PUBLISH_PROFILE_PROD`
     - **Value**: Paste the entire contents of the `.PublishSettings` file

#### Step 6: Enable Deployment in GitHub Actions

1. **Edit** `.github/workflows/production.yml`
2. **Uncomment** the `deploy-api` job:

```yaml
deploy-api:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Setup .NET
      uses: actions/setup-dotnet@v4
      with:
        dotnet-version: '8.0.x'
    - name: Restore dependencies
      run: dotnet restore apps/api/Voli.Api.csproj
    - name: Build
      run: dotnet build apps/api/Voli.Api.csproj --configuration Release --no-restore
    - name: Publish
      run: dotnet publish apps/api/Voli.Api.csproj --configuration Release --no-build --output ./publish
    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v3
      with:
        app-name: ${{ secrets.AZURE_WEBAPP_NAME_PROD }}
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE_PROD }}
        package: ./publish
```

3. **Commit and push** to `main` branch
4. **Deployment will trigger automatically**

#### Step 7: Verify Deployment

1. **Check deployment status:**
   - GitHub Actions tab → See deployment running
   - Azure Portal → Web App → Deployment Center → Logs

2. **Test the API:**
   ```bash
   # Health check
   curl https://your-app-name.azurewebsites.net/api/health
   
   # Should return: {"status":"Healthy"}
   ```

3. **View Swagger UI** (if enabled in staging):
   - Navigate to: `https://your-app-name.azurewebsites.net/swagger`

### Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
# 1. Build and publish
cd apps/api
dotnet publish Voli.Api.csproj --configuration Release --output ./publish

# 2. Deploy using Azure CLI
# First, install Azure CLI and login:
# az login

# Deploy
az webapp deploy \
  --resource-group voli-rg \
  --name your-app-name \
  --src-path ./publish \
  --type zip
```

Or use **Visual Studio/VS Code** with Azure extension:
1. Right-click project → Publish
2. Select Azure → Azure Web App
3. Choose your Web App
4. Click Publish

### Deployment Checklist

- [ ] Azure Web App created
- [ ] Application settings configured (Cosmos DB, Auth, etc.)
- [ ] Cosmos DB firewall allows Azure services
- [ ] GitHub Secrets added (`AZURE_WEBAPP_NAME_PROD`, `AZURE_WEBAPP_PUBLISH_PROFILE_PROD`)
- [ ] Deployment job uncommented in `.github/workflows/production.yml`
- [ ] Pushed to `main` branch (or manually triggered)
- [ ] Deployment successful in GitHub Actions
- [ ] Health check endpoint working (`/api/health`)
- [ ] API accessible at `https://your-app-name.azurewebsites.net`

### Cost Estimate (Personal Project)

**Free Tier:**
- Azure Web App (F1): Free (limited CPU/memory)
- Cosmos DB: 400 RU/s free tier
- Azure AD: Free (up to 50k MAU)

**Recommended (Small Scale):**
- Web App (B1): ~$13/month
- Cosmos DB: ~$25/month (400 RU/s autoscale)
- Azure AD: Free
- **Total: ~$38/month**

**Production Scale:**
- Web App (S1): ~$70/month
- Cosmos DB: ~$50-100/month (depending on usage)
- Azure AD: Free
- **Total: ~$120-170/month**

### Troubleshooting

**Deployment fails:**
- Check GitHub Actions logs
- Verify publish profile secret is correct
- Ensure Web App name matches secret

**API returns 500 errors:**
- Check Application Insights logs (Azure Portal → Web App → Log stream)
- Verify all environment variables are set correctly
- Check Cosmos DB connection (firewall, keys)

**Can't access Swagger:**
- Swagger is disabled in Production by default
- Enable in `Program.cs` or use Staging environment

**Health check fails:**
- Check application settings are correct
- Verify Cosmos DB connection
- Check logs in Azure Portal

---

## Reusable Code & Context

### Shared Libraries

**Current:**
- `libs/shared/` - Intended for shared utilities/types (minimal currently)

**Future:**
- `libs/api-client/` - Generated TypeScript client for web app
- Shared validation rules
- Shared error types
- Shared constants

### Code Reuse Patterns

1. **Repository Pattern**
   - `BaseRepository<T>` provides common CRUD operations
   - All repositories extend base class
   - Reduces duplication in data access code

2. **Service Layer**
   - Business logic centralized in services
   - Controllers remain thin
   - Services can be easily tested in isolation

3. **DTOs (Data Transfer Objects)**
   - Separate DTOs from domain models
   - Prevents over-posting attacks
   - Clear API contract

4. **Dependency Injection**
   - All dependencies registered in `Program.cs`
   - Makes testing easier (can mock dependencies)
   - Promotes loose coupling

### Best Practices

✅ **Do:**
- Use repositories for all data access
- Use services for business logic
- Use DTOs for API input/output
- Validate input in controllers
- Handle errors consistently
- Use dependency injection

❌ **Don't:**
- Access Cosmos DB directly from controllers
- Put business logic in controllers
- Expose domain models directly in API
- Hard-code configuration values
- Skip error handling

---

## Next Steps

1. **Authentication Setup** (Priority for MVP)
   - Choose auth provider (Auth0/Clerk/Entra ID B2C)
   - Configure auth provider application
   - Update API `Auth:Authority` and `Auth:Audience` config
   - Integrate auth SDK in web app
   - Test JWT token validation
   - Test authorization policies

2. **Generate TypeScript API Client**
   - Set up OpenAPI generation
   - Generate client from Swagger spec
   - Include auth token in client requests

3. **Wire Up Web App to API**
   - Add API client to web app
   - Create API hooks/utilities
   - Implement data fetching with auth tokens
   - Handle auth errors (401, 403)

4. **Deploy API to Azure**
   - Set up Azure Web App
   - Configure environment variables (including Auth config)
   - Enable deployment pipeline

5. **Testing**
   - Add API unit tests
   - Add integration tests with auth
   - Test API + Web integration with authentication
   - Test authorization policies with different roles

---

## Useful Commands

```bash
# Development
pnpm nx serve api              # Run API locally
pnpm nx build api              # Build API
pnpm nx lint api               # Check code format
pnpm nx format api             # Format code
pnpm nx test api               # Run tests

# API Client Generation (future)
pnpm nx openapi api            # Fetch OpenAPI spec
pnpm nx generate api-client    # Generate TypeScript client

# Database
pnpm seed:dev                  # Seed dev database

# Deployment (manual)
dotnet publish apps/api/Voli.Api.csproj --configuration Release --output ./publish
```

---

## Resources

- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [Azure Cosmos DB Documentation](https://docs.microsoft.com/en-us/azure/cosmos-db/)
- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Nx .NET Plugin](https://nx.dev/recipes/dotnet)
