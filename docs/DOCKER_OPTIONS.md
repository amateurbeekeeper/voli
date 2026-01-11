# Docker Options for API

## Should You Use Docker?

**Short answer:** For a personal project deploying to Azure Web App, **Docker is optional** - direct .NET deployment is usually simpler. Docker can help if you want consistency or are planning to scale.

---

## Docker Pros ✅

### 1. **Consistency Across Environments**
- Same environment in dev/staging/production
- No "works on my machine" issues
- Reproducible builds

### 2. **Easier Local Setup (Sometimes)**
- No need to install .NET SDK locally
- Can run Cosmos DB Emulator in Docker Compose
- New developers can start faster: `docker-compose up`

### 3. **Better for Teams**
- Standardized development environment
- Easier onboarding
- Clearer dependency management

### 4. **Flexibility**
- Can deploy to different platforms (Azure Container Apps, AKS, etc.)
- Not locked into Azure Web App
- Easy to test locally exactly as it runs in production

---

## Docker Cons ❌

### 1. **Added Complexity**
- Need to maintain Dockerfile
- Docker Compose setup (if using local services)
- Build process is more involved
- Debugging is slightly harder

### 2. **Azure Web App Direct Deployment is Simpler**
- .NET deployment to Azure Web App is straightforward
- No container registry needed
- Faster build/deploy cycle
- Less moving parts

### 3. **For Personal Projects**
- Often overkill for solo projects
- More setup time
- More things to maintain
- .NET SDK is easy to install (especially on Mac with Homebrew)

### 4. **Monorepo Complexity**
- Need to handle build context correctly
- Dockerfile needs to be in right location
- Nx builds add complexity

---

## When Docker Makes Sense

Use Docker if:
- ✅ You're working in a team (consistency matters)
- ✅ You want to run Cosmos DB Emulator locally (Docker Compose helps)
- ✅ You plan to deploy to multiple platforms
- ✅ You want exact production parity locally
- ✅ You're planning to scale to Kubernetes/AKS
- ✅ You want to deploy to Azure Container Apps (better for containers)

**Skip Docker if:**
- ✅ It's a personal/solo project
- ✅ You're only deploying to Azure Web App
- ✅ You want the simplest setup possible
- ✅ You're already comfortable with .NET SDK
- ✅ You don't need local Cosmos DB emulator

---

## Recommendation for This Project

**For your current setup (personal project, Azure Web App, Azure Cosmos DB):**

**Skip Docker for now** - Direct .NET deployment is simpler and sufficient.

**Consider Docker later if:**
- You add team members
- You want to use Azure Container Apps
- You need Cosmos DB Emulator locally
- You want exact production parity for debugging

---

## If You Want to Use Docker Anyway

Here's how you'd set it up:

### Option 1: Simple Dockerfile (API Only)

**File:** `apps/api/Dockerfile`

```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project file and restore
COPY ["apps/api/Voli.Api.csproj", "apps/api/"]
RUN dotnet restore "apps/api/Voli.Api.csproj"

# Copy everything and build
COPY . .
WORKDIR "/src/apps/api"
RUN dotnet build "Voli.Api.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "Voli.Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "Voli.Api.dll"]
```

### Option 2: Docker Compose (API + Cosmos DB Emulator)

**File:** `docker-compose.yml` (in repo root)

```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - "5000:8080"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - CosmosDb__Endpoint=https://localhost:8081
      - CosmosDb__Key=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==
      - CosmosDb__DatabaseName=voli-dev
    depends_on:
      - cosmosdb
    networks:
      - voli-network

  cosmosdb:
    image: mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator:latest
    container_name: cosmosdb-emulator
    ports:
      - "8081:8081"
      - "10251:10251"
      - "10252:10252"
      - "10253:10253"
      - "10254:10254"
    environment:
      - AZURE_COSMOS_EMULATOR_PARTITION_COUNT=10
      - AZURE_COSMOS_EMULATOR_ENABLE_DATA_PERSISTENCE=true
    networks:
      - voli-network

networks:
  voli-network:
    driver: bridge
```

**Usage:**
```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up -d

# Stop
docker-compose down
```

