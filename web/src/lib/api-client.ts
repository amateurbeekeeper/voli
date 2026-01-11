/**
 * API Client - Direct fetch implementation
 * 
 * This provides type-safe API calls using fetch.
 * Once the TypeScript client is generated from OpenAPI spec,
 * we can migrate to using the generated client.
 */

import { getApiBaseUrl, getAuthToken } from './api';

const API_BASE_URL = getApiBaseUrl();

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Create headers with authentication
 */
async function createHeaders(): Promise<HeadersInit> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = await getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Generic API request handler
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const headers = await createHeaders();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    const data = response.ok ? await response.json() : null;

    if (!response.ok) {
      return {
        error: data?.message || `API request failed: ${response.statusText}`,
        status: response.status,
      };
    }

    return {
      data: data as T,
      status: response.status,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
}

// ============================================================================
// Opportunities API
// ============================================================================

export interface Opportunity {
  id: string;
  organisationId: string;
  title: string;
  description: string;
  location: string;
  skills: string[];
  causeAreas: string[];
  timeCommitment: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOpportunityDto {
  title: string;
  description: string;
  location: string;
  skills?: string[];
  causeAreas?: string[];
  timeCommitment: string;
}

export interface UpdateOpportunityDto {
  title?: string;
  description?: string;
  location?: string;
  skills?: string[];
  causeAreas?: string[];
  timeCommitment?: string;
  status?: string;
}

export const opportunitiesApi = {
  /**
   * Get all published opportunities
   */
  getPublished: async (): Promise<ApiResponse<Opportunity[]>> => {
    return apiRequest<Opportunity[]>('/api/opportunities');
  },

  /**
   * Get opportunity by ID
   */
  getById: async (id: string): Promise<ApiResponse<Opportunity>> => {
    return apiRequest<Opportunity>(`/api/opportunities/${id}`);
  },

  /**
   * Create new opportunity (requires Organisation role)
   */
  create: async (dto: CreateOpportunityDto): Promise<ApiResponse<Opportunity>> => {
    return apiRequest<Opportunity>('/api/opportunities', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  /**
   * Update opportunity (requires Organisation role)
   */
  update: async (
    id: string,
    dto: UpdateOpportunityDto
  ): Promise<ApiResponse<Opportunity>> => {
    return apiRequest<Opportunity>(`/api/opportunities/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
  },
};

// ============================================================================
// Applications API
// ============================================================================

export interface Application {
  id: string;
  studentUserId: string;
  opportunityId: string;
  status: string;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationDto {
  opportunityId: string;
  message?: string;
}

export interface UpdateApplicationStatusDto {
  status: 'submitted' | 'accepted' | 'rejected';
}

export const applicationsApi = {
  /**
   * Create application (requires Student role)
   */
  create: async (dto: CreateApplicationDto): Promise<ApiResponse<Application>> => {
    return apiRequest<Application>('/api/applications', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  /**
   * Get applications by opportunity ID (requires Organisation role)
   */
  getByOpportunityId: async (
    opportunityId: string
  ): Promise<ApiResponse<Application[]>> => {
    return apiRequest<Application[]>(
      `/api/applications/opportunities/${opportunityId}`
    );
  },

  /**
   * Update application status (requires Organisation role)
   */
  updateStatus: async (
    id: string,
    dto: UpdateApplicationStatusDto
  ): Promise<ApiResponse<Application>> => {
    return apiRequest<Application>(`/api/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
  },
};

// ============================================================================
// Hours Logs API
// ============================================================================

export interface HoursLog {
  id: string;
  studentUserId: string;
  opportunityId: string;
  organisationId: string;
  date: string;
  minutes: number;
  status: string;
  reviewedAt?: string;
  reviewedByUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHoursLogDto {
  opportunityId: string;
  organisationId: string;
  date: string;
  minutes: number;
}

export const hoursLogsApi = {
  /**
   * Create hours log (requires Student role)
   */
  create: async (dto: CreateHoursLogDto): Promise<ApiResponse<HoursLog>> => {
    return apiRequest<HoursLog>('/api/hours', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  /**
   * Get hours log by ID
   */
  getById: async (id: string): Promise<ApiResponse<HoursLog>> => {
    return apiRequest<HoursLog>(`/api/hours/${id}`);
  },

  /**
   * Get hours logs by organisation (requires Organisation role)
   */
  getByOrganisation: async (
    organisationId: string
  ): Promise<ApiResponse<HoursLog[]>> => {
    return apiRequest<HoursLog[]>(
      `/api/hours/organisations/${organisationId}`
    );
  },

  /**
   * Approve hours log (requires Organisation role)
   */
  approve: async (
    id: string,
    organisationId: string
  ): Promise<ApiResponse<HoursLog>> => {
    return apiRequest<HoursLog>(
      `/api/hours/${id}/approve?organisationId=${organisationId}`,
      {
        method: 'PATCH',
      }
    );
  },

  /**
   * Reject hours log (requires Organisation role)
   */
  reject: async (
    id: string,
    organisationId: string
  ): Promise<ApiResponse<HoursLog>> => {
    return apiRequest<HoursLog>(
      `/api/hours/${id}/reject?organisationId=${organisationId}`,
      {
        method: 'PATCH',
      }
    );
  },
};

// ============================================================================
// User API
// ============================================================================

export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  role?: string;
}

export const userApi = {
  /**
   * Get current user profile (requires authentication)
   */
  getMe: async (): Promise<ApiResponse<UserProfile>> => {
    return apiRequest<UserProfile>('/api/me');
  },
};

// ============================================================================
// Health API
// ============================================================================

export interface HealthStatus {
  status: string;
  timestamp: string;
}

export const healthApi = {
  /**
   * Check API health
   */
  check: async (): Promise<ApiResponse<HealthStatus>> => {
    return apiRequest<HealthStatus>('/api/health');
  },
};
