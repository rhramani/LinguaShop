import express from 'express';
import Usage from '../models/Usage.js';
import Store from '../models/Store.js';

const router = express.Router();

const PLAN_LIMITS = {
  free: 500000,
  basic: 5000000,
  growth: 20000000,
  premium: 100000000,
};

router.get('/:shop', async (req, res) => {
  try {
    const { shop } = req.params;
    
    let usage = await Usage.findOne({ shop: shop.toLowerCase() });
    
    if (!usage) {
      const store = await Store.findOne({ shop: shop.toLowerCase() });
      const limit = PLAN_LIMITS[store?.plan || 'free'];
      
      usage = new Usage({
        shop: shop.toLowerCase(),
        month: new Date().toISOString().slice(0, 7),
        charsUsed: 0,
        wordsTranslated: 0,
        apiCalls: 0,
        limit,
      });
      await usage.save();
    }
    
    res.json({
      success: true,
      usage: {
        shop: usage.shop,
        month: usage.month,
        charsUsed: usage.charsUsed,
        wordsTranslated: usage.wordsTranslated,
        apiCalls: usage.apiCalls,
        limit: usage.limit,
        remaining: usage.limit - usage.charsUsed,
        percent: Math.round((usage.charsUsed / usage.limit) * 100),
        isWarning: usage.charsUsed >= usage.limit * 0.8,
        isBlocked: usage.charsUsed >= usage.limit,
      },
      plan: req.store?.plan || 'free',
    });
  } catch (error) {
    console.error('Get usage error:', error);
    res.json({
      success: true,
      usage: {
        shop: req.params.shop,
        month: new Date().toISOString().slice(0, 7),
        charsUsed: 0,
        wordsTranslated: 0,
        apiCalls: 0,
        limit: 500000,
        remaining: 500000,
        percent: 0,
        isWarning: false,
        isBlocked: false,
      },
      plan: 'free',
    });
  }
});

router.get('/:shop/history', async (req, res) => {
  try {
    const { shop } = req.params;
    const { limit = 12 } = req.query;
    
    const history = await Usage.find({ shop: shop.toLowerCase() })
      .sort({ month: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      history: history.map(h => ({
        month: h.month,
        charsUsed: h.charsUsed,
        limit: h.limit,
        percent: Math.round((h.charsUsed / h.limit) * 100),
      })),
    });
  } catch (error) {
    console.error('Get usage history error:', error);
    res.json({ success: true, history: [] });
  }
});

router.get('/:shop/stats', async (req, res) => {
  try {
    const { shop } = req.params;
    const usage = await Usage.findOne({ shop: shop.toLowerCase() });
    
    res.json({
      success: true,
      stats: {
        current: usage ? {
          month: usage.month,
          charsUsed: usage.charsUsed,
          limit: usage.limit,
          percent: Math.round((usage.charsUsed / usage.limit) * 100),
          remaining: usage.limit - usage.charsUsed,
          isWarning: usage.charsUsed >= usage.limit * 0.8,
          isBlocked: usage.charsUsed >= usage.limit,
        } : null,
        totals: usage ? {
          totalApiCalls: usage.apiCalls,
          totalWordsTranslated: usage.wordsTranslated,
        } : null,
        plan: req.store?.plan || 'free',
        planLimit: PLAN_LIMITS[req.store?.plan || 'free'],
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.json({ success: true, stats: null });
  }
});

router.post('/:shop/reset', async (req, res) => {
  try {
    const { shop } = req.params;
    const { confirm } = req.body;
    
    if (confirm !== true) {
      return res.status(400).json({ error: 'Set confirm: true to reset' });
    }
    
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    await Usage.findOneAndUpdate(
      { shop: shop.toLowerCase(), month: currentMonth },
      { $set: { charsUsed: 0, wordsTranslated: 0, apiCalls: 0, blockedAt: null } }
    );
    
    res.json({ success: true, message: 'Usage reset', usage: { charsUsed: 0, remaining: 500000 } });
  } catch (error) {
    console.error('Reset usage error:', error);
    res.status(500).json({ error: 'Failed to reset usage' });
  }
});

export default router;
