(function() {
  'use strict';

  const LinguaShopGeo = {
    API_URL: 'https://ipapi.co/json/',
    FALLBACK_URL: 'https://ipapi.co/{ip}/json/',
    CACHE_KEY: 'geolocation_cache',
    CACHE_DURATION: 60 * 60 * 1000,

    COUNTRY_TO_LANGUAGE: {
      US: 'en', GB: 'en', AU: 'en', CA: 'en', NZ: 'en', IE: 'en',
      IN: 'en', ZA: 'en', PH: 'en', SG: 'en', MY: 'en',
      MX: 'es', ES: 'es', AR: 'es', CO: 'es', PE: 'es', CL: 'es',
      VE: 'es', EC: 'es', GT: 'es', CU: 'es', DO: 'es',
      FR: 'fr', BE: 'fr', CH: 'fr', MC: 'fr', LU: 'fr',
      DE: 'de', AT: 'de', LI: 'de',
      IT: 'it', SM: 'it', VA: 'it',
      PT: 'pt', BR: 'pt-br', AO: 'pt', MZ: 'pt', GW: 'pt', CV: 'pt',
      NL: 'nl', BE_NL: 'nl',
      RU: 'ru', BY: 'ru', KZ: 'ru',
      UA: 'uk',
      JP: 'ja',
      TW: 'zh-tw', HK: 'zh-tw',
      CN: 'zh',
      KR: 'ko',
      SA: 'ar', AE: 'ar', EG: 'ar', MA: 'ar', DZ: 'ar',
      IQ: 'ar', JO: 'ar', KW: 'ar', QA: 'ar', BH: 'ar',
      OM: 'ar', LY: 'ar', TN: 'ar', YE: 'ar', SD: 'ar',
      LB: 'ar', SY: 'ar',
      TR: 'tr', AZ: 'tr',
      TH: 'th',
      VN: 'vi',
      ID: 'id',
      BN: 'ms', MM: 'ms',
      PL: 'pl',
      CZ: 'cs',
      SK: 'sk',
      SE: 'sv',
      NO: 'no',
      DK: 'da',
      FI: 'fi',
      IS: 'is',
      GR: 'el', CY: 'el',
      IL: 'he',
      RO: 'ro', MD: 'ro',
      HU: 'hu',
      HR: 'hr',
      RS: 'sr', BA: 'sr', ME: 'sr',
      MK: 'sr',
      BG: 'bg',
      AL: 'sq', XK: 'sq',
      SI: 'sl',
      LT: 'lt',
      LV: 'lv',
      EE: 'et',
      GE: 'ka',
      AM: 'hy',
      PK: 'ur',
      IR: 'fa',
      AF: 'fa',
      BD: 'bn',
      LK: 'si',
      NP: 'ne',
      KH: 'km',
      LA: 'lo',
      MM: 'my',
    },

    async getLocation(ip) {
      const cached = this.getCachedLocation();
      if (cached) {
        return cached;
      }

      try {
        let url = this.API_URL;
        
        if (ip && ip !== '127.0.0.1' && ip !== 'localhost' && ip !== '::1' && ip !== '[::1]') {
          url = this.FALLBACK_URL.replace('{ip}', ip);
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Geolocation API error: ' + response.status);
        }

        const data = await response.json();

        const location = {
          country: data.country_code || data.country_code_iso3,
          countryName: data.country_name,
          city: data.city,
          region: data.region,
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.timezone,
          currency: data.currency,
          language: data.languages?.split(',')[0],
          ip: data.ip,
          detected: true
        };

        this.cacheLocation(location);

        return location;
      } catch (error) {
        console.warn('LinguaShop: Geolocation failed', error);
        return {
          success: false,
          error: error.message,
          detected: false
        };
      }
    },

    async detectLanguage(ip, enabledLanguages) {
      const location = await this.getLocation(ip);

      if (!location.detected) {
        return {
          detected: false,
          language: null,
          reason: 'geolocation_failed'
        };
      }

      const countryCode = location.country;
      let detectedLang = this.COUNTRY_TO_LANGUAGE[countryCode];

      if (!detectedLang && location.language) {
        const langCode = location.language.split('-')[0].toLowerCase();
        detectedLang = langCode;
      }

      if (!detectedLang) {
        detectedLang = 'en';
      }

      if (enabledLanguages && enabledLanguages.length > 0) {
        const isEnabled = enabledLanguages.some(l => l.code === detectedLang);
        
        if (!isEnabled) {
          const defaultLang = enabledLanguages.find(l => l.isDefault);
          if (defaultLang) {
            return {
              detected: true,
              language: defaultLang.code,
              originalLanguage: detectedLang,
              reason: 'language_not_enabled',
              availableLanguages: enabledLanguages.map(l => l.code)
            };
          }
          return {
            detected: true,
            language: enabledLanguages[0].code,
            originalLanguage: detectedLang,
            reason: 'language_not_enabled',
            availableLanguages: enabledLanguages.map(l => l.code)
          };
        }
      }

      return {
        detected: true,
        language: detectedLang,
        country: countryCode,
        countryName: location.countryName,
        reason: 'geolocation'
      };
    },

    cacheLocation(location) {
      try {
        const cacheData = {
          location,
          timestamp: Date.now()
        };
        if (window.LinguaShopStorage) {
          window.LinguaShopStorage.setItem(this.CACHE_KEY, cacheData);
        }
      } catch (e) {
        console.warn('LinguaShop: Failed to cache location', e);
      }
    },

    getCachedLocation() {
      try {
        if (window.LinguaShopStorage) {
          const cached = window.LinguaShopStorage.getItem(this.CACHE_KEY);
          if (cached && cached.location) {
            const age = Date.now() - cached.timestamp;
            if (age < this.CACHE_DURATION) {
              return cached.location;
            }
          }
        }
      } catch (e) {
        console.warn('LinguaShop: Failed to get cached location', e);
      }
      return null;
    },

    clearCache() {
      try {
        if (window.LinguaShopStorage) {
          window.LinguaShopStorage.removeItem(this.CACHE_KEY);
        }
      } catch (e) {
        console.warn('LinguaShop: Failed to clear location cache', e);
      }
    },

    isRTLLanguage(code) {
      const rtlLanguages = ['ar', 'he', 'fa', 'ur', 'yi', 'ps', 'sd', 'ug'];
      return rtlLanguages.includes(code);
    },

    getLanguageDirection(code) {
      return this.isRTLLanguage(code) ? 'rtl' : 'ltr';
    },

    async init(shop, apiUrl) {
      this.shop = shop;
      this.apiUrl = apiUrl || window.LINGUASHOP_API_URL || '';
    }
  };

  if (typeof window !== 'undefined') {
    window.LinguaShopGeo = LinguaShopGeo;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LinguaShopGeo;
  }
})();
