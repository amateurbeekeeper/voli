# API Troubleshooting Guide

Common issues and solutions when working with the Voli API.

---

## Build Issues

### Issue: Build fails with "Cannot find configuration"

**Error:**
```
Error: Cannot find configuration for task api:build
```

**Solution:**
- Ensure you're running from the monorepo root
- Check that `apps/api/project.json` exists and has a `build` target
- Run: `pnpm nx build api`

---

### Issue: Build fails with null reference warnings

**Error:**
```
warning CS8604: Possible null reference argument for parameter 'databaseName'
```

**Solution:**
- Already fixed in `Program.cs` - database name defaults to "voli"
- If you see this error, ensure you're using the latest code
- The fix: `var cosmosDatabaseName = builder.Configuration["CosmosDb:DatabaseName"] ?? "voli";`

---

## Configuration Issues

### Issue: API won't start - Cosmos DB connection fails

**Error:**
```
CosmosException: The input authorization token can't serve the request
```

**Solution:**
1. Check `appsettings.Development.json` has Cosmos DB credentials
2. Verify Endpoint URL is correct (should end with `:443/`)
3. Verify Key is correct (primary or secondary key)
4. For local development, use Cosmos DB Emulator:
   - Endpoint: `https://localhost:8081`
   - Key: Get from emulator UI

---

### Issue: CORS errors from web app

**Error:**
```
Access to fetch at 'http://localhost:5000/api/opportunities' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution:**
1. Check `Cors:AllowedOrigins` in `appsettings.Development.json`
2. Ensure web app URL is in the allowed origins list
3. Default development origins: `http://localhost:3000`, `https://localhost:3000`
4. For staging/production, add web app URLs to allowed origins

**Example configuration:**
```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://localhost:3000",
      "https://your-web-app.vercel.app"
    ]
  }
}
```

---

### Issue: Authentication fails

**Error:**
```
401 Unauthorized
```

**Possible Causes:**

1. **Missing token:**
   - Ensure request includes `Authorization: Bearer <token>` header
   - Token must be valid JWT from Azure AD

2. **Invalid token:**
   - Token expired - get new token
   - Token not from correct issuer - check `Auth:Authority` matches token issuer

3. **Wrong audience:**
   - Check `Auth:Audience` matches token audience
   - For Azure AD, audience is the Application (client) ID

4. **Missing claims:**
   - Token must include `role` claim
   - Token must include `sub` or `nameid` claim

**Solution:**
- Verify `Auth:Authority` and `Auth:Audience` in appsettings
- Check token contains required claims using https://jwt.io
- Ensure Azure AD app registration is configured correctly

---

### Issue: 403 Forbidden on endpoints

**Error:**
```
403 Forbidden - User doesn't have required role
```

**Solution:**
- Check user's token has the correct `role` claim
- Required roles:
  - Student endpoints: `role: "student"` or `"admin"`
  - Organisation endpoints: `role: "organisation"` or `"admin"`
  - Admin endpoints: `role: "admin"`
- Verify Azure AD app roles are configured and assigned to users

---

## Runtime Issues

### Issue: Seed endpoint returns 403 or 400

**Error:**
```
403 Forbid - Seeding is not allowed in production
```
or
```
400 BadRequest - Seeding is not enabled
```

**Solution:**
1. Production: Seeding is intentionally blocked - cannot seed production
2. Development/Staging: Set `Seeding:AllowSeeding: true` in appsettings
3. Optional: Set `Seeding:Secret` and include `X-Seed-Secret` header

**Example:**
```json
{
  "Seeding": {
    "AllowSeeding": true,
    "Secret": "your-secret-here"
  }
}
```

**Usage:**
```bash
curl -X POST http://localhost:5000/api/seed \
  -H "X-Seed-Secret: your-secret-here" \
  -H "Content-Type: application/json"
```

---

### Issue: Cosmos DB operations fail

**Error:**
```
CosmosException: Partition key provided either doesn't match the definition in the collection or exceeds the 100-byte limit
```

**Solution:**
- Ensure partition key values match container partition key paths:
  - `opportunities`: partition key is `/organisationId`
  - `applications`: partition key is `/opportunityId`
  - `hoursLogs`: partition key is `/organisationId`
  - `users`: partition key is `/id`
  - `organisations`: partition key is `/id`
- When querying/updating, always provide the correct partition key value

---

### Issue: Swagger UI not accessible

**Error:**
- Swagger UI not loading at `/swagger`
- 404 Not Found

