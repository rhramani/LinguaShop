const crypto = require('crypto');

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;
const APP_URL = process.env.APP_URL || 'https://your-app.vercel.app';

function verifyHmac(query) {
  if (!SHOPIFY_API_SECRET) return true;
  const { hmac, shop, timestamp, code } = query;
  const params = { shop, timestamp, code };
  const message = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
  const generatedHash = crypto.createHmac('sha256', SHOPIFY_API_SECRET).update(message).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(hmac || ''), Buffer.from(generatedHash));
}

function generateToken(shop) {
  const jwt = require('jsonwebtoken');
  const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
  return jwt.sign({ shop }, JWT_SECRET, { expiresIn: '30d' });
}

module.exports = async (req, res) => {
  const { query, method } = req;
  
  if (method === 'GET') {
    const path = query.path || '';
    
    if (path === 'login' || (!path && !query.code)) {
      const shop = query.shop;
      if (!shop) {
        return res.status(400).json({ error: 'Shop parameter required' });
      }
      
      const cleanShop = shop.toLowerCase().replace(/\.myshopify\.com$/, '') + '.myshopify.com';
      const redirectUri = `${APP_URL}/api/auth?path=callback`;
      const scopes = process.env.SHOPIFY_SCOPES || 'write_script_tags,read_products';
      
      const installUrl = `https://${cleanShop}/admin/oauth/authorize?` +
        `client_id=${SHOPIFY_API_KEY}&` +
        `scope=${scopes}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `state=${crypto.randomBytes(16).toString('hex')}`;
      
      return res.redirect(installUrl);
    }
    
    if (path === 'callback' || query.code) {
      const { shop, code, hmac } = query;
      
      if (!shop || !code) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }
      
      if (SHOPIFY_API_KEY && SHOPIFY_API_SECRET) {
        if (!verifyHmac(query)) {
          return res.status(400).json({ error: 'HMAC verification failed' });
        }
      }
      
      const cleanShop = shop.toLowerCase().replace(/\.myshopify\.com$/, '') + '.myshopify.com';
      const token = generateToken(cleanShop);
      
      const redirectUrl = `${APP_URL}?shop=${cleanShop}&token=${token}`;
      return res.redirect(redirectUrl);
    }
    
    return res.status(404).json({ error: 'Not found' });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
};
