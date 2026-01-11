/**
 * API Client Configuration
 * 
 * This file provides utilities for API client initialization and configuration.
 * The actual API client is generated from OpenAPI spec in @voli/api-client
 */

// API Base URL from environment variable
export const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    // Server-side: use environment variable or default
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  }
  // Client-side: use environment variable or default
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
};

/**
 * Get authentication token
 * This should be implemented based on your auth provider
 */
export const getAuthToken = async (): Promise<string | null> => {
  // TODO: Implement based on auth provider
  // Example for NextAuth:
  // const session = await getSession();
  // return session?.accessToken || null;
  
  // Example for Clerk:
  // return await clerk.getToken();
  
  return null;
};

/**
 * Create API client configuration
 */
export const createApiConfig = async () => {
  const baseURL = getApiBaseUrl();
  const token = await getAuthToken();
  
  return {
    baseURL,
    accessToken: token || undefined,
  };
};