**Solution:**
- Swagger UI is only enabled in Development and Staging environments
- Check `ASPNETCORE_ENVIRONMENT` is set to `Development` or `Staging`
- In Production, Swagger is disabled for security
- Verify `Program.cs` has:
  ```csharp
  if (app.Environment.IsDevelopment() || app.Environment.IsStaging())
  {
      app.UseSwagger();
      app.UseSwaggerUI();
  }
  ```

---

## Deployment Issues

### Issue: Deployment fails - Application Settings not found

**Error:**
```
Configuration value 'CosmosDb:Endpoint' is null
```

**Solution:**
- Ensure all required Application Settings are configured in Azure Web App
- Required settings:
  - `CosmosDb__Endpoint`
  - `CosmosDb__Key`
  - `CosmosDb__DatabaseName`
  - `Auth__Authority` (if using authentication)
  - `Auth__Audience` (if using authentication)
  - `Cors__AllowedOrigins__0` (for each allowed origin)

**Azure Portal:**
1. Navigate to Web App → Configuration → Application settings
2. Add each setting (use `__` instead of `:` for nested settings)
3. Save and restart the app

---

### Issue: Deployment fails - Build succeeds but API doesn't start

**Error:**
- Build completes successfully
- But API returns 500 errors or doesn't respond

**Solution:**
1. Check Application Insights or logs in Azure Portal
2. Verify all Application Settings are set correctly
3. Check Cosmos DB connection (may need firewall rules)
4. Verify .NET runtime version matches (should be 8.0)
5. Check App Service Plan has sufficient resources

---

## Development Issues

### Issue: Cannot generate API client

**Error:**
```
curl: (7) Failed to connect to localhost port 5000
```

**Solution:**
- API must be running to generate client
- Start API: `pnpm nx serve api`
- Wait for API to start (check http://localhost:5000/api/health)
- Then run: `pnpm nx openapi api`
- Then run: `pnpm nx generate api-client`

---

### Issue: Hot reload not working

**Solution:**
- .NET hot reload is enabled by default with `dotnet watch`
- Use `pnpm nx serve api` (which uses `dotnet run`)
- For hot reload, use: `dotnet watch run` in `apps/api/` directory
- Or configure VS Code launch.json for hot reload

---

## Performance Issues

### Issue: Slow Cosmos DB queries

**Solution:**
- Check RU/s (Request Units per second) allocation in Cosmos DB
- Consider increasing throughput for development
- Use indexing policies for frequently queried fields
- Consider caching frequently accessed data

---

### Issue: High memory usage

**Solution:**
- Check Cosmos DB connection pooling settings
- Review repository implementations for inefficient queries
- Consider pagination for large result sets
- Monitor Application Insights for memory leaks

---

## Getting Help

1. **Check Logs:**
   - Local: Check console output
   - Azure: Application Insights or Log Stream in Azure Portal

2. **Verify Configuration:**
   - Check all appsettings files
   - Verify environment variables
   - Check Azure Application Settings

3. **Test Connectivity:**
   - Test Cosmos DB connection separately
   - Test authentication token separately
   - Test endpoints with Swagger UI

4. **Documentation:**
   - See [API_OVERVIEW.md](./API_OVERVIEW.md) for architecture
   - See [API_ENDPOINTS.md](./API_ENDPOINTS.md) for endpoint reference
   - See [API_DEPLOYMENT_CHECKLIST.md](./API_DEPLOYMENT_CHECKLIST.md) for deployment

---

## Common Configuration Mistakes

1. **Wrong configuration key format:**
   - ❌ `CosmosDb:Endpoint` (in appsettings.json)
   - ✅ `CosmosDb__Endpoint` (in Azure Application Settings)

2. **Missing trailing slash in Cosmos DB endpoint:**
   - ❌ `https://account.documents.azure.com:443`
   - ✅ `https://account.documents.azure.com:443/`

3. **Wrong partition key:**
   - Always use the partition key path from container definition
   - Check repository implementations for correct partition key usage

4. **CORS origin mismatch:**
   - Ensure exact URL match (including protocol and port)
   - `http://localhost:3000` ≠ `https://localhost:3000`

---

## Debugging Tips

1. **Enable detailed logging:**
   ```json
   {
     "Logging": {
       "LogLevel": {
         "Default": "Debug",
         "Microsoft.AspNetCore": "Information"
       }
     }
   }
   ```

2. **Test endpoints with curl:**
   ```bash
   # Health check
   curl http://localhost:5000/api/health
   
   # With authentication
   curl -H "Authorization: Bearer <token>" http://localhost:5000/api/me
   ```

3. **Use Swagger UI:**
   - Navigate to http://localhost:5000/swagger
   - Test endpoints directly
   - See request/response formats

4. **Check Cosmos DB data:**
   - Use Azure Portal Data Explorer
   - Verify data is being created/updated correctly
