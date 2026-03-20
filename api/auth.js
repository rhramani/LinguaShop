module.exports = async (req, res) => {
  const method = req.method;
  const { shop, code, hmac } = req.query;
  
  if (method === 'GET') {
    if (req.url.includes('/callback')) {
      const cleanShop = shop?.toLowerCase().replace(/\.myshopify\.com$/, '') + '.myshopify.com';
      const redirectUrl = `${process.env.APP_URL || 'https://your-app.vercel.app'}?shop=${cleanShop}`;
      return res.redirect(redirectUrl);
    }
    
    return res.json({
      valid: true,
      shop: shop || 'demo-store.myshopify.com',
      plan: 'free',
      demo: false,
    });
  }
  
  res.status(405).json({ error: 'Method not allowed' });
};
