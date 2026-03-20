import { useState, useCallback } from 'react';
import { translateApi } from '../utils/api';

export const useTranslation = () => {
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState(null);

  const translate = useCallback(async (text, targetLang, shop) => {
    setTranslating(true);
    setError(null);
    
    try {
      const response = await translateApi.translate({
        text,
        targetLang,
        shop,
      });
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setTranslating(false);
    }
  }, []);

  const translateBulk = useCallback(async (texts, targetLang, shop) => {
    setTranslating(true);
    setError(null);
    
    try {
      const response = await translateApi.translateBulk({
        texts,
        targetLang,
        shop,
      });
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setTranslating(false);
    }
  }, []);

  const detectLanguage = useCallback(async (text) => {
    setTranslating(true);
    setError(null);
    
    try {
      const response = await translateApi.detect({ text });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setTranslating(false);
    }
  }, []);

  const getHistory = useCallback(async (shop, params = {}) => {
    setTranslating(true);
    setError(null);
    
    try {
      const response = await translateApi.getHistory(shop, params);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setTranslating(false);
    }
  }, []);

  const clearCache = useCallback(async (shop) => {
    setTranslating(true);
    setError(null);
    
    try {
      const response = await translateApi.clearCache(shop);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setTranslating(false);
    }
  }, []);

  return {
    translate,
    translateBulk,
    detectLanguage,
    getHistory,
    clearCache,
    translating,
    error,
    clearError: () => setError(null),
  };
};

export default useTranslation;
