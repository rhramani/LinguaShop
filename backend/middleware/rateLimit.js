import rateLimit from 'express-rate-limit';

const DEFAULT_WINDOW_MS = 60 * 1000;
const DEFAULT_MAX_REQUESTS = 30;

const createStoreKeyGenerator = (req) => {
  return async (req) => {
    const shop = req.shop || req.params.shop || req.query.shop || req.body?.shop;
    if (shop) return `shop:${shop.toLowerCase()}`;
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    return `ip:${ip}`;
  };
};

export const rateLimitMiddleware = rateLimit({
  windowMs: DEFAULT_WINDOW_MS,
  max: DEFAULT_MAX_REQUESTS,
  keyGenerator: createStoreKeyGenerator(),
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil(DEFAULT_WINDOW_MS / 1000),
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const translationRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  keyGenerator: createStoreKeyGenerator(),
  handler: (req, res) => {
    res.status(429).json({
      error: 'Translation rate limit exceeded',
      message: 'Too many translation requests.',
      retryAfter: 60,
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const bulkTranslationRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: createStoreKeyGenerator(),
  handler: (req, res) => {
    res.status(429).json({
      error: 'Bulk translation rate limit exceeded',
      message: 'Too many bulk requests.',
      retryAfter: 60,
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => `auth:${req.query.shop || req.ip}`,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many authentication attempts',
      message: 'Please try again in 15 minutes.',
      retryAfter: 900,
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const webhookRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  keyGenerator: (req) => `webhook:${req.headers['x-shopify-shop-domain'] || req.ip}`,
  handler: (req, res) => {
    res.status(429).json({ error: 'Webhook rate limit exceeded' });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const checkUsageLimit = async (req, res, next) => {
  next();
};

export const validateInput = (maxLength = 5000) => {
  return (req, res, next) => next();
};

export const validateTranslationInput = [(req, res, next) => next()];
export const validateBulkTranslationInput = [(req, res, next) => next()];

export default rateLimitMiddleware;
