/**
 * React hook for fetching a single opportunity
 */

import { useState, useEffect } from 'react';
import { opportunitiesApi, Opportunity, ApiResponse } from '../lib/api-client';

export interface UseOpportunityResult {
  opportunity: Opportunity | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useOpportunity(id: string | null): UseOpportunityResult {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunity = async () => {
    if (!id) {
      setOpportunity(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response: ApiResponse<Opportunity> = await opportunitiesApi.getById(id);
      
      if (response.error) {
        setError(response.error);
        setOpportunity(null);
      } else if (response.data) {
        setOpportunity(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch opportunity');
      setOpportunity(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return {
    opportunity,
    loading,
    error,
    refetch: fetchOpportunity,
  };
}
