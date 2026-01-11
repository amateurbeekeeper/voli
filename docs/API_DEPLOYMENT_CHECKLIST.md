# API Deployment Checklist

This checklist covers all steps needed to deploy the API to Azure.

## Prerequisites

- [ ] Azure account with active subscription
- [ ] Azure CLI installed and logged in
- [ ] GitHub repository with Actions enabled
- [ ] .NET 8.0 SDK installed locally

## Phase 1: Azure Resources Setup

### Azure Cosmos DB

- [ ] Create Cosmos DB account
  ```bash
  az cosmosdb create \
    --name voli-cosmos-{env} \
    --resource-group voli-rg \
    --default-consistency-level Session
  ```
- [ ] Get Cosmos DB connection details
  ```bash
  az cosmosdb keys list \
    --name voli-cosmos-{env} \
    --resource-group voli-rg
  ```
- [ ] Create database (if not auto-created)
- [ ] Note: Containers are created automatically by the API on first use

### Azure Web App

- [ ] Create App Service Plan
  ```bash
  az appservice plan create \
    --name voli-plan-{env} \
    --resource-group voli-rg \
    --sku B1 \
    --is-linux
  ```
- [ ] Create Web App
  ```bash
  az webapp create \
    --name voli-api-{env} \
    --resource-group voli-rg \
    --plan voli-plan-{env} \
    --runtime "DOTNET|8.0"
  ```
- [ ] Configure .NET version
  ```bash
  az webapp config set \
    --name voli-api-{env} \
    --resource-group voli-rg \
    --linux-fx-version "DOTNET|8.0"
  ```

### Azure AD App Registration

- [ ] Register application in Azure AD
- [ ] Configure API permissions
- [ ] Set up app roles (student, organisation, admin)
- [ ] Note Application (client) ID and Tenant ID

## Phase 2: Application Settings

### Configure Azure Web App Settings

- [ ] Set `CosmosDb:Endpoint`
- [ ] Set `CosmosDb:Key` (use Key Vault reference for production)
- [ ] Set `CosmosDb:DatabaseName`
- [ ] Set `Auth:Authority` (Azure AD tenant URL)
- [ ] Set `Auth:Audience` (Application ID)
- [ ] Set `Cors:AllowedOrigins` (web app URLs)
- [ ] Set `ASPNETCORE_ENVIRONMENT` (Staging/Production)

**Via Azure Portal:**
1. Navigate to Web App → Configuration → Application settings
2. Add each setting as a new application setting

**Via Azure CLI:**
```bash
az webapp config appsettings set \
  --name voli-api-{env} \
  --resource-group voli-rg \
  --settings \
    CosmosDb__Endpoint="https://..." \
    CosmosDb__Key="..." \
    CosmosDb__DatabaseName="voli" \
    Auth__Authority="https://login.microsoftonline.com/{tenant-id}" \
    Auth__Audience="{client-id}" \
    Cors__AllowedOrigins__0="https://your-web-app.vercel.app" \
    ASPNETCORE_ENVIRONMENT="Staging"
```

## Phase 3: GitHub Secrets

Add the following secrets to GitHub repository:

- [ ] `AZURE_WEBAPP_NAME_STAGING` - e.g., `voli-api-staging`
- [ ] `AZURE_WEBAPP_PUBLISH_PROFILE_STAGING` - Download from Azure Portal
- [ ] `AZURE_WEBAPP_NAME_PROD` - e.g., `voli-api-prod`
- [ ] `AZURE_WEBAPP_PUBLISH_PROFILE_PROD` - Download from Azure Portal
- [ ] `STAGING_API_URL` - e.g., `https://voli-api-staging.azurewebsites.net`
- [ ] `PROD_API_URL` - e.g., `https://voli-api-prod.azurewebsites.net`
- [ ] `SEED_SECRET` (optional) - Secret for seeding staging database

**To get Publish Profile:**
1. Azure Portal → Web App → Get publish profile
2. Download the `.PublishSettings` file
3. Copy entire contents to GitHub secret

## Phase 4: Deployment

### Test Staging Deployment

- [ ] Push to `develop` branch
- [ ] Verify GitHub Actions workflow runs
- [ ] Check deployment logs for errors
- [ ] Verify API is accessible: `https://voli-api-staging.azurewebsites.net/health`
- [ ] Test Swagger UI: `https://voli-api-staging.azurewebsites.net/swagger`
- [ ] Verify CORS is working (test from web app)

### Test Production Deployment

- [ ] Merge to `main` branch
- [ ] Verify GitHub Actions workflow runs
- [ ] Check deployment logs for errors
- [ ] Verify API is accessible: `https://voli-api-prod.azurewebsites.net/health`
- [ ] Test Swagger UI: `https://voli-api-prod.azurewebsites.net/swagger`
- [ ] Verify CORS is working (test from web app)

## Phase 5: Post-Deployment

### Database Seeding (Staging Only)

- [ ] Seed staging database (if needed)
  ```bash
  curl -X POST https://voli-api-staging.azurewebsites.net/api/seed \
    -H "X-Seed-Secret: {SEED_SECRET}" \
    -H "Content-Type: application/json"
  ```

### Verification

- [ ] Test health endpoint: `GET /health`
- [ ] Test public endpoint: `GET /api/opportunities`
- [ ] Test authenticated endpoint (with JWT token)
- [ ] Verify CORS headers in response
- [ ] Check application logs in Azure Portal

### Monitoring

- [ ] Set up Application Insights (optional)
- [ ] Configure alerting for errors
- [ ] Monitor Cosmos DB usage and costs

## Troubleshooting

### Common Issues

1. **API returns 500 errors**
   - Check application logs in Azure Portal
   - Verify Cosmos DB connection string
   - Verify all required app settings are set

2. **CORS errors from web app**
   - Verify `Cors:AllowedOrigins` includes web app URL
   - Check CORS middleware is configured correctly

3. **Authentication fails**
   - Verify `Auth:Authority` and `Auth:Audience` are correct
   - Check Azure AD app registration configuration
   - Verify JWT token contains required claims

4. **Deployment fails**
   - Check GitHub Actions logs
   - Verify publish profile is correct
   - Ensure .NET 8.0 runtime is configured

## Next Steps

After successful deployment:

1. Update web app environment variables with API URLs
2. Generate API client from deployed API
3. Test end-to-end integration
4. Set up monitoring and alerting