### Option 3: Dockerfile for Monorepo (Better for Nx)

**File:** `apps/api/Dockerfile`

```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution/project files for restore
COPY ["apps/api/Voli.Api.csproj", "apps/api/"]
# Copy any other projects/dependencies if needed
RUN dotnet restore "apps/api/Voli.Api.csproj"

# Copy everything
COPY . .

# Build
WORKDIR "/src/apps/api"
RUN dotnet build "Voli.Api.csproj" -c Release -o /app/build

# Publish
FROM build AS publish
RUN dotnet publish "Voli.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "Voli.Api.dll"]
```

### GitHub Actions with Docker

**Update `.github/workflows/production.yml`:**

```yaml
deploy-api:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
    
    - name: Login to Azure Container Registry (if using ACR)
      uses: docker/login-action@v3
      with:
        login-server: ${{ secrets.ACR_LOGIN_SERVER }}
        username: ${{ secrets.ACR_USERNAME }}
        password: ${{ secrets.ACR_PASSWORD }}
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        file: ./apps/api/Dockerfile
        push: true
        tags: ${{ secrets.ACR_LOGIN_SERVER }}/voli-api:latest
    
    - name: Deploy to Azure Web App (Container)
      uses: azure/webapps-deploy@v3
      with:
        app-name: ${{ secrets.AZURE_WEBAPP_NAME_PROD }}
        images: ${{ secrets.ACR_LOGIN_SERVER }}/voli-api:latest
```

---

## Azure Deployment Options with Docker

### Option 1: Azure Web App (Container Support)

Azure Web App supports containers - you can deploy Docker images:

1. **Configure Web App for containers:**
   - Azure Portal → Web App → Deployment Center
   - Source: Container Registry (Docker Hub, ACR, etc.)
   - Image: `your-image-name:latest`

2. **Pros:**
   - Same Web App platform you're already using
   - Integrated with Azure AD, Cosmos DB
   - Easy environment variables

3. **Cons:**
   - Still on App Service (not optimized for containers)
   - Slightly more expensive than direct .NET deployment

### Option 2: Azure Container Apps (Better for Containers)

Azure Container Apps is purpose-built for containers:

1. **Pros:**
   - Auto-scaling
   - Better for containers
   - Pay-per-use pricing
   - Built-in service discovery

2. **Cons:**
   - Different platform (not Web App)
   - Slightly more complex setup
   - May cost more for small apps

3. **When to use:**
   - If you're committed to Docker
   - Need auto-scaling
   - Multiple container services

---

## Comparison: Direct .NET vs Docker

| Feature | Direct .NET | Docker |
|---------|-------------|--------|
| **Setup Complexity** | Simple | Medium |
| **Build Time** | Fast | Slightly slower |
| **Local Dev** | Need .NET SDK | Just Docker |
| **Deployment** | Very simple | Need container registry |
| **Azure Web App** | Native support | Container mode |
| **Cost** | Same | Same (or slightly more) |
| **Debugging** | Easy | Slightly harder |
| **Consistency** | Good | Excellent |
| **Team Onboarding** | Need .NET SDK | Just Docker |

---

## Final Recommendation

**For your current situation:**

1. **Start without Docker** - Get the API deployed and working first
2. **Add Docker later if needed** - When you have a specific reason (team, emulator, etc.)
3. **Direct .NET deployment** is simpler and sufficient for personal projects

**If you do want Docker:**
- Use Option 1 (Simple Dockerfile) for local dev
- Use Option 2 (Docker Compose) if you want Cosmos DB Emulator
- Deploy to Azure Web App (Container) mode
- Keep it simple - don't over-engineer

---

## Quick Start: Adding Docker (If You Want)

1. **Create `apps/api/Dockerfile`** (use Option 1 example above)
2. **Test locally:**
   ```bash
   cd apps/api
   docker build -t voli-api .
   docker run -p 5000:8080 -e CosmosDb__Endpoint=... voli-api
   ```
3. **Deploy to Azure:**
   - Build and push to Azure Container Registry
   - Configure Web App to use container
   - Or use Azure Container Apps

**But honestly, for a personal project - you probably don't need it yet! 😊**
