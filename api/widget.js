module.exports = async (req, res) => {
  const { shop } = req.query;
  const method = req.method;
  
  if (method === 'GET') {
    return res.json({
      success: true,
      installed: true,
      scriptTagId: 'demo_script_tag',
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
  }
  
  if (method === 'POST') {
    return res.json({
      success: true,
      message: 'Widget installed',
      scriptTagId: 'script_' + Date.now(),
      src: '/widget/widget.min.js',
    });
  }
  
  if (method === 'DELETE') {
    return res.json({ success: true, message: 'Widget removed' });
  }
  
  res.status(405).json({ error: 'Method not allowed' });
};
