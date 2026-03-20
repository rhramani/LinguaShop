import { useState, useCallback, useEffect } from 'react';
import { settingsApi } from '../utils/api';

export const useSettings = (shop) => {
  const [settings, setSettings] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    if (!shop) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await settingsApi.get(shop);
      setSettings(response.data.settings);
      return response.data.settings;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [shop]);

  const updateSettings = useCallback(async (updates) => {
    if (!shop) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await settingsApi.update(shop, updates);
      setSettings(response.data.settings);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [shop]);

  const fetchLanguages = useCallback(async (enabledOnly = false) => {
    if (!shop) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await settingsApi.getLanguages(shop, enabledOnly);
      setLanguages(response.data.languages);
      return response.data.languages;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [shop]);

  const toggleLanguage = useCallback(async (code, enabled) => {
    if (!shop) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await settingsApi.updateLanguage(shop, { code, enabled });
      await fetchLanguages();
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [shop, fetchLanguages]);

  const setDefaultLanguage = useCallback(async (code) => {
    if (!shop) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await settingsApi.updateLanguage(shop, { code, isDefault: true });
      await fetchLanguages();
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [shop, fetchLanguages]);

  const bulkToggleLanguages = useCallback(async (codes, enabled) => {
    if (!shop) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await settingsApi.bulkUpdateLanguages(shop, { codes, enabled });
      await fetchLanguages();
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [shop, fetchLanguages]);

  const initializeLanguages = useCallback(async () => {
    if (!shop) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await settingsApi.initializeLanguages(shop);
      await fetchLanguages();
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [shop, fetchLanguages]);

  const getWidgetConfig = useCallback(async () => {
    if (!shop) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await settingsApi.getWidgetConfig(shop);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [shop]);

  const updateWidgetConfig = useCallback(async (config) => {
    if (!shop) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await settingsApi.updateWidgetConfig(shop, config);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [shop]);

  useEffect(() => {
    if (shop) {
      fetchSettings();
      fetchLanguages();
    }
  }, [shop, fetchSettings, fetchLanguages]);

  return {
    settings,
    languages,
    loading,
    error,
    fetchSettings,
    updateSettings,
    fetchLanguages,
    toggleLanguage,
    setDefaultLanguage,
    bulkToggleLanguages,
    initializeLanguages,
    getWidgetConfig,
    updateWidgetConfig,
    clearError: () => setError(null),
  };
};

export default useSettings;
