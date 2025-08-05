import { useState, useEffect, useCallback } from 'react';
import { dataService } from '../services/dataService';

interface UseDataFetchingOptions {
  autoFetch?: boolean;
  cacheKey?: string;
}

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useDataFetching = <T>(
  fetchFunction: () => Promise<T>,
  options: UseDataFetchingOptions = {}
) => {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const { autoFetch = true } = options;

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await fetchFunction();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  }, [fetchFunction]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]); // Include fetchData but it's memoized with useCallback

  return {
    ...state,
    refetch: fetchData,
    setData: (data: T) => setState(prev => ({ ...prev, data }))
  };
};

// Specific hooks for common data fetching patterns
export const useSocieties = () => {
  const fetchSocieties = useCallback(() => dataService.getSocieties(), []);
  return useDataFetching(fetchSocieties);
};

export const useAdminStats = () => {
  const fetchStats = useCallback(() => dataService.getAdminStats(), []);
  return useDataFetching(fetchStats);
};

export const useAdminById = (id: number | null) => {
  const fetchAdmin = useCallback(() => dataService.getAdminById(id!), [id]);
  return useDataFetching(fetchAdmin, { autoFetch: !!id });
}; 