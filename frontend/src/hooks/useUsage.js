import { useState, useCallback, useEffect } from 'react';
import { usageApi } from '../utils/api';

export const useUsage = (shop) => {
  const [usage, setUsage] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsage = useCallback(async () => {
    if (!shop) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await usageApi.get(shop);
      setUsage(response.data.usage);
      return response.data.usage;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [shop]);

  const fetchHistory = useCallback(async (limit = 12) => {
    if (!shop) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await usageApi.getHistory(shop, limit);
      setHistory(response.data.history);
      return response.data.history;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [shop]);

  const fetchStats = useCallback(async () => {
    if (!shop) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await usageApi.getStats(shop);
      setStats(response.data.stats);
      return response.data.stats;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [shop]);

  const resetUsage = useCallback(async () => {
    if (!shop) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await usageApi.reset(shop, true);
      await fetchUsage();
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [shop, fetchUsage]);

  useEffect(() => {
    if (shop) {
      fetchUsage();
    }
  }, [shop, fetchUsage]);

  return {
    usage,
    history,
    stats,
    loading,
    error,
    fetchUsage,
    fetchHistory,
    fetchStats,
    resetUsage,
    clearError: () => setError(null),
  };
};

export default useUsage;
