import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export function useAPI<T>(endpoint: string, options?: FetchOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const url = `${API_BASE_URL}${endpoint}`;
      const config: RequestInit = {
        method: options?.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      };

      if (options?.body) {
        config.body = JSON.stringify(options.body);
      }

      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error(`❌ Erreur API ${endpoint}:`, err);
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// Hooks spécifiques pour chaque endpoint
export function useGPUData() {
  return useAPI<any>('/api/gpu');
}

export function useSystemData() {
  return useAPI<any>('/api/system');
}

export function useCognitiveData() {
  return useAPI<any>('/api/cognitive');
}

export function useEnsemblesData() {
  return useAPI<any>('/api/ensembles');
}

export function useMorphologyData() {
  return useAPI<any>('/api/morphology');
}

export function useDNRTData() {
  return useAPI<any>('/api/dnrt');
}

export function useNeuronsData() {
  return useAPI<any>('/api/neurons');
}
