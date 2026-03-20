import axios from 'axios';
import Language from '../models/Language.js';

const GEOLOCATION_API_URL = 'https://ipapi.co/json/';
const FALLBACK_API_URL = 'https://ipapi.co/{ip}/json/';

const COUNTRY_TO_LANGUAGE_MAP = {
  US: 'en',
  GB: 'en',
  AU: 'en',
  CA: 'en',
  NZ: 'en',
  IE: 'en',
  IN: 'en',
  ZA: 'en',
  PH: 'en',
  SG: 'en',
  MY: 'en',
  MX: 'es',
  ES: 'es',
  AR: 'es',
  CO: 'es',
  PE: 'es',
  CL: 'es',
  VE: 'es',
  EC: 'es',
  GT: 'es',
  CU: 'es',
  DO: 'es',
  FR: 'fr',
  BE: 'fr',
  CA_QC: 'fr',
  CH: 'fr',
  MC: 'fr',
  LU: 'fr',
  DE: 'de',
  AT: 'de',
  CH_DE: 'de',
  LI: 'de',
  IT: 'it',
  CH_IT: 'it',
  SM: 'it',
  VA: 'it',
  PT: 'pt',
  BR: 'pt-br',
  AO: 'pt',
  MZ: 'pt',
  GW: 'pt',
  CV: 'pt',
  TL: 'pt',
  NL: 'nl',
  BE_NL: 'nl',
  RU: 'ru',
  BY: 'ru',
  KZ: 'ru',
  UA: 'uk',
  JP: 'ja',
  TW: 'zh-tw',
  HK: 'zh-tw',
  CN: 'zh',
  KR: 'ko',
  SA: 'ar',
  AE: 'ar',
  EG: 'ar',
  MA: 'ar',
  DZ: 'ar',
  IQ: 'ar',
  JO: 'ar',
  KW: 'ar',
  QA: 'ar',
  BH: 'ar',
  OM: 'ar',
  LY: 'ar',
  TN: 'ar',
  YE: 'ar',
  SD: 'ar',
  LB: 'ar',
  SY: 'ar',
  PK: 'ur',
  IR: 'fa',
  AF: 'fa',
  TR: 'tr',
  AZ: 'tr',
  UZ: 'uz',
  TM: 'tk',
  TJ: 'tg',
  KG: 'ky',
  KZ_AR: 'kk',
  TH: 'th',
  VN: 'vi',
  ID: 'id',
  BN: 'ms',
  MM: 'my',
  PL: 'pl',
  CZ: 'cs',
  SK: 'sk',
  SE: 'sv',
  NO: 'no',
  DK: 'da',
  FI: 'fi',
  IS: 'is',
  GR: 'el',
  CY: 'el',
  IL: 'he',
  RO: 'ro',
  MD: 'ro',
  HU: 'hu',
  HR: 'hr',
  RS: 'sr',
  BA: 'bs',
  ME: 'sr',
  MK: 'mk',
  BG: 'bg',
  AL: 'sq',
  XK: 'sq',
  SI: 'sl',
  LT: 'lt',
  LV: 'lv',
  EE: 'et',
  UA_RU: 'ru',
  GE: 'ka',
  AM: 'hy',
};

