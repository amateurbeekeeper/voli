# API Client Library

TypeScript client generated from the API's OpenAPI specification.

## Generation

The client is generated from the running API's OpenAPI spec.

### Prerequisites

1. API must be running locally on `http://localhost:5000`
2. Or fetch from staging/production API URL

### Generate Client

```bash
# Fetch OpenAPI spec from running API
pnpm nx openapi api

# Generate TypeScript client
pnpm nx generate api-client
```

Or run both in sequence:

```bash
pnpm nx run-many -t openapi generate --projects=api,api-client
```

## Usage in Web App

```typescript
import { OpportunitiesApi } from '@voli/api-client';

const api = new OpportunitiesApi({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  accessToken: async () => {
    // Get token from auth provider
    return getToken();
  }
});

// Fetch opportunities
const opportunities = await api.getPublishedOpportunities();
```

## Configuration

The client uses Axios and supports:
- Custom base URL
- Authentication token injection
- Request/response interceptors
