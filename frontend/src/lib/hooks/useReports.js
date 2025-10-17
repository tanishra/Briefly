import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';

export const useReports = (autoRefresh = false, interval = 30000) => {
  const [latestReport, setLatestReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLatestReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getLatestReport();
      if (data.ok) {
        setLatestReport(data.report);
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch latest report:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestReport();
    
    if (autoRefresh) {
      const intervalId = setInterval(fetchLatestReport, interval);
      return () => clearInterval(intervalId);
    }
  }, [fetchLatestReport, autoRefresh, interval]);

  return { latestReport, loading, error, refetch: fetchLatestReport };
};