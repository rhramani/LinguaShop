import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Languages from './pages/Languages';
import TranslationEditor from './pages/TranslationEditor';
import Widget from './pages/Widget';
import Settings from './pages/Settings';
import Billing from './pages/Billing';

const App = () => {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const shopParam = params.get('shop');
        const hostParam = params.get('host');
        const hmacParam = params.get('hmac');
        
        if (hostParam) {
          localStorage.setItem('linguashop_host', hostParam);
        }
        
        if (shopParam) {
          setShop(shopParam);
          localStorage.setItem('linguashop_shop', shopParam);
          setIsDemo(false);
        } else {
          const storedShop = localStorage.getItem('linguashop_shop');
          if (storedShop) {
            setShop(storedShop);
            setIsDemo(false);
          } else {
            setIsDemo(true);
            setShop('demo-store.myshopify.com');
            localStorage.setItem('linguashop_shop', 'demo-store.myshopify.com');
          }
        }
        
        const token = localStorage.getItem('linguashop_token');
        if (!token) {
          localStorage.setItem('linguashop_token', 'demo-token-' + Date.now());
        }

        setLoading(false);
      } catch (err) {
        console.error('App initialization error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    initApp();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '16px',
        backgroundColor: '#f6f6f7',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ fontSize: '24px' }}>⏳</div>
        <div style={{ color: '#666' }}>Loading LinguaShop...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '16px',
        padding: '20px',
        backgroundColor: '#f6f6f7',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ color: '#dc3545', fontSize: '18px' }}>Error: {error}</div>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            background: '#008060',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRoutes shop={shop} />
    </BrowserRouter>
  );
};

const AppRoutes = ({ shop }) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/') {
      return true;
    }
    return location.pathname === path;
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Languages', path: '/languages' },
    { label: 'Translation Editor', path: '/editor' },
    { label: 'Widget', path: '/widget' },
    { label: 'Settings', path: '/settings' },
    { label: 'Billing', path: '/billing' },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#f6f6f7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        width: '240px',
        backgroundColor: '#fafafa',
        borderRight: '1px solid #e3e3e3',
        padding: '16px 0',
        flexShrink: 0
      }}>
        <div style={{ padding: '0 16px 16px', borderBottom: '1px solid #e3e3e3', marginBottom: '16px' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#1a1a1a' }}>LinguaShop</h1>
        </div>
        
        <nav>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              replace={isActive(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 16px',
                color: isActive(item.path) ? '#008060' : '#1a1a1a',
                backgroundColor: isActive(item.path) ? '#e8f5e9' : 'transparent',
                textDecoration: 'none',
                fontWeight: isActive(item.path) ? '600' : '400',
                fontSize: '14px',
                transition: 'background-color 0.2s',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
        <div style={{ 
          background: 'white', 
          borderBottom: '1px solid #e3e3e3',
          margin: '-24px -24px 24px -24px',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
              {navItems.find(n => isActive(n.path))?.label || 'Dashboard'}
            </h2>
            {isDemo && (
              <span style={{
                padding: '4px 10px',
                background: '#fff3cd',
                color: '#856404',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                Demo Mode
              </span>
            )}
          </div>
          {!isDemo && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px 10px',
              background: '#008060',
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              Active
            </span>
          )}
          {isDemo && shop && shop !== 'demo-store.myshopify.com' && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px 10px',
              background: '#008060',
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {shop}
            </span>
          )}
        </div>

        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard shop={shop} />} />
          <Route path="/languages" element={<Languages shop={shop} />} />
          <Route path="/editor" element={<TranslationEditor shop={shop} />} />
          <Route path="/widget" element={<Widget shop={shop} />} />
          <Route path="/settings" element={<Settings shop={shop} />} />
          <Route path="/billing" element={<Billing shop={shop} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
