import express from 'express';
import crypto from 'crypto';
import Store from '../models/Store.js';
import Settings from '../models/Settings.js';
import Language from '../models/Language.js';
import { generateToken } from '../middleware/sessionAuth.js';

const router = express.Router();

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

const LANGUAGES_INIT = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false, enabled: true, isDefault: true, sortOrder: 0 },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false, enabled: true, sortOrder: 1 },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false, enabled: true, sortOrder: 2 },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false, sortOrder: 3 },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', rtl: false, sortOrder: 4 },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', rtl: false, sortOrder: 5 },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', rtl: false, sortOrder: 6 },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', rtl: false, sortOrder: 7 },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', rtl: false, sortOrder: 8 },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true, sortOrder: 9 },
];

function verifyHmac(query) {
  const { hmac, shop, timestamp, code } = query;
  const params = { shop, timestamp, code };
  const message = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
  const generatedHash = crypto.createHmac('sha256', SHOPIFY_API_SECRET).update(message).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(hmac || ''), Buffer.from(generatedHash));
}

async function initializeStoreData(shop) {
  let store = await Store.findOne({ shop });
  
  if (!store) {
    store = new Store({
      shop,
      accessToken: '',
      plan: 'free',
      isActive: true,
    });
    await store.save();
  }
  
  await Settings.findOneAndUpdate(
    { shop },
    { shop },
    { upsert: true, new: true }
  );
  
  const bulkOps = LANGUAGES_INIT.map(lang => ({
    updateOne: {
      filter: { shop, code: lang.code },
      update: { $set: { shop, ...lang } },
      upsert: true,
    }
  }));
  await Language.bulkWrite(bulkOps);
  
  return store;
}

router.get('/login', async (req, res) => {
  const { shop } = req.query;
  
  if (!shop) {
    return res.status(400).json({ error: 'Shop parameter required' });
  }
  
  const cleanShop = shop.toLowerCase().replace(/\.myshopify\.com$/, '') + '.myshopify.com';
  const redirectUri = `${APP_URL}/auth/callback`;
  const scopes = process.env.SHOPIFY_SCOPES || 'write_script_tags,read_products';
  
  const state = crypto.randomBytes(16).toString('hex');
  
  const installUrl = `https://${cleanShop}/admin/oauth/authorize?` +
    `client_id=${SHOPIFY_API_KEY}&` +
    `scope=${scopes}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `state=${state}`;
  
  res.cookie('oauth_state', state, { httpOnly: true });
  res.redirect(installUrl);
});

router.get('/callback', async (req, res) => {
  const { shop, code, hmac, state } = req.query;
  
  if (!shop || !code) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
  
  const cleanShop = shop.toLowerCase().replace(/\.myshopify\.com$/, '') + '.myshopify.com';
  
  if (SHOPIFY_API_KEY && SHOPIFY_API_SECRET) {
    if (!verifyHmac(req.query)) {
      return res.status(400).json({ error: 'HMAC verification failed' });
    }
  }
  
  const token = generateToken(cleanShop);
  
  await initializeStoreData(cleanShop);
  
  await Store.findOneAndUpdate(
    { shop: cleanShop },
    { $set: { accessToken: code, isActive: true } }
  );
  
  res.cookie('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
  });
  
  const redirectUrl = `${APP_URL}?shop=${cleanShop}`;
  res.redirect(redirectUrl);
});

router.get('/verify', async (req, res) => {
  const token = req.cookies?.session_token || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.json({ valid: false, demo: true });
  }
  
  try {
    const jwt = await import('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET;
    const decoded = jwt.default.verify(token, JWT_SECRET);
    
    const store = await Store.findOne({ shop: decoded.shop });
    
    res.json({
      valid: true,
      shop: store?.shop || decoded.shop,
      plan: store?.plan || 'free',
      demo: false,
    });
  } catch (error) {
    res.json({ valid: false, demo: true });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('session_token');
  res.json({ success: true });
});

export default router;
