/**
 * React hook for fetching opportunities
 */

import { useState, useEffect } from 'react';
import { opportunitiesApi, Opportunity, ApiResponse } from '../lib/api-client';

export interface UseOpportunitiesResult {
  opportunities: Opportunity[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useOpportunities(): UseOpportunitiesResult {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: ApiResponse<Opportunity[]> = await opportunitiesApi.getPublished();
      
      if (response.error) {
        setError(response.error);
        setOpportunities([]);
      } else if (response.data) {
        setOpportunities(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch opportunities');
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  return {
    opportunities,
    loading,
    error,
    refetch: fetchOpportunities,
  };
}
