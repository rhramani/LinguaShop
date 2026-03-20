const DEMO_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false, enabled: true, isDefault: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false, enabled: true },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false, enabled: true },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false, enabled: false },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', rtl: false, enabled: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', rtl: false, enabled: false },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', rtl: false, enabled: false },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', rtl: false, enabled: false },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', rtl: false, enabled: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true, enabled: false },
];

const DEMO_SETTINGS = {
  defaultLang: 'en',
  widgetPosition: 'bottom-right',
  widgetColor: '#008060',
  widgetTextColor: '#ffffff',
  autoDetectLang: true,
  showFlags: true,
  showNativeNames: true,
  translateProducts: true,
  translateCollections: true,
  translatePages: true,
  translateBlogs: true,
  translateNavigation: true,
  translateFooter: true,
  hreflangEnabled: true,
  enableCache: true,
};

module.exports = async (req, res) => {
  const { shop, lang } = req.query;
  const method = req.method;
  
  if (method === 'GET') {
    if (lang === 'languages') {
      const enabledOnly = req.query.enabledOnly === 'true';
      const filtered = enabledOnly 
        ? DEMO_LANGUAGES.filter(l => l.enabled)
        : DEMO_LANGUAGES;
      
      return res.json({
        success: true,
        languages: filtered,
        total: filtered.length,
        enabledCount: DEMO_LANGUAGES.filter(l => l.enabled).length,
      });
    }
    
    return res.json({
      success: true,
      settings: DEMO_SETTINGS,
      store: { shop: shop || 'demo-store.myshopify.com', plan: 'free', isActive: true }
    });
  }
  
  if (method === 'PUT') {
    return res.json({ success: true, message: 'Settings updated' });
  }
  
  res.status(405).json({ error: 'Method not allowed' });
};
