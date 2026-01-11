/**
 * React hook for API client usage
 * 
 * This hook provides a configured API client instance
 * with authentication token injection
 * 
 * @deprecated Use specific hooks instead:
 * - useOpportunities() for opportunities
 * - useApplication() for applications
 * - useHoursLog() for hours logging
 * - useUser() for user profile
 */

import { useMemo } from 'react';
import { getApiBaseUrl } from '../lib/api';
import {
  opportunitiesApi,
  applicationsApi,
  hoursLogsApi,
  userApi,
  healthApi,
} from '../lib/api-client';

export const useApi = () => {
  const baseURL = useMemo(() => getApiBaseUrl(), []);

  return {
    baseURL,
    opportunitiesApi,
    applicationsApi,
    hoursLogsApi,
    userApi,
    healthApi,
  };
};
