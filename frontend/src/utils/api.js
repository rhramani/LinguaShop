import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const createApiClient = () => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('linguashop_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('linguashop_token');
        window.location.href = '/auth';
      }
      return Promise.reject(error);
    }
  );

  return client;
};

const api = createApiClient();

export const authApi = {
  verify: () => api.get('/auth/verify'),
  logout: () => api.post('/auth/logout'),
};

export const translateApi = {
  translate: (data) => api.post('/api/translate', data),
  translateBulk: (data) => api.post('/api/translate/bulk', data),
  detect: (data) => api.post('/api/translate/detect', data),
  getLanguages: () => api.get('/api/translate/languages'),
  getHistory: (shop, params) => api.get(`/api/translate/history/${shop}`, { params }),
  clearCache: (shop) => api.delete(`/api/translate/cache/${shop}`),
  detectVisitor: (ip) => api.post('/api/translate/detect-visitor', { ip }),
  getOverrides: (code) => api.get(`/api/translate/overrides/${code}`),
  addOverride: (data) => api.post('/api/translate/manual-override', data),
  removeOverride: (code, originalText) => api.delete(`/api/translate/override/${code}`, { data: { originalText } }),
};

export const settingsApi = {
  get: (shop) => api.get(`/api/settings/${shop}`),
  update: (shop, data) => api.put(`/api/settings/${shop}`, data),
  getLanguages: (shop, enabledOnly) => api.get(`/api/settings/${shop}/languages`, { params: { enabledOnly } }),
  updateLanguage: (shop, data) => api.put(`/api/settings/${shop}/languages`, data),
  bulkUpdateLanguages: (shop, data) => api.post(`/api/settings/${shop}/languages/bulk`, data),
  initializeLanguages: (shop) => api.post(`/api/settings/${shop}/initialize`),
  getWidgetConfig: (shop) => api.get(`/api/settings/${shop}/widget-config`),
  updateWidgetConfig: (shop, config) => api.put(`/api/settings/${shop}/widget-config`, config),
};

export const usageApi = {
  get: (shop) => api.get(`/api/usage/${shop}`),
  getHistory: (shop, limit) => api.get(`/api/usage/${shop}/history`, { params: { limit } }),
  reset: (shop, confirm) => api.post(`/api/usage/${shop}/reset`, { confirm }),
  getStats: (shop) => api.get(`/api/usage/${shop}/stats`),
};

export const widgetApi = {
  install: (shop) => api.post(`/api/widget/install/${shop}`),
  remove: (shop) => api.delete(`/api/widget/remove/${shop}`),
  getStatus: (shop) => api.get(`/api/widget/status/${shop}`),
  updateConfig: (shop, config) => api.put(`/api/widget/config/${shop}`, config),
  updateUrl: (shop) => api.post(`/api/widget/update-url/${shop}`),
  list: (shop) => api.get(`/api/widget/list/${shop}`),
};

export const billingApi = {
  getPlans: () => api.get('/api/billing/plans'),
  getStatus: (shop) => api.get(`/api/billing/status/${shop}`),
  subscribe: (shop, planId) => api.post('/api/billing/subscribe', { shop, planId }),
  cancel: (shop) => api.post(`/api/billing/cancel/${shop}`),
  change: (shop, newPlanId) => api.post(`/api/billing/change/${shop}`, { newPlanId }),
};

export default api;
