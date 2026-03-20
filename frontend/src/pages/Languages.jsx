import { useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES } from '../utils/languages';

const Languages = ({ shop }) => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLanguages();
  }, [shop]);

  const fetchLanguages = async () => {
    try {
      const token = localStorage.getItem('linguashop_token') || 'demo';
      const headers = { Authorization: `Bearer ${token}` };
      
      const res = await fetch(`/api/settings/${shop || 'demo-store.myshopify.com'}/languages`, { headers });
      if (res.ok) {
        const data = await res.json();
        setLanguages(data.languages || []);
      } else {
        setLanguages(
          SUPPORTED_LANGUAGES.map(lang => ({
            ...lang,
            enabled: ['en', 'es', 'fr'].includes(lang.code),
            isDefault: lang.code === 'en'
          }))
        );
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setLanguages(
        SUPPORTED_LANGUAGES.map(lang => ({
          ...lang,
          enabled: ['en', 'es', 'fr'].includes(lang.code),
          isDefault: lang.code === 'en'
        }))
      );
    }
    setLoading(false);
  };

  const handleToggle = (code) => {
    setLanguages(prev => prev.map(l => 
      l.code === code ? { ...l, enabled: !l.enabled } : l
    ));
  };

  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(search.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(search.toLowerCase()) ||
    lang.code.toLowerCase().includes(search.toLowerCase())
  );

  const enabledCount = languages.filter(l => l.enabled).length;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '600' }}>Languages</h1>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Manage which languages your store can be translated into.
        </p>
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e3e3e3' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <input
            type="text"
            placeholder="Search languages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #e3e3e3',
              borderRadius: '4px',
              fontSize: '14px',
              minWidth: '250px'
            }}
          />
          <span style={{ fontSize: '14px', color: '#666' }}>
            {enabledCount} of {languages.length} enabled
          </span>
        </div>

        <div style={{ border: '1px solid #e3e3e3', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f6f6f7' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Language</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Code</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLanguages.map((lang) => (
                <tr key={lang.code} style={{ borderTop: '1px solid #e3e3e3' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {lang.flag && <span style={{ fontSize: '20px' }}>{lang.flag}</span>}
                      <div>
                        <div style={{ fontWeight: '500' }}>{lang.name}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>{lang.nativeName}</div>
                      </div>
                      {lang.rtl && (
                        <span style={{
                          padding: '2px 6px',
                          background: '#e3e3e3',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '500'
                        }}>
                          RTL
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#666' }}>{lang.code}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '4px 8px',
                      background: lang.enabled ? '#d4edda' : '#f8f9fa',
                      color: lang.enabled ? '#155724' : '#666',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {lang.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    {lang.isDefault && (
                      <span style={{
                        padding: '4px 8px',
                        background: '#d1ecf1',
                        color: '#0c5460',
                        borderRadius: '4px',
                        fontSize: '12px',
                        marginLeft: '4px'
                      }}>
                        Default
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => handleToggle(lang.code)}
                      disabled={lang.isDefault}
                      style={{
                        padding: '6px 12px',
                        background: lang.enabled ? '#f8f9fa' : '#008060',
                        color: lang.enabled ? '#1a1a1a' : 'white',
                        border: lang.enabled ? '1px solid #e3e3e3' : 'none',
                        borderRadius: '4px',
                        cursor: lang.isDefault ? 'not-allowed' : 'pointer',
                        fontSize: '12px',
                        opacity: lang.isDefault ? 0.5 : 1
                      }}
                    >
                      {lang.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLanguages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No languages found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
};

export default Languages;
