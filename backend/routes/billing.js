import express from 'express';
import Store from '../models/Store.js';

const router = express.Router();

const PLANS = {
  free: { id: 'free', name: 'Free', price: 0, features: ['2 languages', '500K chars/month'] },
  basic: { id: 'basic', name: 'Basic', price: 9.99, features: ['10 languages', '5M chars/month'], popular: true },
  growth: { id: 'growth', name: 'Growth', price: 24.99, features: ['50 languages', '20M chars/month'] },
  premium: { id: 'premium', name: 'Premium', price: 49.99, features: ['130+ languages', 'Unlimited'] },
};

router.get('/plans', async (req, res) => {
  res.json({
    success: true,
    plans: Object.values(PLANS),
    current: 'free',
  });
});

router.get('/status/:shop', async (req, res) => {
  try {
    const { shop } = req.params;
    const store = await Store.findOne({ shop: shop.toLowerCase() });
    
    res.json({
      success: true,
      currentPlan: PLANS[store?.plan || 'free'],
      subscription: null,
      isActive: store?.isActive ?? true,
    });
  } catch (error) {
    res.json({
      success: true,
      currentPlan: PLANS.free,
      subscription: null,
      isActive: true,
    });
  }
});

router.post('/subscribe', async (req, res) => {
  try {
    const { shop, planId } = req.body;
    
    if (!PLANS[planId]) {
      return res.status(400).json({ error: 'Invalid plan' });
    }
    
    const store = await Store.findOneAndUpdate(
      { shop: shop.toLowerCase() },
      { $set: { plan: planId } },
      { new: true }
    );
    
    res.json({
      success: true,
      message: `Switched to ${PLANS[planId].name} plan`,
      plan: PLANS[planId],
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ error: 'Subscription failed' });
  }
});

router.post('/cancel/:shop', async (req, res) => {
  try {
    const { shop } = req.params;
    
    await Store.findOneAndUpdate(
      { shop: shop.toLowerCase() },
      { $set: { plan: 'free' } }
    );
    
    res.json({
      success: true,
      message: 'Switched to free plan',
      plan: PLANS.free,
    });
  } catch (error) {
    console.error('Cancel error:', error);
    res.status(500).json({ error: 'Cancellation failed' });
  }
});

router.get('/usage-allowed/:shop', async (req, res) => {
  res.json({
    success: true,
    allowed: true,
    plan: {
      id: 'free',
      name: 'Free',
      languages: 2,
      charsPerMonth: 500000,
    },
  });
});

export default router;
