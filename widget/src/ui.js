(function() {
  'use strict';

  const LinguaShopUI = {
    widget: null,
    button: null,
    popup: null,
    searchInput: null,
    languageList: null,
    isOpen: false,
    config: {},
    languages: [],
    onLanguageChange: null,

    createWidget(config) {
      this.config = {
        position: 'bottom-right',
        color: '#008060',
        textColor: '#ffffff',
        theme: 'light',
        size: 'medium',
        showFlags: true,
        showNativeNames: true,
        ...config
      };

      this.destroy();

      this.widget = document.createElement('div');
      this.widget.id = 'linguashop-widget';
      this.widget.className = 'linguashop-widget';
      this.widget.innerHTML = this.renderStyles() + this.renderHTML();
      document.body.appendChild(this.widget);

      this.button = document.getElementById('linguashop-button');
      this.popup = document.getElementById('linguashop-popup');
      this.searchInput = document.getElementById('linguashop-search');
      this.languageList = document.getElementById('linguashop-languages');

      this.attachEventListeners();
      this.applyPosition();

      return this.widget;
    },

    renderStyles() {
      const sizes = {
        small: { button: '44px', popup: '220px', fontSize: '12px' },
        medium: { button: '52px', popup: '240px', fontSize: '14px' },
        large: { button: '60px', popup: '260px', fontSize: '16px' }
      };

      const s = sizes[this.config.size] || sizes.medium;

      return `
        <style id="linguashop-styles">
          #linguashop-widget * {
            box-sizing: border-box !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif !important;
          }

          .linguashop-widget {
            position: fixed !important;
            z-index: 2147483647 !important;
            font-size: ${s.fontSize} !important;
          }

          .linguashop-widget.position-bottom-right {
            bottom: 20px !important;
            right: 20px !important;
          }

          .linguashop-widget.position-bottom-left {
            bottom: 20px !important;
            left: 20px !important;
          }

          .linguashop-widget.position-top-right {
            top: 20px !important;
            right: 20px !important;
          }

          .linguashop-widget.position-top-left {
            top: 20px !important;
            left: 20px !important;
          }

          #linguashop-button {
            width: ${s.button} !important;
            height: ${s.button} !important;
            border-radius: 50% !important;
            background-color: ${this.config.color} !important;
            border: none !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12) !important;
            transition: transform 0.2s ease, box-shadow 0.2s ease !important;
            outline: none !important;
          }

          #linguashop-button:hover {
            transform: scale(1.05) !important;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2), 0 3px 6px rgba(0, 0, 0, 0.15) !important;
          }

          #linguashop-button:active {
            transform: scale(0.95) !important;
          }

          #linguashop-button svg {
            width: 60% !important;
            height: 60% !important;
            fill: ${this.config.textColor} !important;
          }

          #linguashop-popup {
            position: absolute !important;
            width: ${s.popup} !important;
            background: #ffffff !important;
            border-radius: 12px !important;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1) !important;
            padding: 0 !important;
            margin-bottom: 10px !important;
            display: none !important;
            overflow: hidden !important;
            opacity: 0 !important;
            transform: translateY(10px) !important;
            transition: opacity 0.2s ease, transform 0.2s ease !important;
          }

          .linguashop-widget.position-bottom-right #linguashop-popup,
          .linguashop-widget.position-bottom-left #linguashop-popup {
            bottom: calc(${s.button} + 10px) !important;
          }

          .linguashop-widget.position-top-right #linguashop-popup,
          .linguashop-widget.position-top-left #linguashop-popup {
            top: calc(${s.button} + 10px) !important;
          }

          .linguashop-widget.position-bottom-right #linguashop-popup,
          .linguashop-widget.position-top-right #linguashop-popup {
            right: 0 !important;
          }

          .linguashop-widget.position-bottom-left #linguashop-popup,
          .linguashop-widget.position-top-left #linguashop-popup {
            left: 0 !important;
          }

          #linguashop-popup.open {
            display: block !important;
            opacity: 1 !important;
            transform: translateY(0) !important;
          }

          .linguashop-popup-header {
            padding: 16px !important;
            border-bottom: 1px solid #e8e8e8 !important;
            font-weight: 600 !important;
            color: #1a1a1a !important;
            font-size: inherit !important;
          }

          #linguashop-search {
            width: 100% !important;
            padding: 12px 16px !important;
            border: none !important;
            border-bottom: 1px solid #e8e8e8 !important;
            font-size: inherit !important;
            outline: none !important;
            background: #f9f9f9 !important;
          }

          #linguashop-search:focus {
            background: #ffffff !important;
          }

          #linguashop-search::placeholder {
            color: #999 !important;
          }

          #linguashop-languages {
            max-height: 300px !important;
            overflow-y: auto !important;
            padding: 8px 0 !important;
            margin: 0 !important;
            list-style: none !important;
          }

          #linguashop-languages::-webkit-scrollbar {
            width: 6px !important;
          }

          #linguashop-languages::-webkit-scrollbar-track {
            background: #f1f1f1 !important;
          }

          #linguashop-languages::-webkit-scrollbar-thumb {
            background: #ccc !important;
            border-radius: 3px !important;
          }

          .linguashop-lang-item {
            padding: 12px 16px !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            transition: background-color 0.15s ease !important;
            color: #1a1a1a !important;
          }

          .linguashop-lang-item:hover {
            background-color: #f5f5f5 !important;
          }

          .linguashop-lang-item.active {
            background-color: #e8f5e9 !important;
            font-weight: 500 !important;
          }

          .linguashop-lang-item.active::before {
            content: '✓' !important;
            font-size: 12px !important;
            color: ${this.config.color} !important;
            margin-right: -8px !important;
          }

          .linguashop-lang-flag {
            font-size: 20px !important;
            line-height: 1 !important;
          }

          .linguashop-lang-name {
            flex: 1 !important;
          }

          .linguashop-lang-native {
            color: #666 !important;
            font-size: 0.9em !important;
          }

          .linguashop-current-lang {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
          }

          @media (max-width: 480px) {
            .linguashop-widget {
              bottom: 15px !important;
              right: 15px !important;
            }

            #linguashop-button {
              width: 48px !important;
              height: 48px !important;
            }
          }

          .linguashop-no-results {
            padding: 20px !important;
            text-align: center !important;
            color: #999 !important;
          }
        </style>
      `;
    },

    renderHTML() {
      return `
        <button id="linguashop-button" aria-label="Change language">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.87 15.07c-.33-.36-.61-.78-.83-1.25-.22-.47-.38-1-.47-1.57H6.5a7.51 7.51 0 0 0 1.57 3.07c.4.56.9 1.06 1.47 1.49-.09.21-.19.42-.3.62-.11.2-.24.39-.37.57-.13.18-.28.35-.43.51-.15.16-.31.31-.48.45-.17.14-.35.27-.54.39-.19.12-.38.23-.59.33-.21.1-.42.19-.64.26-.22.07-.45.13-.69.18s-.48.09-.73.11c-.25.02-.5.03-.76.03-.26 0-.51-.01-.76-.03-.25-.02-.49-.06-.73-.11-.24-.05-.47-.11-.69-.18-.22-.07-.43-.16-.64-.26s-.4-.21-.59-.33c-.19-.12-.37-.25-.54-.39-.17-.14-.33-.29-.48-.45-.15-.16-.3-.33-.43-.51-.13-.18-.26-.37-.37-.57-.11-.2-.21-.41-.3-.62.57-.43 1.07-.93 1.47-1.49.51-.72.91-1.52 1.17-2.37.11.57.25 1.1.47 1.57.22.47.5.89.83 1.25.33.36.72.68 1.16.96.44.28.94.51 1.5.69.56.18 1.18.32 1.87.42V24c-.69-.1-1.31-.24-1.87-.42-.56-.18-1.06-.41-1.5-.69-.44-.28-.83-.6-1.16-.96-.33-.36-.61-.78-.83-1.25-.22-.47-.38-1-.47-1.57h4.67c.09.57.25 1.1.47 1.57.33.36.72.68 1.16.96.44.28.94.51 1.5.69.56.18 1.18.32 1.87.42v-3.04c-.69-.1-1.31-.24-1.87-.42-.56-.18-1.06-.41-1.5-.69-.44-.28-.83-.6-1.16-.96zM12 1.5c-1.93 0-3.68.78-4.95 2.05l1.41 1.41A4.986 4.986 0 0 1 10 4.5c0 1.12.37 2.15 1 3.03L9.5 9a3.003 3.003 0 0 0-2 2.83V12.5h2v-.67a3.003 3.003 0 0 0 2-2.83l1.5-1.5a5.002 5.002 0 0 0 4.45 2.63c.28 0 .55-.02.83-.07A4.979 4.979 0 0 0 17.5 4.5c0-1.38-.56-2.63-1.47-3.53l1.41-1.41A6.984 6.984 0 0 0 12 1.5z"/>
          </svg>
        </button>
        <div id="linguashop-popup">
          <div class="linguashop-popup-header">
            Select Language
          </div>
          <input type="text" id="linguashop-search" placeholder="Search languages..." />
          <ul id="linguashop-languages"></ul>
        </div>
      `;
    },

    attachEventListeners() {
      if (this.button) {
        this.button.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggle();
        });
      }

      if (this.searchInput) {
        this.searchInput.addEventListener('input', (e) => {
          this.filterLanguages(e.target.value);
        });

        this.searchInput.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }

      document.addEventListener('click', (e) => {
        if (this.isOpen && !this.popup.contains(e.target) && !this.button.contains(e.target)) {
          this.close();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });
    },

    applyPosition() {
      if (this.widget && this.config.position) {
        this.widget.className = `linguashop-widget position-${this.config.position}`;
      }
    },

    setLanguages(languages, currentLang = null) {
      this.languages = languages || [];
      this.renderLanguageList(currentLang);
    },

    renderLanguageList(currentLang = null) {
      if (!this.languageList) return;

      this.languageList.innerHTML = '';

      if (this.languages.length === 0) {
        this.languageList.innerHTML = '<li class="linguashop-no-results">No languages available</li>';
        return;
      }

      this.languages.forEach(lang => {
        const li = document.createElement('li');
        li.className = 'linguashop-lang-item' + (currentLang === lang.code ? ' active' : '');
        li.dataset.code = lang.code;

        let html = '';

        if (this.config.showFlags && lang.flag) {
          html += `<span class="linguashop-lang-flag">${lang.flag}</span>`;
        }

        if (this.config.showNativeNames && lang.nativeName && lang.nativeName !== lang.name) {
          html += `
            <div class="linguashop-lang-name">
              <div class="linguashop-current-lang">
                ${lang.name}
                <span class="linguashop-lang-native">${lang.nativeName}</span>
              </div>
            </div>
          `;
        } else {
          html += `<span class="linguashop-lang-name">${lang.name}</span>`;
        }

        li.innerHTML = html;

        li.addEventListener('click', () => {
          this.selectLanguage(lang);
        });

        this.languageList.appendChild(li);
      });
    },

    filterLanguages(query) {
      const items = this.languageList.querySelectorAll('.linguashop-lang-item');
      const lowerQuery = query.toLowerCase().trim();

      items.forEach(item => {
        const lang = this.languages.find(l => l.code === item.dataset.code);
        if (!lang) return;

        const matchesName = lang.name.toLowerCase().includes(lowerQuery);
        const matchesNative = lang.nativeName.toLowerCase().includes(lowerQuery);
        const matchesCode = lang.code.toLowerCase().includes(lowerQuery);

        if (matchesName || matchesNative || matchesCode) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });

      const visibleItems = Array.from(items).filter(item => item.style.display !== 'none');
      const noResults = this.languageList.querySelector('.linguashop-no-results');

      if (visibleItems.length === 0 && !noResults) {
        const li = document.createElement('li');
        li.className = 'linguashop-no-results';
        li.textContent = 'No languages found';
        this.languageList.appendChild(li);
      } else if (visibleItems.length > 0 && noResults) {
        noResults.remove();
      }
    },

    selectLanguage(lang) {
      if (this.onLanguageChange) {
        this.onLanguageChange(lang);
      }
      this.close();
    },

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    },

    open() {
      if (!this.popup) return;

      this.isOpen = true;
      this.popup.classList.add('open');

      if (this.searchInput) {
        setTimeout(() => {
          this.searchInput.focus();
        }, 100);
      }
    },

    close() {
      if (!this.popup) return;

      this.isOpen = false;
      this.popup.classList.remove('open');

      if (this.searchInput) {
        this.searchInput.value = '';
        this.filterLanguages('');
      }
    },

    updateConfig(config) {
      this.config = { ...this.config, ...config };
      
      if (this.widget) {
        const oldStyles = document.getElementById('linguashop-styles');
        if (oldStyles) oldStyles.remove();
        
        this.widget.innerHTML = this.renderStyles() + this.renderHTML();
        
        this.button = document.getElementById('linguashop-button');
        this.popup = document.getElementById('linguashop-popup');
        this.searchInput = document.getElementById('linguashop-search');
        this.languageList = document.getElementById('linguashop-languages');
        
        this.attachEventListeners();
        this.applyPosition();
        this.renderLanguageList();
      }
    },

    setActiveLanguage(code) {
      if (!this.languageList) return;

      const items = this.languageList.querySelectorAll('.linguashop-lang-item');
      items.forEach(item => {
        if (item.dataset.code === code) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    },

    destroy() {
      if (this.widget) {
        this.widget.remove();
        this.widget = null;
      }
      this.button = null;
      this.popup = null;
      this.searchInput = null;
      this.languageList = null;
      this.isOpen = false;

      const styles = document.getElementById('linguashop-styles');
      if (styles) styles.remove();
    },

    init(config, languages, onLanguageChange) {
      this.config = config || {};
      this.languages = languages || [];
      this.onLanguageChange = onLanguageChange || null;

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.createWidget(this.config);
          this.setLanguages(this.languages);
        });
      } else {
        this.createWidget(this.config);
        this.setLanguages(this.languages);
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.LinguaShopUI = LinguaShopUI;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LinguaShopUI;
  }
})();
