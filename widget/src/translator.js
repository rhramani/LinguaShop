(function() {
  'use strict';

  const LinguaShopTranslator = {
    originalContent: new Map(),
    translatedNodes: new Set(),
    observer: null,
    translateQueue: [],
    isTranslating: false,
    batchSize: 50,
    apiEndpoint: null,

    EXCLUDE_TAGS: [
      'SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'OBJECT', 'EMBED',
      'VIDEO', 'AUDIO', 'CANVAS', 'SVG', 'MATH', 'TEXTAREA', 'INPUT',
      'SELECT', 'OPTION', 'BUTTON', 'CODE', 'PRE', 'KBD', 'SAMP'
    ],

    EXCLUDE_CLASSES: [
      'no-translate', 'translate-ignore', 'lson-ignore', 'notranslate',
      'langshop-ignore', '[data-no-translate]', '.shopify-email-template-*'
    ],

    ATTRS_TO_TRANSLATE: [
      'title', 'alt', 'aria-label', 'aria-placeholder', 'data-tooltip',
      'placeholder'
    ],

    async translatePage(texts, targetLang, shop) {
      if (!texts || texts.length === 0) {
        return [];
      }

      const apiUrl = this.apiEndpoint || '/api/translate';
      
      try {
        const response = await fetch(apiUrl + '/bulk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            texts: texts,
            targetLang: targetLang,
            shop: shop
          })
        });

        if (!response.ok) {
          if (response.status === 402) {
            throw new Error('TRANSLATION_LIMIT_REACHED');
          }
          throw new Error('Translation API error: ' + response.status);
        }

        const data = await response.json();
        
        if (data.limitExceeded) {
          throw new Error('TRANSLATION_LIMIT_REACHED');
        }

        return data.translations || [];
      } catch (error) {
        console.error('LinguaShop: Translation failed', error);
        throw error;
      }
    },

    async translateSingle(text, targetLang, shop) {
      const apiUrl = this.apiEndpoint || '/api/translate';

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text,
            targetLang: targetLang,
            shop: shop
          })
        });

        if (!response.ok) {
          throw new Error('Translation API error: ' + response.status);
        }

        const data = await response.json();
        return data.translated;
      } catch (error) {
        console.error('LinguaShop: Single translation failed', error);
        return text;
      }
    },

    collectTextNodes(element) {
      const textNodes = [];
      const walker = document.createTreeWalker(
        element || document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            if (this.shouldExcludeNode(node)) {
              return NodeFilter.FILTER_REJECT;
            }
            if (node.nodeValue.trim().length === 0) {
              return NodeFilter.FILTER_SKIP;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
      }

      return textNodes;
    },

    shouldExcludeNode(node) {
      const tagName = node.parentElement?.tagName;
      if (tagName && this.EXCLUDE_TAGS.includes(tagName)) {
        return true;
      }

      const className = node.parentElement?.className || '';
      const id = node.parentElement?.id || '';

      for (const pattern of this.EXCLUDE_CLASSES) {
        if (className.includes(pattern) || id.includes(pattern)) {
          return true;
        }
      }

      const hasIgnoreAttr = node.parentElement?.dataset?.noTranslate === '' ||
                           node.parentElement?.getAttribute('translate') === 'no';
      if (hasIgnoreAttr) {
        return true;
      }

      return false;
    },

    async translateContent(targetLang, shop) {
      if (this.isTranslating) {
        return;
      }

      this.isTranslating = true;

      try {
        const textNodes = this.collectTextNodes();
        const texts = [];
        const nodeMap = new Map();

        textNodes.forEach((node, index) => {
          const text = node.nodeValue.trim();
          
          if (text.length > 0 && text.length < 5000) {
            const key = `node_${index}`;
            texts.push(text);
            nodeMap.set(index, { node, originalText: text });
            
            if (!this.originalContent.has(key)) {
              this.originalContent.set(key, text);
            }
            
            node.dataset.linguaShopIndex = key;
          }
        });

        const batches = [];
        for (let i = 0; i < texts.length; i += this.batchSize) {
          batches.push(texts.slice(i, i + this.batchSize));
        }

        for (const batch of batches) {
          try {
            const translations = await this.translatePage(batch, targetLang, shop);
            
            if (translations && translations.length === batch.length) {
              const startIndex = texts.indexOf(batch[0]);
              
              batch.forEach((originalText, i) => {
                const globalIndex = startIndex + i;
                const nodeInfo = nodeMap.get(globalIndex);
                
                if (nodeInfo && translations[i]) {
                  this.applyTranslation(nodeInfo.node, translations[i]);
                  this.translatedNodes.add(nodeInfo.node);
                }
              });
            }
          } catch (error) {
            console.error('LinguaShop: Batch translation failed', error);
          }

          await this.delay(100);
        }

        this.setupMutationObserver(targetLang, shop);

      } catch (error) {
        console.error('LinguaShop: Content translation failed', error);
      } finally {
        this.isTranslating = false;
      }
    },

    applyTranslation(node, translatedText) {
      if (!node || !node.parentElement) return;

      const key = node.dataset.linguaShopIndex;
      if (key) {
        this.originalContent.set(key + '_translated', translatedText);
      }

      node.nodeValue = translatedText;
    },

    restoreOriginalContent() {
      this.originalContent.forEach((value, key) => {
        if (!key.endsWith('_translated')) {
          const translatedKey = key + '_translated';
          const translatedValue = this.originalContent.get(translatedKey);
          
          if (translatedValue) {
            document.querySelectorAll(`[data-lingua-shop-index="${key}"]`).forEach(node => {
              node.nodeValue = value;
            });
          }
        }
      });

      this.translatedNodes.clear();
    },

    setupMutationObserver(targetLang, shop) {
      if (this.observer) {
        this.observer.disconnect();
      }

      this.observer = new MutationObserver((mutations) => {
        const newNodes = [];

        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const textNodes = this.collectTextNodesFromElement(node);
                newNodes.push(...textNodes);
              }
            });
          }
        });

        if (newNodes.length > 0) {
          this.translateNewNodes(newNodes, targetLang, shop);
        }
      });

      this.observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    },

    collectTextNodesFromElement(element) {
      const textNodes = [];
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            if (this.shouldExcludeNode(node)) {
              return NodeFilter.FILTER_REJECT;
            }
            if (node.nodeValue.trim().length === 0) {
              return NodeFilter.FILTER_SKIP;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
      }

      return textNodes;
    },

    async translateNewNodes(nodes, targetLang, shop) {
      const texts = [];
      const nodeMap = new Map();

      nodes.forEach((node, index) => {
        const text = node.nodeValue.trim();
        if (text.length > 0 && text.length < 5000) {
          texts.push(text);
          nodeMap.set(index, node);
        }
      });

      if (texts.length === 0) return;

      try {
        const translations = await this.translatePage(texts, targetLang, shop);

        if (translations && translations.length === texts.length) {
          texts.forEach((originalText, i) => {
            const node = nodeMap.get(i);
            if (node && translations[i]) {
              this.applyTranslation(node, translations[i]);
              this.translatedNodes.add(node);
            }
          });
        }
      } catch (error) {
        console.error('LinguaShop: New nodes translation failed', error);
      }
    },

    setRTLDirection(rtl) {
      const html = document.documentElement;
      if (rtl) {
        html.setAttribute('dir', 'rtl');
        html.setAttribute('lang', 'ar');
      } else {
        html.removeAttribute('dir');
      }
    },

    removeRTLDirection() {
      const html = document.documentElement;
      html.removeAttribute('dir');
    },

    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    destroy() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
      this.originalContent.clear();
      this.translatedNodes.clear();
      this.translateQueue = [];
    },

    async init(apiEndpoint) {
      this.apiEndpoint = apiEndpoint || window.LINGUASHOP_API_URL || '';
    }
  };

  if (typeof window !== 'undefined') {
    window.LinguaShopTranslator = LinguaShopTranslator;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LinguaShopTranslator;
  }
})();
