import express from 'express';
import Store from '../models/Store.js';
import { verifyShopifyWebhook } from '../middleware/verifyShopify.js';

const router = express.Router();

router.post('/app/uninstalled', verifyShopifyWebhook, async (req, res) => {
  try {
    const { shop } = req.shopify;
    console.log(`App uninstalled from ${shop}`);
    
    await Store.findOneAndUpdate(
      { shop },
      { $set: { isActive: false, uninstalledAt: new Date() } }
    );
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('App uninstall error:', error);
    res.status(500).json({ error: 'Webhook failed' });
  }
});

router.post('/shop/update', async (req, res) => {
  console.log('Shop update webhook received');
  res.status(200).json({ received: true });
});

router.post('/products/create', async (req, res) => {
  res.status(200).json({ received: true });
});

router.post('/products/update', async (req, res) => {
  res.status(200).json({ received: true });
});

router.post('/orders/create', async (req, res) => {
  res.status(200).json({ received: true });
});

router.post('/orders/paid', async (req, res) => {
  res.status(200).json({ received: true });
});

export default router;
