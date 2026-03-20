import express from 'express';
import Settings from '../models/Settings.js';
import Language from '../models/Language.js';
import Store from '../models/Store.js';

const router = express.Router();

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
  widgetTheme: 'light',
  widgetSize: 'medium',
  autoDetectLang: true,
  showFlags: true,
  showNativeNames: true,
  translateCheckout: false,
  translateProducts: true,
  translateCollections: true,
  translatePages: true,
  translateBlogs: true,
  translateNavigation: true,
  translateFooter: true,
  hreflangEnabled: true,
  hreflangMode: 'all',
  enableCache: true,
};

router.get('/:shop', async (req, res) => {
  try {
    const { shop } = req.params;
    let settings = await Settings.findOne({ shop: shop.toLowerCase() });
    
    if (!settings) {
      settings = new Settings({ shop: shop.toLowerCase(), ...DEMO_SETTINGS });
      await settings.save();
    }
    
    const store = await Store.findOne({ shop: shop.toLowerCase() });
    
    res.json({
      success: true,
      settings: {
        defaultLang: settings.defaultLang,
        widgetPosition: settings.widgetPosition,
        widgetColor: settings.widgetColor,
        widgetTextColor: settings.widgetTextColor,
        widgetTheme: settings.widgetTheme,
        widgetSize: settings.widgetSize,
        autoDetectLang: settings.autoDetectLang,
        showFlags: settings.showFlags,
        showNativeNames: settings.showNativeNames,
        translateCheckout: settings.translateCheckout,
        translateProducts: settings.translateProducts,
        translateCollections: settings.translateCollections,
        translatePages: settings.translatePages,
        translateBlogs: settings.translateBlogs,
        translateNavigation: settings.translateNavigation,
        translateFooter: settings.translateFooter,
        hreflangEnabled: settings.hreflangEnabled,
        hreflangMode: settings.hreflangMode,
        enableCache: settings.enableCache,
      },
      store: store ? { shop: store.shop, plan: store.plan, isActive: store.isActive } : null
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.json({
      success: true,
      settings: DEMO_SETTINGS,
      store: { shop: req.params.shop, plan: 'free', isActive: true }
    });
  }
});

router.put('/:shop', async (req, res) => {
  try {
    const { shop } = req.params;
    const updates = req.body;
    
    const settings = await Settings.findOneAndUpdate(
      { shop: shop.toLowerCase() },
      { $set: updates },
      { new: true, upsert: true }
    );
    
    res.json({ success: true, settings, message: 'Settings updated' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

router.get('/:shop/languages', async (req, res) => {
  try {
    const { shop } = req.params;
    const { enabledOnly } = req.query;
    
    let languages = await Language.find({ shop: shop.toLowerCase() }).sort({ sortOrder: 1 });
    
    if (languages.length === 0) {
      const bulkOps = DEMO_LANGUAGES.map((lang, index) => ({
        updateOne: {
          filter: { shop: shop.toLowerCase(), code: lang.code },
          update: { $set: { ...lang, shop: shop.toLowerCase(), sortOrder: index } },
          upsert: true,
        }
      }));
      await Language.bulkWrite(bulkOps);
      languages = await Language.find({ shop: shop.toLowerCase() }).sort({ sortOrder: 1 });
    }
    
    const filtered = enabledOnly === 'true' ? languages.filter(l => l.enabled) : languages;
    
    res.json({
      success: true,
      languages: filtered.map(l => ({
        code: l.code,
        name: l.name,
        nativeName: l.nativeName,
        flag: l.flag,
        rtl: l.rtl,
        enabled: l.enabled,
        isDefault: l.isDefault,
      })),
      total: filtered.length,
      enabledCount: languages.filter(l => l.enabled).length,
    });
  } catch (error) {
    console.error('Get languages error:', error);
    res.json({
      success: true,
      languages: DEMO_LANGUAGES,
      total: DEMO_LANGUAGES.length,
      enabledCount: DEMO_LANGUAGES.filter(l => l.enabled).length,
    });
  }
});

router.put('/:shop/languages', async (req, res) => {
  try {
    const { shop } = req.params;
    const { code, enabled, isDefault } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Language code is required' });
    }
    
    if (isDefault) {
      await Language.updateMany({ shop: shop.toLowerCase() }, { $set: { isDefault: false } });
      await Language.findOneAndUpdate(
        { shop: shop.toLowerCase(), code },
        { $set: { isDefault: true, enabled: true } },
        { new: true }
      );
    }
    
    if (typeof enabled === 'boolean') {
      await Language.findOneAndUpdate(
        { shop: shop.toLowerCase(), code },
        { $set: { enabled } },
        { new: true }
      );
    }
    
    const lang = await Language.findOne({ shop: shop.toLowerCase(), code });
    
    res.json({
      success: true,
      message: `${code} ${enabled ? 'enabled' : 'disabled'}`,
      language: lang,
    });
  } catch (error) {
    console.error('Update language error:', error);
    res.status(500).json({ error: 'Failed to update language' });
  }
});

router.get('/:shop/widget-config', async (req, res) => {
  res.json({
    success: true,
    config: {
      position: 'bottom-right',
      color: '#008060',
      textColor: '#ffffff',
      theme: 'light',
      size: 'medium',
      showFlags: true,
      showNativeNames: true,
      autoDetect: true,
    },
    languages: DEMO_LANGUAGES.filter(l => l.enabled),
  });
});

export default router;