class GeolocationService {
  async getLocation(ip = null) {
    try {
      let url = GEOLOCATION_API_URL;
      
      if (ip && ip !== '127.0.0.1' && ip !== 'localhost' && ip !== '::1') {
        url = FALLBACK_API_URL.replace('{ip}', ip);
      }
      
      const response = await axios.get(url, {
        timeout: 5000,
        headers: {
          'Accept': 'application/json',
        },
      });
      
      return {
        success: true,
        country: response.data.country_code || response.data.country_code_iso3,
        countryName: response.data.country_name,
        city: response.data.city,
        region: response.data.region,
        latitude: response.data.latitude,
        longitude: response.data.longitude,
        timezone: response.data.timezone,
        currency: response.data.currency,
        language: response.data.languages?.split(',')[0],
        ip: response.data.ip,
      };
    } catch (error) {
      console.error('Geolocation error:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }
  
  async detectLanguage(ip = null, shop = null) {
    const location = await this.getLocation(ip);
    
    if (!location.success) {
      return {
        detected: false,
        language: 'en',
        confidence: 0,
        reason: 'geolocation_failed',
      };
    }
    
    const countryCode = location.country;
    
    let detectedLang = COUNTRY_TO_LANGUAGE_MAP[countryCode];
    
    if (!detectedLang && location.language) {
      const langCode = location.language.split('-')[0].toLowerCase();
      const matchingLang = Language.SUPPORTED_LANGUAGES.find(
        l => l.code === langCode || l.locale?.startsWith(langCode)
      );
      if (matchingLang) {
        detectedLang = matchingLang.code;
      }
    }
    
    if (!detectedLang) {
      detectedLang = this.guessLanguageFromCountry(countryCode);
    }
    
    if (shop) {
      const enabledLanguages = await Language.getEnabledLanguages(shop);
      const isEnabled = enabledLanguages.some(l => l.code === detectedLang);
      
      if (!isEnabled && enabledLanguages.length > 0) {
        detectedLang = enabledLanguages[0].code;
        return {
          detected: true,
          language: detectedLang,
          originalLanguage: detectedLang,
          confidence: 0.5,
          reason: 'language_not_enabled',
          availableLanguages: enabledLanguages.map(l => l.code),
        };
      }
    }
    
    return {
      detected: true,
      language: detectedLang || 'en',
      country: countryCode,
      countryName: location.countryName,
      city: location.city,
      confidence: 0.9,
      reason: 'geolocation',
    };
  }
  
  guessLanguageFromCountry(countryCode) {
    const regionDefaults = {
      AM: 'hy',
      AZ: 'az',
      BD: 'bn',
      BT: 'dz',
      KH: 'km',
      LA: 'lo',
      LK: 'si',
      MV: 'dv',
      MN: 'mn',
      NP: 'ne',
      KR: 'ko',
      KZ: 'kk',
      TJ: 'tg',
      TM: 'tk',
      PH: 'fil',
      PG: 'tpi',
      FJ: 'en',
      WS: 'en',
      TO: 'en',
      PW: 'en',
      KI: 'en',
      NR: 'en',
      MH: 'en',
      FM: 'en',
      VU: 'en',
      SB: 'en',
      GT: 'es',
      HN: 'es',
      SV: 'es',
      NI: 'es',
      CR: 'es',
      PA: 'es',
      BO: 'es',
      PY: 'es',
      UY: 'es',
    };
    
    return regionDefaults[countryCode] || 'en';
  }
  
  getLanguageFromCountry(countryCode) {
    return COUNTRY_TO_LANGUAGE_MAP[countryCode] || null;
  }
  
  getSupportedLanguages() {
    return Language.SUPPORTED_LANGUAGES;
  }
  
  async getLanguageDetails(code) {
    const language = Language.SUPPORTED_LANGUAGES.find(l => l.code === code);
    return language || null;
  }
  
  isRTLLanguage(code) {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur', 'yi', 'ps', 'sd'];
    return rtlLanguages.includes(code);
  }
  
  async getVisitorInfo(ip = null) {
    const location = await this.getLocation(ip);
    
    if (!location.success) {
      return {
        ip: ip,
        location: null,
        language: null,
        detected: false,
      };
    }
    
    const detectedLang = await this.detectLanguage(ip);
    
    return {
      ip: location.ip,
      location: {
        country: location.country,
        countryName: location.countryName,
        city: location.city,
        region: location.region,
        timezone: location.timezone,
        currency: location.currency,
      },
      language: {
        code: detectedLang.language,
        detected: detectedLang.detected,
        confidence: detectedLang.confidence,
      },
      detected: true,
    };
  }
}

const geolocationService = new GeolocationService();

export default geolocationService;
