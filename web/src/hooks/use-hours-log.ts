/**
 * React hook for managing hours logs
 */

import { useState } from 'react';
import {
  hoursLogsApi,
  CreateHoursLogDto,
  HoursLog,
  ApiResponse,
} from '../lib/api-client';

export interface UseHoursLogResult {
  logHours: (dto: CreateHoursLogDto) => Promise<ApiResponse<HoursLog>>;
  approveHours: (id: string, organisationId: string) => Promise<ApiResponse<HoursLog>>;
  rejectHours: (id: string, organisationId: string) => Promise<ApiResponse<HoursLog>>;
  loading: boolean;
  error: string | null;
}

export function useHoursLog(): UseHoursLogResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logHours = async (dto: CreateHoursLogDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await hoursLogsApi.create(dto);
      if (response.error) {
        setError(response.error);
      }
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to log hours';
      setError(errorMessage);
      return {
        error: errorMessage,
        status: 0,
      };
    } finally {
      setLoading(false);
    }
  };

  const approveHours = async (id: string, organisationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await hoursLogsApi.approve(id, organisationId);
      if (response.error) {
        setError(response.error);
      }
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to approve hours';
      setError(errorMessage);
      return {
        error: errorMessage,
        status: 0,
      };
    } finally {
      setLoading(false);
    }
  };

  const rejectHours = async (id: string, organisationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await hoursLogsApi.reject(id, organisationId);
      if (response.error) {
        setError(response.error);
      }
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reject hours';
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
    logHours,
    approveHours,
    rejectHours,
    loading,
    error,
  };
}
