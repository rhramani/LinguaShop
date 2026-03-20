import { useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, getDemoTranslation, DEMO_TRANSLATIONS } from '../utils/languages';

const TranslationEditor = ({ shop }) => {
  const [languages, setLanguages] = useState([]);
  const [texts, setTexts] = useState([{ original: '', translated: '' }]);
  const [selectedLang, setSelectedLang] = useState('es');
  const [translating, setTranslating] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchLanguages();
    fetchHistory();
  }, [shop]);

  const fetchLanguages = async () => {
    try {
      const res = await fetch(`/api/settings/${shop || 'demo-store.myshopify.com'}/languages?enabledOnly=true`);
      if (res.ok) {
        const data = await res.json();
        setLanguages(data.languages || SUPPORTED_LANGUAGES.slice(0, 5));
      } else {
        setLanguages(SUPPORTED_LANGUAGES.slice(0, 5));
      }
    } catch (err) {
      setLanguages(SUPPORTED_LANGUAGES.slice(0, 5));
    }
  };

  const fetchHistory = async () => {
    setHistory([
      { original: 'Hello', translated: 'Hola', targetLang: 'es' },
      { original: 'Welcome', translated: 'Bienvenido', targetLang: 'es' },
      { original: 'Add to Cart', translated: 'Añadir al carrito', targetLang: 'es' },
      { original: 'Shop Now', translated: 'Comprar ahora', targetLang: 'es' },
    ]);
  };

  const handleTranslate = async () => {
    const textsWithContent = texts.filter(t => t.original.trim());
    if (textsWithContent.length === 0) {
      alert('Please enter some text to translate');
      return;
    }
    
    setTranslating(true);
    console.log('Starting translation for:', textsWithContent.length, 'texts');
    
    try {
      const results = [];
      const token = localStorage.getItem('linguashop_token') || 'demo';
      
      for (const text of textsWithContent) {
        console.log('Translating:', text.original, 'to', selectedLang);
        
        try {
          const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text: text.original, targetLang: selectedLang })
          });
          
          console.log('Response status:', res.status);
          
          if (res.ok) {
            const data = await res.json();
            console.log('Translation result:', data.translated);
            results.push({ ...text, translated: data.translated || text.original });
          } else {
            console.log('API error, using fallback');
            results.push({ ...text, translated: getDemoTranslation(text.original, selectedLang) });
          }
        } catch (err) {
          console.error('Fetch error:', err);
          results.push({ ...text, translated: getDemoTranslation(text.original, selectedLang) });
        }
      }
      
      setTexts(results);
      
      const newHistory = results.map(t => ({
        original: t.original,
        translated: t.translated,
        targetLang: selectedLang
      }));
      
      setHistory(prev => [...newHistory, ...prev].slice(0, 20));
    } catch (err) {
      console.error('Translation error:', err);
    }
    
    setTranslating(false);
  };

  const handleAddText = () => {
    setTexts([...texts, { original: '', translated: '' }]);
  };

  const handleRemoveText = (index) => {
    if (texts.length > 1) {
      setTexts(texts.filter((_, i) => i !== index));
    }
  };

  const handleTextChange = (index, field, value) => {
    const newTexts = [...texts];
    newTexts[index][field] = value;
    setTexts(newTexts);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '600' }}>Translation Editor</h1>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Manually edit and override translations.
        </p>
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e3e3e3' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Translate Text</h3>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #e3e3e3',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {texts.map((text, index) => (
          <div key={index} style={{ marginBottom: '20px', padding: '16px', background: '#f9f9f9', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#666' }}>Text {index + 1}</span>
              {texts.length > 1 && (
                <button
                  onClick={() => handleRemoveText(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc3545',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Remove
                </button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Original</label>
                <textarea
                  value={text.original}
                  onChange={(e) => handleTextChange(index, 'original', e.target.value)}
                  placeholder="Enter text to translate..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e3e3e3',
                    borderRadius: '4px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Translated</label>
                <textarea
                  value={text.translated}
                  onChange={(e) => handleTextChange(index, 'translated', e.target.value)}
                  placeholder="Translation will appear here..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e3e3e3',
                    borderRadius: '4px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={handleAddText}
            style={{
              padding: '8px 16px',
              background: 'white',
              border: '1px solid #e3e3e3',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Add Text
          </button>
          <button
            onClick={handleTranslate}
            style={{
              padding: '8px 16px',
              background: '#008060',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: translating ? 'wait' : 'pointer',
              fontSize: '14px'
            }}
          >
            {translating ? 'Translating...' : 'Translate All'}
          </button>
          <button
            onClick={() => setTexts([{ original: '', translated: '' }])}
            style={{
              padding: '8px 16px',
              background: 'none',
              border: 'none',
              color: '#666',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Clear All
          </button>
        </div>
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e3e3e3' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Translation History</h3>
        {history.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {history.map((item, index) => (
              <div key={index} style={{ padding: '12px', background: '#f9f9f9', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.original}</span>
                  <span style={{ fontSize: '12px', color: '#666' }}>{item.targetLang}</span>
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>{item.translated}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            No translation history yet
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationEditor;
