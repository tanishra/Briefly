import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';

export const useCharts = (autoRefresh = false, interval = 30000) => {
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCharts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getVisualizations();
      if (data.ok) {
        setCharts(data.charts || []);
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch charts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCharts();
    
    if (autoRefresh) {
      const intervalId = setInterval(fetchCharts, interval);
      return () => clearInterval(intervalId);
    }
  }, [fetchCharts, autoRefresh, interval]);

  return { charts, loading, error, refetch: fetchCharts };
};


