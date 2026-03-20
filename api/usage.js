module.exports = async (req, res) => {
  const { shop } = req.query;
  const method = req.method;
  
  if (method === 'GET') {
    return res.json({
      success: true,
      usage: {
        shop: shop || 'demo-store.myshopify.com',
        month: new Date().toISOString().slice(0, 7),
        charsUsed: 12847,
        wordsTranslated: 2856,
        apiCalls: 156,
        limit: 500000,
        remaining: 487153,
        percent: 2.6,
        isWarning: false,
        isBlocked: false,
      },
      plan: 'free',
    });
  }
  
  res.status(405).json({ error: 'Method not allowed' });
};
