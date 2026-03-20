import axios from 'axios';
import Translation from '../models/Translation.js';
import Usage from '../models/Usage.js';
import Language from '../models/Language.js';

const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';
const GOOGLE_TRANSLATE_API_URL_V3 = 'https://translation.googleapis.com/language/translate/v3';

class GoogleTranslateService {
  constructor() {
    this.apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    this.maxCharsPerRequest = 5000;
    this.batchSize = 100;
  }
  
  async translate(text, targetLang, sourceLang = 'auto', shop) {
    if (!text || text.trim().length === 0) {
      return { translated: '', cached: false, charsUsed: 0 };
    }
    
    const charCount = text.length;
    
    if (charCount > this.maxCharsPerRequest) {
      return this.translateBulk([text], targetLang, sourceLang, shop).then(r => r.translations[0]);
    }
    
    const cached = await Translation.findCached(shop, text, targetLang, sourceLang);
    
    if (cached) {
      return {
        translated: cached.translatedText,
        cached: true,
        charsUsed: 0,
        sourceLang: cached.sourceLang,
      };
    }
    
    const usage = await Usage.getOrCreate(shop);
    
    if (usage.isBlocked()) {
      throw new Error('MONTHLY_LIMIT_REACHED:500000');
    }
    
    if (charCount > usage.getRemaining()) {
      usage.charsUsed = usage.limit;
      await usage.save();
      throw new Error('MONTHLY_LIMIT_REACHED:' + usage.limit);
    }
    
    const result = await this.callGoogleAPI(text, targetLang, sourceLang);
    
    await Translation.cacheTranslation(
      shop,
      text,
      targetLang,
      sourceLang || 'auto',
      result.translatedText,
      true
    );
    
    await Usage.addUsage(shop, charCount, true);
    
    return {
      translated: result.translatedText,
      cached: false,
      charsUsed: charCount,
      sourceLang: result.detectedSourceLang,
    };
  }
  
  async translateBulk(texts, targetLang, sourceLang = 'auto', shop) {
    const validTexts = texts.filter(t => t && t.trim().length > 0);
    
    if (validTexts.length === 0) {
      return { translations: [], totalChars: 0, cached: 0, uncached: 0 };
    }
    
    const results = [];
    let totalChars = 0;
    let cachedCount = 0;
    let uncachedCount = 0;
    
    const uncachedTexts = [];
    const uncachedIndices = [];
    
    for (let i = 0; i < validTexts.length; i++) {
      const text = validTexts[i];
      const cached = await Translation.findCached(shop, text, targetLang, sourceLang);
      
      if (cached) {
        results[i] = cached.translatedText;
        cachedCount++;
      } else {
        uncachedTexts.push(text);
        uncachedIndices.push(i);
      }
    }
    
    if (uncachedTexts.length > 0) {
      const usage = await Usage.getOrCreate(shop);
      
      const totalNewChars = uncachedTexts.reduce((sum, t) => sum + t.length, 0);
      
      if (usage.isBlocked()) {
        throw new Error('MONTHLY_LIMIT_REACHED:500000');
      }
      
      if (totalNewChars > usage.getRemaining()) {
        usage.charsUsed = usage.limit;
        await usage.save();
        throw new Error('MONTHLY_LIMIT_REACHED:' + usage.limit);
      }
      
      const batches = [];
      for (let i = 0; i < uncachedTexts.length; i += this.batchSize) {
        batches.push(uncachedTexts.slice(i, i + this.batchSize));
      }
      
      const batchResults = [];
      for (const batch of batches) {
        const batchResult = await this.callGoogleAPIBatch(batch, targetLang, sourceLang);
        batchResults.push(...batchResult);
      }
      
      for (let i = 0; i < uncachedIndices.length; i++) {
        const originalIndex = uncachedIndices[i];
        const translatedText = batchResults[i];
        
        results[originalIndex] = translatedText;
        totalChars += validTexts[originalIndex].length;
        uncachedCount++;
        
        await Translation.cacheTranslation(
          shop,
          validTexts[originalIndex],
          targetLang,
          sourceLang || 'auto',
          translatedText,
          true
        );
      }
      
      await Usage.addUsage(shop, totalChars, true);
    }
    
    return {
      translations: results,
      totalChars,
      cached: cachedCount,
      uncached: uncachedCount,
    };
  }
  
  async callGoogleAPI(text, targetLang, sourceLang = 'auto') {
    try {
      const response = await axios.post(
        GOOGLE_TRANSLATE_API_URL + '?key=' + this.apiKey,
        {
          q: text,
          target: targetLang,
          source: sourceLang !== 'auto' ? sourceLang : undefined,
          format: 'html',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );
      
      const data = response.data.data;
      
      if (!data.translations || !data.translations[0]) {
        throw new Error('Invalid response from Google Translate API');
      }
      
      return {
        translatedText: data.translations[0].translatedText,
        detectedSourceLang: data.translations[0].detectedSourceLanguage || sourceLang,
      };
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 403) {
          throw new Error('GOOGLE_API_KEY_INVALID');
        }
        if (status === 400) {
          throw new Error(`GOOGLE_API_ERROR:${data.error?.message || 'Bad request'}`);
        }
        if (status === 429) {
          throw new Error('GOOGLE_API_RATE_LIMITED');
        }
      }
      
      throw new Error(`GOOGLE_API_ERROR:${error.message}`);
    }
  }
  
  async callGoogleAPIBatch(texts, targetLang, sourceLang = 'auto') {
    try {
      const response = await axios.post(
        GOOGLE_TRANSLATE_API_URL + '?key=' + this.apiKey,
        {
          q: texts,
          target: targetLang,
          source: sourceLang !== 'auto' ? sourceLang : undefined,
          format: 'html',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 60000,
        }
      );
      
      const data = response.data.data;
      
      if (!data.translations) {
        throw new Error('Invalid response from Google Translate API');
      }
      
      return data.translations.map(t => t.translatedText);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        throw new Error('GOOGLE_API_KEY_INVALID');
      }
      throw new Error(`GOOGLE_API_ERROR:${error.message}`);
    }
  }
  
  async detectLanguage(text) {
    try {
      const response = await axios.post(
        GOOGLE_TRANSLATE_API_URL + '/detect?key=' + this.apiKey,
        {
          q: text,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );
      
      const detections = response.data.data.detections;
      
      if (!detections || !detections[0] || !detections[0][0]) {
        return { language: 'en', confidence: 0 };
      }
      
      const detection = detections[0][0];
      
      return {
        language: detection.language,
        confidence: detection.confidence,
        isReliable: detection.isReliable,
      };
    } catch (error) {
      console.error('Language detection error:', error.message);
      return { language: 'en', confidence: 0 };
    }
  }
  
  async getSupportedLanguages() {
    return Language.SUPPORTED_LANGUAGES;
  }
  
  mapToGoogleLangCode(code) {
    const language = Language.SUPPORTED_LANGUAGES.find(
      l => l.code === code || l.locale === code
    );
    return language?.googleLangCode || code;
  }
}

const googleTranslateService = new GoogleTranslateService();

export default googleTranslateService;
