# API Endpoints Reference

Complete reference of all API endpoints, including request/response formats, authentication requirements, and usage examples.

**Base URL:**
- Development: `http://localhost:5000`
- Staging: `https://your-staging-api.azurewebsites.net`
- Production: `https://your-production-api.azurewebsites.net`

---

## Public Endpoints (No Authentication Required)

### Health Check

**GET** `/api/health`

Health check endpoint to verify API is running.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-11T20:00:00Z"
}
```

**Status Codes:**
- `200 OK` - API is healthy

---

### List Opportunities (Published)

**GET** `/api/opportunities`

Get all published volunteer opportunities (public listing).

**Response:**
```json
[
  {
    "id": "opp-123",
    "organisationId": "org-456",
    "title": "Community Garden Volunteer",
    "description": "Help maintain community garden...",
    "location": "Downtown Community Center",
    "hoursPerWeek": 5,
    "startDate": "2026-02-01",
    "endDate": "2026-12-31",
    "isPublished": true,
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  }
]
```

**Status Codes:**
- `200 OK` - Success

**Usage in Web App:**
```typescript
// Fetch published opportunities for listing page
const response = await fetch(`${API_BASE_URL}/api/opportunities`);
const opportunities = await response.json();
```

---

### Get Opportunity Details

**GET** `/api/opportunities/{id}`

Get details of a specific opportunity.

**Path Parameters:**
- `id` (string, required) - Opportunity ID

**Response:**
```json
{
  "id": "opp-123",
  "organisationId": "org-456",
  "title": "Community Garden Volunteer",
  "description": "Help maintain community garden...",
  "location": "Downtown Community Center",
  "hoursPerWeek": 5,
  "startDate": "2026-02-01",
  "endDate": "2026-12-31",
  "isPublished": true,
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-01-01T00:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Opportunity not found

**Usage in Web App:**
```typescript
// Fetch opportunity details for detail page
const response = await fetch(`${API_BASE_URL}/api/opportunities/${opportunityId}`);
const opportunity = await response.json();
```

---

## Authenticated Endpoints

All endpoints below require JWT authentication via `Authorization: Bearer <token>` header.

---

## Student Endpoints

### Get Current User Profile

**GET** `/api/me`

Get the current authenticated user's profile.

**Authentication:** Required (any authenticated user)

**Response:**
```json
{
  "id": "user-123",
  "email": "student@example.com",
  "name": "John Doe",
  "role": "student"
}
```

**Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - Invalid or missing token

**Usage in Web App:**
```typescript
// Get current user profile
const response = await fetch(`${API_BASE_URL}/api/me`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const user = await response.json();
```

---

### Apply to Opportunity

**POST** `/api/applications`

Submit an application to a volunteer opportunity.

**Authentication:** Required (Student or Admin role)

**Request Body:**
```json
{
  "opportunityId": "opp-123",
  "coverLetter": "I'm interested in this opportunity because...",
  "availability": "Weekends and evenings"
}
```

**Response:**
```json
{
  "id": "app-789",
  "studentUserId": "user-123",
  "opportunityId": "opp-123",
  "status": "pending",
  "coverLetter": "I'm interested in this opportunity because...",
  "availability": "Weekends and evenings",
  "appliedAt": "2026-01-11T20:00:00Z"
}
```

**Status Codes:**
- `201 Created` - Application submitted successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - User doesn't have Student role

**Usage in Web App:**
```typescript
// Submit application
const response = await fetch(`${API_BASE_URL}/api/applications`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    opportunityId: 'opp-123',
    coverLetter: '...',
    availability: '...'
  })
});
const application = await response.json();
```

---

### Log Volunteer Hours

**POST** `/api/hours`

Log volunteer hours worked.

**Authentication:** Required (Student or Admin role)

**Request Body:**
```json
{
  "opportunityId": "opp-123",
  "organisationId": "org-456",
  "date": "2026-01-11",
  "hours": 4,
  "description": "Weeded garden beds, planted vegetables"
}
```

**Response:**
```json
{
  "id": "hours-abc",
  "studentUserId": "user-123",
  "opportunityId": "opp-123",
  "organisationId": "org-456",
  "date": "2026-01-11",
  "hours": 4,
  "description": "Weeded garden beds, planted vegetables",
  "status": "pending",
  "loggedAt": "2026-01-11T20:00:00Z"
}
```

**Status Codes:**
- `201 Created` - Hours logged successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - User doesn't have Student role

**Usage in Web App:**
```typescript
// Log volunteer hours
const response = await fetch(`${API_BASE_URL}/api/hours`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    opportunityId: 'opp-123',
    organisationId: 'org-456',
    date: '2026-01-11',
    hours: 4,
    description: '...'
  })
});
const hoursLog = await response.json();
```

---

## Organisation Endpoints

### Create Opportunity

**POST** `/api/opportunities`

Create a new volunteer opportunity.

**Authentication:** Required (Organisation or Admin role)

**Request Body:**
```json
{
  "title": "Community Garden Volunteer",
  "description": "Help maintain community garden...",
  "location": "Downtown Community Center",
  "hoursPerWeek": 5,
  "startDate": "2026-02-01",
  "endDate": "2026-12-31",
  "isPublished": false
}
```

**Response:**
```json
{
  "id": "opp-123",
  "organisationId": "org-456",
  "title": "Community Garden Volunteer",
  "description": "Help maintain community garden...",
  "location": "Downtown Community Center",
  "hoursPerWeek": 5,
  "startDate": "2026-02-01",
  "endDate": "2026-12-31",
  "isPublished": false,
  "createdAt": "2026-01-11T20:00:00Z",
  "updatedAt": "2026-01-11T20:00:00Z"
}
```

**Status Codes:**
- `201 Created` - Opportunity created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Invalid or missing token, or organisation ID not found in token
- `403 Forbidden` - User doesn't have Organisation role

**Usage in Web App:**
```typescript
// Create opportunity
const response = await fetch(`${API_BASE_URL}/api/opportunities`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Community Garden Volunteer',
    description: '...',
    location: '...',
    hoursPerWeek: 5,
    startDate: '2026-02-01',
    endDate: '2026-12-31',
    isPublished: false
  })
});
const opportunity = await response.json();
```

---

### Update Opportunity

**PATCH** `/api/opportunities/{id}`

Update an existing opportunity.

**Authentication:** Required (Organisation or Admin role)

**Path Parameters:**
- `id` (string, required) - Opportunity ID

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description...",
  "isPublished": true
}
```

**Response:**
```json
{
  "id": "opp-123",
  "organisationId": "org-456",
  "title": "Updated Title",
  "description": "Updated description...",
  "location": "Downtown Community Center",
  "hoursPerWeek": 5,
  "startDate": "2026-02-01",
  "endDate": "2026-12-31",
  "isPublished": true,
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-01-11T20:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Opportunity updated successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - User doesn't have Organisation role
- `404 Not Found` - Opportunity not found

**Usage in Web App:**
```typescript
// Update opportunity
const response = await fetch(`${API_BASE_URL}/api/opportunities/${opportunityId}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Updated Title',
    description: '...',
    isPublished: true
  })
});
const opportunity = await response.json();
```

---

### List Applications for Opportunity

**GET** `/api/applications/opportunities/{opportunityId}`

Get all applications for a specific opportunity.

**Authentication:** Required (Organisation or Admin role)

**Path Parameters:**
- `opportunityId` (string, required) - Opportunity ID

**Response:**
```json
[
  {
    "id": "app-789",
    "studentUserId": "user-123",
    "opportunityId": "opp-123",
    "status": "pending",
    "coverLetter": "I'm interested...",
    "availability": "Weekends",
    "appliedAt": "2026-01-11T20:00:00Z"
  }
]
```

**Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - User doesn't have Organisation role

**Usage in Web App:**
```typescript
// Get applications for opportunity
const response = await fetch(`${API_BASE_URL}/api/applications/opportunities/${opportunityId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const applications = await response.json();
```

---

### Update Application Status

**PATCH** `/api/applications/{id}/status?opportunityId={opportunityId}`

Update the status of an application (accept/reject).

**Authentication:** Required (Organisation or Admin role)

**Path Parameters:**
- `id` (string, required) - Application ID

**Query Parameters:**
- `opportunityId` (string, required) - Opportunity ID (used as partition key)

**Request Body:**
```json
{
  "status": "accepted"
}
```

**Response:**
```json
{
  "id": "app-789",
  "studentUserId": "user-123",
  "opportunityId": "opp-123",
  "status": "accepted",
  "coverLetter": "I'm interested...",
  "availability": "Weekends",
  "appliedAt": "2026-01-11T20:00:00Z",
  "updatedAt": "2026-01-12T10:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Application status updated successfully
- `400 Bad Request` - Invalid request data or missing opportunityId query parameter
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - User doesn't have Organisation role
- `404 Not Found` - Application not found

**Usage in Web App:**
```typescript
// Update application status
const response = await fetch(
  `${API_BASE_URL}/api/applications/${applicationId}/status?opportunityId=${opportunityId}`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      status: 'accepted' // or 'rejected'
    })
  }
);
const application = await response.json();
```

---

### List Hours Logs for Organisation

**GET** `/api/hours/organisations/{organisationId}`

Get all volunteer hours logs for an organisation.

**Authentication:** Required (Organisation or Admin role)

**Path Parameters:**
- `organisationId` (string, required) - Organisation ID

**Response:**
```json
[
  {
    "id": "hours-abc",
    "studentUserId": "user-123",
    "opportunityId": "opp-123",
    "organisationId": "org-456",
    "date": "2026-01-11",
    "hours": 4,
    "description": "Weeded garden beds...",
    "status": "pending",
    "loggedAt": "2026-01-11T20:00:00Z"
  }
]
```

**Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - User doesn't have Organisation role

**Usage in Web App:**
```typescript
// Get hours logs for organisation
const response = await fetch(`${API_BASE_URL}/api/hours/organisations/${organisationId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const hoursLogs = await response.json();
```

---

### Approve Hours Log

**PATCH** `/api/hours/{id}/approve?organisationId={organisationId}`

Approve a volunteer hours log.

**Authentication:** Required (Organisation or Admin role)

**Path Parameters:**
- `id` (string, required) - Hours log ID

**Query Parameters:**
- `organisationId` (string, required) - Organisation ID (used as partition key)

**Response:**
```json
{
  "id": "hours-abc",
  "studentUserId": "user-123",
  "opportunityId": "opp-123",
  "organisationId": "org-456",
  "date": "2026-01-11",
  "hours": 4,
  "description": "Weeded garden beds...",
  "status": "approved",
  "reviewedByUserId": "org-user-456",
  "reviewedAt": "2026-01-12T10:00:00Z",
  "loggedAt": "2026-01-11T20:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Hours log approved successfully
- `400 Bad Request` - Missing organisationId query parameter
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - User doesn't have Organisation role
- `404 Not Found` - Hours log not found

**Usage in Web App:**
```typescript
// Approve hours log
const response = await fetch(
  `${API_BASE_URL}/api/hours/${hoursLogId}/approve?organisationId=${organisationId}`,
  {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);
const hoursLog = await response.json();
```

---

### Reject Hours Log

**PATCH** `/api/hours/{id}/reject?organisationId={organisationId}`

Reject a volunteer hours log.

**Authentication:** Required (Organisation or Admin role)

**Path Parameters:**
- `id` (string, required) - Hours log ID

**Query Parameters:**
- `organisationId` (string, required) - Organisation ID (used as partition key)

**Response:**
```json
{
  "id": "hours-abc",
  "studentUserId": "user-123",
  "opportunityId": "opp-123",
  "organisationId": "org-456",
  "date": "2026-01-11",
  "hours": 4,
  "description": "Weeded garden beds...",
  "status": "rejected",
  "reviewedByUserId": "org-user-456",
  "reviewedAt": "2026-01-12T10:00:00Z",
  "loggedAt": "2026-01-11T20:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Hours log rejected successfully
- `400 Bad Request` - Missing organisationId query parameter
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - User doesn't have Organisation role
- `404 Not Found` - Hours log not found

**Usage in Web App:**
```typescript
// Reject hours log
const response = await fetch(
  `${API_BASE_URL}/api/hours/${hoursLogId}/reject?organisationId=${organisationId}`,
  {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);
const hoursLog = await response.json();
```

---

## Error Responses

All endpoints return standard error responses:

**400 Bad Request:**
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "fieldName": ["Error message"]
  }
}
```

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

**403 Forbidden:**
```json
{
  "error": "Forbidden",
  "message": "User doesn't have required role"
}
```

**404 Not Found:**
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal Server Error",
  "message": "An error occurred while processing your request"
}
```

---

## Authentication

All authenticated endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

The token must contain:
- `sub` or `nameid` - User ID
- `role` - User role: `"student"`, `"organisation"`, or `"admin"`
- `organisationId` - (for organisation users) Organisation ID

Tokens are obtained from Azure AD (or your configured authentication provider).

---

## CORS

The API is configured to accept requests from:
- Development: `http://localhost:3000`, `https://localhost:3000`
- Staging: Your staging web app URL
- Production: Your production web app URL

Configure allowed origins in `Cors:AllowedOrigins` application setting.

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting for production use.

---

## Versioning

API versioning is not currently implemented. All endpoints are under `/api/`. Consider adding versioning (e.g., `/api/v1/`) for future API changes.
