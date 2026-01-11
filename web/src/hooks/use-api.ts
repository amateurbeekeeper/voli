/**
 * React hook for API client usage
 * 
 * This hook provides a configured API client instance
 * with authentication token injection
 */

import { useMemo } from 'react';
import { getApiBaseUrl } from '../lib/api';

// TODO: Import generated API client types when available
// import { OpportunitiesApi, ApplicationsApi, HoursApi } from '@voli/api-client';
// import { getAuthToken } from '../lib/api';

export const useApi = () => {
  const baseURL = useMemo(() => getApiBaseUrl(), []);

  // TODO: Initialize API clients when generated
  // const opportunitiesApi = useMemo(() => {
  //   return new OpportunitiesApi({
  //     baseURL,
  //     accessToken: async () => await getAuthToken() || undefined,
  //   });
  // }, [baseURL]);

  // const applicationsApi = useMemo(() => {
  //   return new ApplicationsApi({
  //     baseURL,
  //     accessToken: async () => await getAuthToken() || undefined,
  //   });
  // }, [baseURL]);

  // const hoursApi = useMemo(() => {
  //   return new HoursApi({
  //     baseURL,
  //     accessToken: async () => await getAuthToken() || undefined,
  //   });
  // }, [baseURL]);

  return {
    baseURL,
    // opportunitiesApi,
    // applicationsApi,
    // hoursApi,
  };
};
