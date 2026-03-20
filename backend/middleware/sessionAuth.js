import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'linguashop_default_secret_change_me';

const isDemoMode = () => process.env.DEMO_MODE === 'true';

export const sessionAuth = async (req, res, next) => {
  if (isDemoMode()) {
    req.session = {
      shop: 'demo-store.myshopify.com',
      store: { shop: 'demo-store.myshopify.com', isActive: true },
      userId: 'demo-user',
    };
    req.shop = 'demo-store.myshopify.com';
    req.store = { shop: 'demo-store.myshopify.com', isActive: true };
    return next();
  }
  
  try {
    let token = null;
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    if (!token && req.cookies?.session_token) {
      token = req.cookies.session_token;
    }
    
    if (!token && req.query?.token) {
      token = req.query.token;
    }
    
    if (!token) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'No session token provided',
      });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (!decoded.shop) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token does not contain shop information',
      });
    }
    
    const Store = (await import('../models/Store.js')).default;
    const store = await Store.findOne({ shop: decoded.shop.toLowerCase() });
    
    if (!store) {
      return res.status(401).json({
        error: 'Store not found',
        message: 'The store associated with this session no longer exists',
      });
    }
    
    if (!store.isActive) {
      return res.status(403).json({
        error: 'App disabled',
        message: 'The app has been disabled for this store',
      });
    }
    
    req.session = {
      shop: store.shop,
      store,
      userId: decoded.userId || null,
      iat: decoded.iat,
      exp: decoded.exp,
    };
    
    req.shop = store.shop;
    req.store = store;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Session expired',
        message: 'Your session has expired. Please log in again.',
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'The provided token is invalid',
      });
    }
    
    console.error('Session auth error:', error.message);
    return res.status(500).json({
      error: 'Authentication failed',
      message: 'An error occurred during authentication',
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  if (isDemoMode()) {
    req.session = {
      shop: 'demo-store.myshopify.com',
      store: { shop: 'demo-store.myshopify.com', isActive: true },
      userId: 'demo-user',
    };
    req.shop = 'demo-store.myshopify.com';
    req.store = { shop: 'demo-store.myshopify.com', isActive: true };
    return next();
  }
  
  try {
    let token = null;
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    if (!token && req.cookies?.session_token) {
      token = req.cookies.session_token;
    }
    
    if (!token) {
      req.session = null;
      req.shop = null;
      req.store = null;
      return next();
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      const Store = (await import('../models/Store.js')).default;
      const store = await Store.findOne({ shop: decoded.shop.toLowerCase() });
      
      if (store && store.isActive) {
        req.session = {
          shop: store.shop,
          store,
          userId: decoded.userId || null,
        };
        req.shop = store.shop;
        req.store = store;
      } else {
        req.session = null;
        req.shop = null;
        req.store = null;
      }
    } catch (jwtError) {
      req.session = null;
      req.shop = null;
      req.store = null;
    }
    
    next();
  } catch (error) {
    console.error('Optional auth error:', error.message);
    req.session = null;
    req.shop = null;
    req.store = null;
    next();
  }
};

export const generateToken = (shop, userId = null, expiresIn = '30d') => {
  const payload = {
    shop: shop.toLowerCase(),
    userId,
    type: 'session',
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export default sessionAuth;
