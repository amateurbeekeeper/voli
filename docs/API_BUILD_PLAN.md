# API Build, Integration & Deployment Plan

**Created:** January 11, 2026  
**Status:** In Progress  
**Goal:** Complete API build, integrate with web app, and deploy to Azure

---

## Overview

This plan covers the complete implementation of:
1. ✅ API build and configuration
2. ✅ API integration with web app
3. ✅ Azure deployment setup
4. ✅ CI/CD pipeline
5. ✅ Testing and validation

---

## Phase 1: API Build & Configuration

### Task 1.1: Verify API Structure ✅
- [ ] Check all controllers exist and are properly configured
- [ ] Verify services and repositories are implemented
- [ ] Ensure DTOs are complete
- [ ] Check Cosmos DB configuration

### Task 1.2: Environment Configuration ✅
- [ ] Create/verify `appsettings.Development.json.example`
- [ ] Create/verify `appsettings.Staging.json.example`
- [ ] Create/verify `appsettings.Production.json.example`
- [ ] Document required environment variables

### Task 1.3: Build Verification ✅
- [ ] Test local build: `pnpm nx build api`
- [ ] Verify no build errors
- [ ] Check output directory structure
- [ ] Test local run: `pnpm nx serve api`

### Task 1.4: OpenAPI/Swagger Setup ✅
- [ ] Verify Swagger UI is accessible at `/swagger`
- [ ] Test OpenAPI spec generation
- [ ] Verify all endpoints are documented

---

## Phase 2: Azure Setup

### Task 2.1: Azure Resources Creation
- [ ] Create Azure Cosmos DB account (if not exists)
- [ ] Create Azure Web App for API (if not exists)
- [ ] Create Azure AD App Registration (if not exists)
- [ ] Configure Cosmos DB database and containers

### Task 2.2: Azure Configuration
- [ ] Set up Application Settings in Azure Web App
- [ ] Configure Cosmos DB connection strings
- [ ] Set up Azure AD authentication settings
- [ ] Configure CORS for web app domain

### Task 2.3: GitHub Secrets Setup
- [ ] Add `AZURE_WEBAPP_NAME_STAGING` secret
- [ ] Add `AZURE_WEBAPP_PUBLISH_PROFILE_STAGING` secret
- [ ] Add `AZURE_WEBAPP_NAME_PROD` secret
- [ ] Add `AZURE_WEBAPP_PUBLISH_PROFILE_PROD` secret
- [ ] Add `STAGING_API_URL` secret (for web app)
- [ ] Add `PROD_API_URL` secret (for web app)

---

## Phase 3: API Client Generation & Integration

### Task 3.1: OpenAPI Client Generation
- [x] Install `openapi-typescript-codegen` package
- [x] Configure client generation in `libs/api-client/project.json`
- [x] Create README for API client library
- [ ] Create script to fetch OpenAPI spec from running API (target exists)
- [ ] Generate TypeScript client (requires running API)
- [ ] Test generated client types

### Task 3.2: Web App Integration
- [x] Create API utility functions (`web/src/lib/api.ts`)
- [x] Create React hook for API client (`web/src/hooks/use-api.ts`)
- [x] Create `.env.example` with API base URL
- [ ] Install generated API client in web app (pending generation)
- [ ] Configure API base URL from environment variables
- [ ] Add authentication token handling

### Task 3.3: API Calls Implementation
- [ ] Implement opportunities fetching
- [ ] Implement applications submission
- [ ] Implement hours logging
- [ ] Add error handling and loading states

---

## Phase 4: CI/CD Pipeline

### Task 4.1: GitHub Actions for API
- [x] Enable API deployment in `.github/workflows/staging.yml`
- [x] Enable API deployment in `.github/workflows/production.yml`
- [x] Add build and publish steps
- [x] Configure deployment to Azure Web App
- [x] Add seed staging job (optional, requires secret)
- [x] Update web deployment to depend on API deployment
- [x] Update E2E tests to use API URL

### Task 4.2: Deployment Verification
- [ ] Test staging deployment (requires Azure secrets)
- [ ] Verify API is accessible at staging URL
- [ ] Test production deployment (requires Azure secrets)
- [ ] Verify API is accessible at production URL

---

## Phase 5: Testing & Validation

### Task 5.1: API Testing
- [ ] Test all endpoints locally
- [ ] Test authentication flow
- [ ] Test authorization policies
- [ ] Verify Cosmos DB operations

### Task 5.2: Integration Testing
- [ ] Test web app → API communication
- [ ] Test authentication token passing
- [ ] Test error handling
- [ ] Verify CORS configuration

### Task 5.3: End-to-End Testing
- [ ] Test full user flow (web app → API → Cosmos DB)
- [ ] Test deployment pipeline
- [ ] Verify environment variable configuration
- [ ] Test rollback procedures

---

## Phase 6: Documentation

### Task 6.1: Update Documentation
- [ ] Update `API_OVERVIEW.md` with deployment status
- [ ] Document API endpoints usage in web app
- [ ] Create troubleshooting guide
- [ ] Update `SETUP.md` with API setup instructions

---

## Success Criteria

- ✅ API builds successfully locally
- ✅ API runs locally without errors
- ✅ API deployed to Azure Web App (staging)
- ✅ API deployed to Azure Web App (production)
- ✅ Web app can communicate with API
- ✅ Authentication flow works end-to-end
- ✅ CI/CD pipeline deploys automatically
- ✅ All endpoints are tested and working

---

## Notes

- All tasks will be executed in order
- Each task will be marked complete when done
- Any issues encountered will be documented
- Deployment will be tested in staging before production
