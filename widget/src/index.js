(function() {
  'use strict';

  const LinguaShop = {
    version: '1.0.0',
    shop: null,
    config: {},
    languages: [],
    currentLang: null,
    originalLang: null,
    isInitialized: false,
    isTranslating: false,

    async init() {
      if (this.isInitialized) return;

      try {
        this.shop = this.getShopFromDomain();
        if (!this.shop) {
          console.warn('LinguaShop: Could not determine shop domain');
          return;
        }

        const config = this.loadConfig();
        this.config = { ...this.getDefaultConfig(), ...config };

        await this.loadLanguages();
        
        this.detectInitialLanguage();
        
        this.setupUI();
        
        this.setupTranslator();
        
        if (this.currentLang && this.currentLang !== this.originalLang) {
          this.applyLanguage(this.currentLang);
        }

        this.isInitialized = true;

        this.log('LinguaShop initialized', {
          shop: this.shop,
          currentLang: this.currentLang,
          originalLang: this.originalLang,
          languagesCount: this.languages.length
        });

      } catch (error) {
        console.error('LinguaShop: Initialization failed', error);
      }
    },

    getShopFromDomain() {
      const hostname = window.location.hostname;
      const match = hostname.match(/^([a-zA-Z0-9][a-zA-Z0-9\-]*)\.myshopify\.com$/);
      if (match) {
        return match[1] + '.myshopify.com';
      }
      return hostname;
    },

    getDefaultConfig() {
      return {
        position: 'bottom-right',
        color: '#008060',
        textColor: '#ffffff',
        theme: 'light',
        size: 'medium',
        showFlags: true,
        showNativeNames: true,
        autoDetect: true,
        enableCache: true,
        apiEndpoint: ''
      };
    },

    loadConfig() {
      if (window.LinguaShopStorage) {
        return window.LinguaShopStorage.getConfig();
      }
      return {};
    },

    saveConfig(config) {
      if (window.LinguaShopStorage) {
        window.LinguaShopStorage.setConfig(config);
      }
      this.config = { ...this.config, ...config };
    },

    async loadLanguages() {
      if (window.LinguaShopStorage) {
        let languages = window.LinguaShopStorage.getLanguages();
        
        if (!languages || languages.length === 0) {
          await this.fetchLanguages();
        } else {
          this.languages = languages;
        }
      } else {
        await this.fetchLanguages();
      }

      this.log('Languages loaded', { count: this.languages.length });
    },

    async fetchLanguages() {
      try {
        const apiUrl = this.getApiUrl();
        const response = await fetch(`${apiUrl}/api/settings/${this.shop}/languages?enabledOnly=true`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch languages');
        }

        const data = await response.json();
        
        this.languages = data.languages || [];
        
        if (window.LinguaShopStorage) {
          window.LinguaShopStorage.setLanguages(this.languages);
        }

        return this.languages;
      } catch (error) {
        console.error('LinguaShop: Failed to fetch languages', error);
        this.languages = this.getDefaultLanguages();
        return this.languages;
      }
    },

    getDefaultLanguages() {
      return [
        { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false, isDefault: true },
        { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false },
        { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false },
        { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false },
        { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', rtl: false },
        { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', rtl: false },
        { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', rtl: false },
        { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', rtl: false },
        { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', rtl: false },
        { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true }
      ];
    },

    async detectInitialLanguage() {
      const stored = window.LinguaShopStorage?.getLanguage();
      
      if (stored && stored.code) {
        this.currentLang = stored.code;
        this.originalLang = stored.code;
        
        const savedLang = this.languages.find(l => l.code === stored.code);
        if (savedLang) {
          this.originalLang = savedLang.code;
        }
        
        this.log('Using stored language', { code: this.currentLang });
        return;
      }

      if (this.config.autoDetect) {
        try {
          const detected = await window.LinguaShopGeo.detectLanguage(null, this.languages);
          
          if (detected.detected && detected.language) {
            const langExists = this.languages.some(l => l.code === detected.language);
            
            if (langExists) {
              this.currentLang = detected.language;
              this.originalLang = this.getDefaultLanguage()?.code || 'en';
              
              if (window.LinguaShopStorage) {
                const lang = this.languages.find(l => l.code === this.currentLang);
                window.LinguaShopStorage.setLanguage(this.currentLang, lang);
              }
              
              this.log('Language detected', { code: this.currentLang, reason: detected.reason });
              return;
            }
          }
        } catch (error) {
          console.warn('LinguaShop: Auto-detection failed', error);
        }
      }

      this.currentLang = this.getDefaultLanguage()?.code || 'en';
      this.originalLang = this.currentLang;
      
      this.log('Using default language', { code: this.currentLang });
    },

    getDefaultLanguage() {
      return this.languages.find(l => l.isDefault) || this.languages[0];
    },

    setupUI() {
      if (window.LinguaShopUI) {
        window.LinguaShopUI.init(
          this.config,
          this.languages,
          (lang) => this.onLanguageSelected(lang)
        );
        
        if (this.currentLang) {
          window.LinguaShopUI.setActiveLanguage(this.currentLang);
        }
      }
    },

    setupTranslator() {
      if (window.LinguaShopTranslator) {
        const apiUrl = this.getApiUrl();
        window.LinguaShopTranslator.init(apiUrl);
      }
    },

    async onLanguageSelected(language) {
      if (!language || !language.code) return;

      const previousLang = this.currentLang;

      this.currentLang = language.code;

      if (window.LinguaShopStorage) {
        window.LinguaShopStorage.setLanguage(language.code, language);
      }

      await this.applyLanguage(language.code, previousLang);

      this.log('Language changed', { from: previousLang, to: this.currentLang });

      if (window.LinguaShopUI) {
        window.LinguaShopUI.setActiveLanguage(this.currentLang);
      }
    },

    async applyLanguage(langCode, previousLang = null) {
      if (this.isTranslating) return;
      
      this.isTranslating = true;

      try {
        const lang = this.languages.find(l => l.code === langCode);
        
        if (!lang) {
          console.warn('LinguaShop: Language not found', langCode);
          return;
        }

        if (langCode === this.originalLang || langCode === 'en') {
          this.restoreOriginal();
        } else {
          if (window.LinguaShopTranslator) {
            await window.LinguaShopTranslator.translateContent(langCode, this.shop);
          }
        }

        if (lang.rtl) {
          this.setRTLDirection();
        } else {
          this.removeRTLDirection();
        }

        document.documentElement.setAttribute('lang', langCode);

      } catch (error) {
        console.error('LinguaShop: Failed to apply language', error);
      } finally {
        this.isTranslating = false;
      }
    },

    restoreOriginal() {
      if (window.LinguaShopTranslator) {
        window.LinguaShopTranslator.restoreOriginalContent();
      }
      
      this.removeRTLDirection();
    },

    setRTLDirection() {
      document.documentElement.setAttribute('dir', 'rtl');
      document.body.setAttribute('dir', 'rtl');
    },

    removeRTLDirection() {
      document.documentElement.removeAttribute('dir');
      document.body.removeAttribute('dir');
    },

    async translateText(text) {
      if (!text || text.trim().length === 0) {
        return text;
      }

      if (text.trim().length > 5000) {
        console.warn('LinguaShop: Text too long for single translation');
        return text;
      }

      try {
        if (window.LinguaShopTranslator) {
          return await window.LinguaShopTranslator.translateSingle(text, this.currentLang, this.shop);
        }
        return text;
      } catch (error) {
        console.error('LinguaShop: Text translation failed', error);
        return text;
      }
    },

    async translateBulk(texts) {
      if (!texts || texts.length === 0) {
        return texts;
      }

      try {
        if (window.LinguaShopTranslator) {
          return await window.LinguaShopTranslator.translatePage(texts, this.currentLang, this.shop);
        }
        return texts;
      } catch (error) {
        console.error('LinguaShop: Bulk translation failed', error);
        return texts;
      }
    },

    getCurrentLanguage() {
      return this.languages.find(l => l.code === this.currentLang);
    },

    getAllLanguages() {
      return this.languages;
    },

    getApiUrl() {
      if (this.config.apiEndpoint) {
        return this.config.apiEndpoint;
      }
      
      const protocol = window.location.protocol;
      const host = window.location.host;
      return `${protocol}//${host}`;
    },

    updateConfig(newConfig) {
      this.saveConfig(newConfig);
      
      if (window.LinguaShopUI) {
        window.LinguaShopUI.updateConfig(newConfig);
      }
    },

    destroy() {
      if (window.LinguaShopTranslator) {
        window.LinguaShopTranslator.destroy();
      }
      
      if (window.LinguaShopUI) {
        window.LinguaShopUI.destroy();
      }
      
      this.removeRTLDirection();
      document.documentElement.removeAttribute('lang');
      
      this.isInitialized = false;
      this.languages = [];
      this.currentLang = null;
      this.originalLang = null;
    },

    log(message, data = {}) {
      if (typeof console !== 'undefined' && console.log) {
        console.log(`[LinguaShop ${this.version}]`, message, data);
      }
    },

    getState() {
      return {
        version: this.version,
        shop: this.shop,
        config: this.config,
        languages: this.languages,
        currentLang: this.currentLang,
        originalLang: this.originalLang,
        isInitialized: this.isInitialized,
        isTranslating: this.isTranslating
      };
    }
  };

  if (typeof window !== 'undefined') {
    window.LinguaShop = LinguaShop;
    
    LinguaShop.init();
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LinguaShop;
  }
})();
