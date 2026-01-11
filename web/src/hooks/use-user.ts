/**
 * React hook for fetching current user profile
 */

import { useState, useEffect } from 'react';
import { userApi, UserProfile, ApiResponse } from '../lib/api-client';

export interface UseUserResult {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUser(): UseUserResult {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: ApiResponse<UserProfile> = await userApi.getMe();
      
      if (response.error) {
        setError(response.error);
        setUser(null);
      } else if (response.data) {
        setUser(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user profile');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
}
