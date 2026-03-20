import { useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES } from '../utils/languages';

const Widget = ({ shop }) => {
  const [installed, setInstalled] = useState(false);
  const [config, setConfig] = useState({
    position: 'bottom-right',
    color: '#008060',
    textColor: '#ffffff',
    size: 'medium',
    showFlags: true,
  });
  const [previewLang, setPreviewLang] = useState('es');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch(`/api/widget/status/${shop || 'demo-store.myshopify.com'}`);
      if (res.ok) {
        const data = await res.json();
        setInstalled(data.installed || false);
      }
    } catch (err) {
      setInstalled(true);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [shop]);

  const handleInstall = async () => {
    setLoading(true);
    setTimeout(() => {
      setInstalled(true);
      setLoading(false);
    }, 1000);
  };

  const handleRemove = async () => {
    setLoading(true);
    setTimeout(() => {
      setInstalled(false);
      setLoading(false);
    }, 1000);
  };

  const getPreviewPosition = () => {
    const positions = {
      'bottom-right': { bottom: '20px', right: '20px' },
      'bottom-left': { bottom: '20px', left: '20px' },
      'top-right': { top: '20px', right: '20px' },
      'top-left': { top: '20px', left: '20px' },
    };
    return positions[config.position] || positions['bottom-right'];
  };

  const buttonSize = config.size === 'small' ? '44px' : config.size === 'large' ? '60px' : '52px';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '600' }}>Widget Settings</h1>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Customize the language switcher widget on your store.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e3e3e3' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Widget Status</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '14px' }}>Status:</span>
            <span style={{
              padding: '4px 8px',
              background: installed ? '#d4edda' : '#f8d7da',
              color: installed ? '#155724' : '#721c24',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {installed ? 'Installed' : 'Not Installed'}
            </span>
          </div>
          {installed ? (
            <button
              onClick={handleRemove}
              disabled={loading}
              style={{
                padding: '8px 16px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'wait' : 'pointer',
                fontSize: '14px'
              }}
            >
              {loading ? 'Removing...' : 'Remove Widget'}
            </button>
          ) : (
            <button
              onClick={handleInstall}
              disabled={loading}
              style={{
                padding: '8px 16px',
                background: '#008060',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'wait' : 'pointer',
                fontSize: '14px'
              }}
            >
              {loading ? 'Installing...' : 'Install Widget'}
            </button>
          )}
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e3e3e3' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Widget Preview</h3>
          <div style={{
            position: 'relative',
            height: '280px',
            background: '#f6f6f7',
            borderRadius: '8px',
            border: '1px solid #e3e3e3',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '20px', opacity: 0.5 }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Your Store Preview</div>
              <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px' }}>Welcome to Our Store</div>
              <div style={{ fontSize: '14px', color: '#666' }}>Shop the latest products...</div>
            </div>
            <div style={{ ...getPreviewPosition(), position: 'absolute' }}>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{
                    width: buttonSize,
                    height: buttonSize,
                    backgroundColor: config.color,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    cursor: 'pointer',
                    border: 'none',
                  }}
                >
                  {config.showFlags ? (
                    <span style={{ fontSize: buttonSize === '44px' ? '18px' : buttonSize === '60px' ? '24px' : '20px' }}>
                      {SUPPORTED_LANGUAGES.find(l => l.code === previewLang)?.flag || '🌐'}
                    </span>
                  ) : (
                    <svg viewBox="0 0 24 24" style={{ width: '60%', height: '60%', fill: config.textColor }}>
                      <path d="M12.87 15.07c-.33-.36-.61-.78-.83-1.25-.22-.47-.38-1-.47-1.57H6.5a7.51 7.51 0 0 0 1.57 3.07c.4.56.9 1.06 1.47 1.49-.09.21-.19.42-.3.62-.11.2-.24.39-.37.57-.13.18-.28.35-.43.51-.15.16-.31.31-.48.45-.17.14-.35.27-.54.39-.19.12-.38.23-.59.33-.21.1-.42.19-.64.26-.22.07-.45.13-.69.18s-.48.09-.73.11c-.25.02-.5.03-.76.03-.26 0-.51-.01-.76-.03-.25-.02-.49-.06-.73-.11-.24-.05-.47-.11-.69-.18-.22-.07-.43-.16-.64-.26s-.4-.21-.59-.33c-.19-.12-.37-.25-.54-.39-.17-.14-.33-.29-.48-.45-.15-.16-.3-.33-.43-.51-.13-.18-.26-.37-.37-.57-.11-.2-.21-.41-.3-.62.57-.43 1.07-.93 1.47-1.49.51-.72.91-1.52 1.17-2.37.11.57.25 1.1.47 1.57.33.36.72.68 1.16.96.44.28.94.51 1.5.69.56.18 1.18.32 1.87.42V24c-.69-.1-1.31-.24-1.87-.42-.56-.18-1.06-.41-1.5-.69-.44-.28-.83-.6-1.16-.96z"/>
                    </svg>
                  )}
                </button>
                
                {showDropdown && (
                  <div style={{
                    position: 'absolute',
                    bottom: '60px',
                    left: config.position.includes('left') ? '0' : 'auto',
                    right: config.position.includes('right') ? '0' : 'auto',
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    padding: '8px',
                    minWidth: '180px',
                    zIndex: 1000,
                  }}>
                    <div style={{ fontSize: '12px', color: '#666', padding: '4px 8px', marginBottom: '4px' }}>Select Language</div>
                    {SUPPORTED_LANGUAGES.slice(0, 12).map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => { setPreviewLang(lang.code); setShowDropdown(false); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          width: '100%',
                          padding: '8px',
                          background: previewLang === lang.code ? '#f0f0f0' : 'transparent',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          textAlign: 'left',
                        }}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e3e3e3' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Widget Configuration</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Position</label>
            <select
              value={config.position}
              onChange={(e) => setConfig({ ...config, position: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #e3e3e3',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="top-right">Top Right</option>
              <option value="top-left">Top Left</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Size</label>
            <select
              value={config.size}
              onChange={(e) => setConfig({ ...config, size: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #e3e3e3',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Button Color</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="color"
                value={config.color}
                onChange={(e) => setConfig({ ...config, color: e.target.value })}
                style={{ width: '40px', height: '36px', padding: '2px', border: '1px solid #e3e3e3', borderRadius: '4px' }}
              />
              <input
                type="text"
                value={config.color}
                onChange={(e) => setConfig({ ...config, color: e.target.value })}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: '1px solid #e3e3e3',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'monospace'
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={config.showFlags}
              onChange={(e) => setConfig({ ...config, showFlags: e.target.checked })}
            />
            Show Flags
          </label>
        </div>

        <button
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#008060',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Widget;
