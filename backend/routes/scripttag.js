import express from 'express';
import Store from '../models/Store.js';
import Settings from '../models/Settings.js';

const router = express.Router();

router.post('/install/:shop', async (req, res) => {
  try {
    const { shop } = req.params;
    
    const store = await Store.findOne({ shop: shop.toLowerCase() });
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    store.scriptTagId = 'demo_script_tag_' + Date.now();
    await store.save();
    
    res.json({
      success: true,
      message: 'Widget installed',
      scriptTagId: store.scriptTagId,
      src: '/widget/widget.min.js',
    });
  } catch (error) {
    console.error('Install widget error:', error);
    res.status(500).json({ error: 'Failed to install widget' });
  }
});

router.delete('/remove/:shop', async (req, res) => {
  try {
    const { shop } = req.params;
    
    await Store.findOneAndUpdate(
      { shop: shop.toLowerCase() },
      { $set: { scriptTagId: null } }
    );
    
    res.json({ success: true, message: 'Widget removed' });
  } catch (error) {
    console.error('Remove widget error:', error);
    res.status(500).json({ error: 'Failed to remove widget' });
  }
});

router.get('/status/:shop', async (req, res) => {
  try {
    const { shop } = req.params;
    const store = await Store.findOne({ shop: shop.toLowerCase() });
    
    res.json({
      success: true,
      installed: !!store?.scriptTagId,
      scriptTagId: store?.scriptTagId,
      src: '/widget/widget.min.js',
      widgetConfig: {
        position: 'bottom-right',
        color: '#008060',
        textColor: '#ffffff',
        theme: 'light',
        size: 'medium',
        showFlags: true,
        showNativeNames: true,
        autoDetect: true,
      },
    });
  } catch (error) {
    console.error('Widget status error:', error);
    res.json({
      success: true,
      installed: false,
      widgetConfig: null,
    });
  }
});

router.put('/config/:shop', async (req, res) => {
  try {
    const { shop } = req.params;
    const config = req.body;
    
    await Settings.findOneAndUpdate(
      { shop: shop.toLowerCase() },
      {
        $set: {
          widgetPosition: config.position,
          widgetColor: config.color,
          widgetTextColor: config.textColor,
          widgetTheme: config.theme,
          widgetSize: config.size,
        }
      },
      { upsert: true }
    );
    
    res.json({
      success: true,
      config,
      message: 'Widget configuration updated',
    });
  } catch (error) {
    console.error('Update widget config error:', error);
    res.status(500).json({ error: 'Failed to update config' });
  }
});

export default router;
