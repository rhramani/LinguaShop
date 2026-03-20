import { useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES } from '../utils/languages';

const Settings = ({ shop }) => {
  const [settings, setSettings] = useState({
    defaultLang: 'en',
    autoDetectLang: true,
    showFlags: true,
    showNativeNames: true,
    translateProducts: true,
    translateCollections: true,
    translatePages: true,
    translateBlogs: true,
    translateNavigation: true,
    translateFooter: true,
    hreflangEnabled: true,
    enableCache: true,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [shop]);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`/api/settings/${shop || 'demo-store.myshopify.com'}`);
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({ ...prev, ...data.settings }));
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '600' }}>Settings</h1>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Configure your LinguaShop translation settings.
        </p>
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e3e3e3' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>General Settings</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Default Language</label>
            <select
              value={settings.defaultLang}
              onChange={(e) => handleChange('defaultLang', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #e3e3e3',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings.autoDetectLang}
              onChange={(e) => handleChange('autoDetectLang', e.target.checked)}
              style={{ width: '18px', height: '18px' }}
            />
            <div>
              <div style={{ fontWeight: '500' }}>Auto-detect visitor language</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Automatically detect and suggest visitor's language.</div>
            </div>
          </label>
        </div>
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e3e3e3' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Translation Content</h3>
        <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#666' }}>
          Choose which content types to translate.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { key: 'translateProducts', label: 'Products' },
            { key: 'translateCollections', label: 'Collections' },
            { key: 'translatePages', label: 'Pages' },
            { key: 'translateBlogs', label: 'Blog Posts' },
            { key: 'translateNavigation', label: 'Navigation' },
            { key: 'translateFooter', label: 'Footer' },
          ].map(item => (
            <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings[item.key]}
                onChange={(e) => handleChange(item.key, e.target.checked)}
              />
              {item.label}
            </label>
          ))}
        </div>
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e3e3e3' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>SEO Settings</h3>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={settings.hreflangEnabled}
            onChange={(e) => handleChange('hreflangEnabled', e.target.checked)}
            style={{ width: '18px', height: '18px' }}
          />
          <div>
            <div style={{ fontWeight: '500' }}>Enable hreflang tags</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Help search engines understand language versions.</div>
          </div>
        </label>
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e3e3e3' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Performance</h3>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={settings.enableCache}
            onChange={(e) => handleChange('enableCache', e.target.checked)}
            style={{ width: '18px', height: '18px' }}
          />
          <div>
            <div style={{ fontWeight: '500' }}>Enable translation cache</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Cache translations to reduce API calls.</div>
          </div>
        </label>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={handleSave}
          style={{
            padding: '10px 24px',
            background: '#008060',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
        <button
          onClick={fetchSettings}
          style={{
            padding: '10px 24px',
            background: 'white',
            border: '1px solid #e3e3e3',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Settings;
