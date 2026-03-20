(function() {
  'use strict';

  const LinguaShopStorage = {
    COOKIE_NAME: 'linguashop_lang',
    COOKIE_EXPIRY_DAYS: 30,
    STORAGE_KEY: 'linguashop_config',

    setCookie(name, value, days) {
      let expires = '';
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
      }
      const cookieValue = encodeURIComponent(JSON.stringify(value));
      document.cookie = name + '=' + cookieValue + expires + '; path=/; SameSite=Lax';
      if (window.location.protocol === 'https:') {
        document.cookie = name + '=' + cookieValue + expires + '; path=/; SameSite=Lax; Secure';
      }
    },

    getCookie(name) {
      const nameEQ = name + '=';
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
          try {
            return JSON.parse(decodeURIComponent(c.substring(nameEQ.length)));
          } catch (e) {
            return null;
          }
        }
      }
      return null;
    },

    deleteCookie(name) {
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    },

    setItem(key, value) {
      try {
        localStorage.setItem(this.STORAGE_KEY + '_' + key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.warn('LinguaShop: LocalStorage not available', e);
        this.setCookie(this.STORAGE_KEY + '_' + key, value, 30);
        return false;
      }
    },

    getItem(key) {
      try {
        const value = localStorage.getItem(this.STORAGE_KEY + '_' + key);
        if (value === null) {
          const cookieValue = this.getCookie(this.STORAGE_KEY + '_' + key);
          return cookieValue;
        }
        return JSON.parse(value);
      } catch (e) {
        const cookieValue = this.getCookie(this.STORAGE_KEY + '_' + key);
        return cookieValue;
      }
    },

    removeItem(key) {
      try {
        localStorage.removeItem(this.STORAGE_KEY + '_' + key);
      } catch (e) {
        this.deleteCookie(this.STORAGE_KEY + '_' + key);
      }
    },

    setLanguage(code, languageData) {
      const data = {
        code,
        name: languageData?.name || code,
        nativeName: languageData?.nativeName || code,
        flag: languageData?.flag || '',
        rtl: languageData?.rtl || false,
        timestamp: Date.now()
      };
      this.setCookie(this.COOKIE_NAME, data, this.COOKIE_EXPIRY_DAYS);
      this.setItem('current_language', data);
      this.setItem('original_language', this.getItem('original_language') || data);
    },

    getLanguage() {
      const cookie = this.getCookie(this.COOKIE_NAME);
      if (cookie) return cookie;
      return this.getItem('current_language');
    },

    getOriginalLanguage() {
      return this.getItem('original_language');
    },

    clearLanguage() {
      this.deleteCookie(this.COOKIE_NAME);
      this.removeItem('current_language');
    },

    setConfig(config) {
      this.setItem('widget_config', config);
    },

    getConfig() {
      return this.getItem('widget_config') || {
        position: 'bottom-right',
        color: '#008060',
        textColor: '#ffffff',
        theme: 'light',
        size: 'medium',
        showFlags: true,
        showNativeNames: true,
        autoDetect: true
      };
    },

    setLanguages(languages) {
      this.setItem('languages', languages);
    },

    getLanguages() {
      return this.getItem('languages') || [];
    },

    setEnabledLanguages(codes) {
      this.setItem('enabled_languages', codes);
    },

    getEnabledLanguages() {
      return this.getItem('enabled_languages') || [];
    },

    setTranslationCache(translations) {
      this.setItem('translation_cache', translations);
    },

    getTranslationCache() {
      return this.getItem('translation_cache') || {};
    },

    addToTranslationCache(key, value) {
      const cache = this.getTranslationCache();
      cache[key] = {
        value,
        timestamp: Date.now()
      };
      const maxCacheSize = 500;
      const keys = Object.keys(cache);
      if (keys.length > maxCacheSize) {
        const sortedKeys = keys.sort((a, b) => cache[a].timestamp - cache[b].timestamp);
        const keysToRemove = sortedKeys.slice(0, keys.length - maxCacheSize);
        keysToRemove.forEach(k => delete cache[k]);
      }
      this.setTranslationCache(cache);
    },

    getCachedTranslation(key) {
      const cache = this.getTranslationCache();
      return cache[key]?.value || null;
    },

    clearTranslationCache() {
      this.removeItem('translation_cache');
    },

    setSessionData(key, value) {
      try {
        sessionStorage.setItem(this.STORAGE_KEY + '_' + key, JSON.stringify(value));
      } catch (e) {
        console.warn('LinguaShop: SessionStorage not available', e);
      }
    },

    getSessionData(key) {
      try {
        const value = sessionStorage.getItem(this.STORAGE_KEY + '_' + key);
        return value ? JSON.parse(value) : null;
      } catch (e) {
        return null;
      }
    },

    clearAll() {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.STORAGE_KEY)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      this.clearTranslationCache();
      this.clearLanguage();
    }
  };

  if (typeof window !== 'undefined') {
    window.LinguaShopStorage = LinguaShopStorage;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LinguaShopStorage;
  }
})();
