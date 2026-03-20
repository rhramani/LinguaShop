import crypto from 'crypto';
import Store from '../models/Store.js';

export const verifyShopifyWebhook = async (req, res, next) => {
  try {
    const shop = req.headers['x-shopify-shop-domain'];
    const hmac = req.headers['x-shopify-hmac-sha256'];
    const body = JSON.stringify(req.body);
    
    if (!shop || !hmac) {
      return res.status(401).json({ error: 'Missing Shopify headers' });
    }
    
    const secret = process.env.SHOPIFY_API_SECRET;
    
    const generatedHmac = crypto
      .createHmac('sha256', secret)
      .update(body, 'utf8')
      .digest('base64');
    
    const isValid = crypto.timingSafeEqual(
      Buffer.from(hmac, 'base64'),
      Buffer.from(generatedHmac, 'base64')
    );
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }
    
    req.shopify = { shop, domain: shop };
    next();
  } catch (error) {
    console.error('Webhook verification error:', error.message);
    return res.status(401).json({ error: 'Verification failed' });
  }
};

export const verifyShopifyRequest = async (req, res, next) => {
  const shop = req.query.shop;
  const hmac = req.query.hmac;
  
  if (!shop || !hmac) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
  
  req.shopify = { shop: shop.toLowerCase(), domain: shop };
  next();
};

export const requireActiveStore = async (req, res, next) => {
  try {
    const shop = req.params.shop || req.query.shop || req.body?.shop;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop domain is required' });
    }
    
    const store = await Store.findOne({ shop: shop.toLowerCase() });
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found. Please install the app.' });
    }
    
    if (!store.isActive) {
      return res.status(403).json({ error: 'App is not active for this store' });
    }
    
    req.store = store;
    req.shop = store.shop;
    
    next();
  } catch (error) {
    console.error('Store validation error:', error.message);
    return res.status(500).json({ error: 'Failed to validate store' });
  }
};

export default {
  verifyShopifyWebhook,
  verifyShopifyRequest,
  requireActiveStore,
};
