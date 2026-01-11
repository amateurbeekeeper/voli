/**
 * React hook for managing applications
 */

import { useState } from 'react';
import {
  applicationsApi,
  CreateApplicationDto,
  UpdateApplicationStatusDto,
  Application,
  ApiResponse,
} from '../lib/api-client';

export interface UseApplicationResult {
  submitApplication: (dto: CreateApplicationDto) => Promise<ApiResponse<Application>>;
  updateStatus: (
    id: string,
    dto: UpdateApplicationStatusDto
  ) => Promise<ApiResponse<Application>>;
  loading: boolean;
  error: string | null;
}

export function useApplication(): UseApplicationResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitApplication = async (dto: CreateApplicationDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await applicationsApi.create(dto);
      if (response.error) {
        setError(response.error);
      }
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit application';
      setError(errorMessage);
      return {
        error: errorMessage,
        status: 0,
      };
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, dto: UpdateApplicationStatusDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await applicationsApi.updateStatus(id, dto);
      if (response.error) {
        setError(response.error);
      }
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update application status';
      setError(errorMessage);
      return {
        error: errorMessage,
        status: 0,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    submitApplication,
    updateStatus,
    loading,
    error,
  };
}
