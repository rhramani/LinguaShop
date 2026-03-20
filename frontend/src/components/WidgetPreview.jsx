import { useState } from 'react';
import { BlockStack, InlineStack, Select, Button } from '@shopify/polaris';

const WidgetPreview = ({ config, languages }) => {
  const [previewLang, setPreviewLang] = useState('en');

  const getPreviewPosition = () => {
    const positions = {
      'bottom-right': { bottom: '20px', right: '20px' },
      'bottom-left': { bottom: '20px', left: '20px' },
      'top-right': { top: '20px', right: '20px' },
      'top-left': { top: '20px', left: '20px' },
    };
    return positions[config?.position] || positions['bottom-right'];
  };

  const buttonSize = config?.size === 'small' ? '44px' : config?.size === 'large' ? '60px' : '52px';

  return (
    <div
      style={{
        position: 'relative',
        height: '300px',
        background: '#f6f6f7',
        borderRadius: '12px',
        border: '1px solid #e3e3e3',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '20px', opacity: 0.5 }}>
        <p style={{ fontSize: '14px', color: '#6d7175' }}>Store Preview</p>
      </div>

      <div
        style={{
          ...getPreviewPosition(),
          position: 'absolute',
        }}
      >
        <div
          style={{
            width: buttonSize,
            height: buttonSize,
            backgroundColor: config?.color || '#008060',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            style={{
              width: '60%',
              height: '60%',
              fill: config?.textColor || '#ffffff',
            }}
          >
            <path d="M12.87 15.07c-.33-.36-.61-.78-.83-1.25-.22-.47-.38-1-.47-1.57H6.5a7.51 7.51 0 0 0 1.57 3.07c.4.56.9 1.06 1.47 1.49-.09.21-.19.42-.3.62-.11.2-.24.39-.37.57-.13.18-.28.35-.43.51-.15.16-.31.31-.48.45-.17.14-.35.27-.54.39-.19.12-.38.23-.59.33-.21.1-.42.19-.64.26-.22.07-.45.13-.69.18s-.48.09-.73.11c-.25.02-.5.03-.76.03-.26 0-.51-.01-.76-.03-.25-.02-.49-.06-.73-.11-.24-.05-.47-.11-.69-.18-.22-.07-.43-.16-.64-.26s-.4-.21-.59-.33c-.19-.12-.37-.25-.54-.39-.17-.14-.33-.29-.48-.45-.15-.16-.3-.33-.43-.51-.13-.18-.26-.37-.37-.57-.11-.2-.21-.41-.3-.62.57-.43 1.07-.93 1.47-1.49.51-.72.91-1.52 1.17-2.37.11.57.25 1.1.47 1.57.33.36.72.68 1.16.96.44.28.94.51 1.5.69.56.18 1.18.32 1.87.42V24c-.69-.1-1.31-.24-1.87-.42-.56-.18-1.06-.41-1.5-.69-.44-.28-.83-.6-1.16-.96z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default WidgetPreview;
