export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false, googleCode: 'en' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false, googleCode: 'es' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false, googleCode: 'fr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false, googleCode: 'de' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', rtl: false, googleCode: 'it' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', rtl: false, googleCode: 'pt' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', rtl: false, googleCode: 'nl' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', rtl: false, googleCode: 'pl' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', rtl: false, googleCode: 'ru' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', rtl: false, googleCode: 'ja' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', rtl: false, googleCode: 'ko' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳', rtl: false, googleCode: 'zh-CN' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', flag: '🇹🇼', rtl: false, googleCode: 'zh-TW' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true, googleCode: 'ar' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', rtl: false, googleCode: 'hi' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', rtl: false, googleCode: 'tr' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', rtl: false, googleCode: 'vi' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', rtl: false, googleCode: 'th' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', rtl: false, googleCode: 'id' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', rtl: false, googleCode: 'ms' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', rtl: true, googleCode: 'he' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', rtl: false, googleCode: 'uk' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', rtl: false, googleCode: 'cs' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', rtl: false, googleCode: 'el' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', rtl: false, googleCode: 'ro' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', rtl: false, googleCode: 'hu' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', rtl: false, googleCode: 'sv' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', rtl: false, googleCode: 'da' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', rtl: false, googleCode: 'fi' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', rtl: false, googleCode: 'no' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰', rtl: false, googleCode: 'sk' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬', rtl: false, googleCode: 'bg' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷', rtl: false, googleCode: 'hr' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', flag: '🇷🇸', rtl: false, googleCode: 'sr' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮', rtl: false, googleCode: 'sl' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪', rtl: false, googleCode: 'et' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻', rtl: false, googleCode: 'lv' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹', rtl: false, googleCode: 'lt' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', rtl: true, googleCode: 'fa' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', rtl: true, googleCode: 'ur' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', rtl: false, googleCode: 'bn' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', rtl: false, googleCode: 'ta' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', rtl: false, googleCode: 'te' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', rtl: false, googleCode: 'mr' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', rtl: false, googleCode: 'gu' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', rtl: false, googleCode: 'kn' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', rtl: false, googleCode: 'ml' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', rtl: false, googleCode: 'pa' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', rtl: false, googleCode: 'sw' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦', rtl: false, googleCode: 'af' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', flag: '🇦🇱', rtl: false, googleCode: 'sq' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', rtl: false, googleCode: 'am' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն', flag: '🇦🇲', rtl: false, googleCode: 'hy' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', flag: '🇦🇿', rtl: false, googleCode: 'az' },
  { code: 'ba', name: 'Bashkir', nativeName: 'Башҡорт', flag: '🇷🇺', rtl: false, googleCode: 'ba' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskara', flag: '🇪🇸', rtl: false, googleCode: 'eu' },
  { code: 'be', name: 'Belarusian', nativeName: 'Беларуская', flag: '🇧🇾', rtl: false, googleCode: 'be' },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski', flag: '🇧🇦', rtl: false, googleCode: 'bs' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', flag: '🇪🇸', rtl: false, googleCode: 'ca' },
  { code: 'ceb', name: 'Cebuano', nativeName: 'Cebuano', flag: '🇵🇭', rtl: false, googleCode: 'ceb' },
  { code: 'ny', name: 'Chichewa', nativeName: 'Chichewa', flag: '🇲🇼', rtl: false, googleCode: 'ny' },
  { code: 'co', name: 'Corsican', nativeName: 'Corsu', flag: '🇫🇷', rtl: false, googleCode: 'co' },
  { code: 'ht', name: 'Haitian Creole', nativeName: 'Kreyòl ayisyen', flag: '🇭🇹', rtl: false, googleCode: 'ht' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬', rtl: false, googleCode: 'ha' },
  { code: 'haw', name: 'Hawaiian', nativeName: 'Hawaiian', flag: '🇺🇸', rtl: false, googleCode: 'haw' },
  { code: 'iw', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', rtl: true, googleCode: 'iw' },
  { code: 'hmn', name: 'Hmong', nativeName: 'Hmong', flag: '🇱🇦', rtl: false, googleCode: 'hmn' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', flag: '🇳🇬', rtl: false, googleCode: 'ig' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', flag: '🇮🇪', rtl: false, googleCode: 'ga' },
  { code: 'jw', name: 'Javanese', nativeName: 'Jawa', flag: '🇮🇩', rtl: false, googleCode: 'jw' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ', flag: '🇰🇿', rtl: false, googleCode: 'kk' },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ', flag: '🇰🇭', rtl: false, googleCode: 'km' },
  { code: 'ku', name: 'Kurdish', nativeName: 'Kurdî', flag: '🇮🇷', rtl: true, googleCode: 'ku' },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча', flag: '🇰🇬', rtl: false, googleCode: 'ky' },
  { code: 'lo', name: 'Lao', nativeName: 'ลาว', flag: '🇱🇦', rtl: false, googleCode: 'lo' },
  { code: 'la', name: 'Latin', nativeName: 'Latina', flag: '🇻🇦', rtl: false, googleCode: 'la' },
  { code: 'lb', name: 'Luxembourgish', nativeName: 'Lëtzebuergesch', flag: '🇱🇺', rtl: false, googleCode: 'lb' },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски', flag: '🇲🇰', rtl: false, googleCode: 'mk' },
  { code: 'mg', name: 'Malagasy', nativeName: 'Malagasy', flag: '🇲🇬', rtl: false, googleCode: 'mg' },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti', flag: '🇲🇹', rtl: false, googleCode: 'mt' },
  { code: 'mi', name: 'Maori', nativeName: 'Māori', flag: '🇳🇿', rtl: false, googleCode: 'mi' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол', flag: '🇲🇳', rtl: false, googleCode: 'mn' },
  { code: 'my', name: 'Myanmar', nativeName: 'မြန်မာ', flag: '🇲🇲', rtl: false, googleCode: 'my' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵', rtl: false, googleCode: 'ne' },
  { code: 'ps', name: 'Pashto', nativeName: 'پښتو', flag: '🇦🇫', rtl: true, googleCode: 'ps' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', flag: '🇧🇷', rtl: false, googleCode: 'pt-BR' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', flag: '🇵🇰', rtl: true, googleCode: 'sd' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰', rtl: false, googleCode: 'si' },
  { code: 'sm', name: 'Samoan', nativeName: 'Gagana Samoa', flag: '🇼🇸', rtl: false, googleCode: 'sm' },
  { code: 'gd', name: 'Scottish Gaelic', nativeName: 'Gàidhlig', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', rtl: false, googleCode: 'gd' },
  { code: 'st', name: 'Sesotho', nativeName: 'Sesotho', flag: '🇱🇸', rtl: false, googleCode: 'st' },
  { code: 'sn', name: 'Shona', nativeName: 'Shona', flag: '🇿🇼', rtl: false, googleCode: 'sn' },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali', flag: '🇸🇴', rtl: false, googleCode: 'so' },
  { code: 'su', name: 'Sundanese', nativeName: 'Sunda', flag: '🇮🇩', rtl: false, googleCode: 'su' },
  { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ', flag: '🇹🇯', rtl: false, googleCode: 'tg' },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbek', flag: '🇺🇿', rtl: false, googleCode: 'uz' },
  { code: 'yi', name: 'Yiddish', nativeName: 'ייִדיש', flag: '🇺🇸', rtl: true, googleCode: 'yi' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬', rtl: false, googleCode: 'yo' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦', rtl: false, googleCode: 'zu' },
  { code: 'fil', name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭', rtl: false, googleCode: 'fil' },
  { code: 'tl', name: 'Tagalog', nativeName: 'Tagalog', flag: '🇵🇭', rtl: false, googleCode: 'tl' },
];

export const DEMO_TRANSLATIONS = {
  'Hello': 'Hola',
  'Welcome': 'Bienvenido',
  'Add to Cart': 'Añadir al carrito',
  'Buy Now': 'Comprar ahora',
  'Shop': 'Tienda',
  'Products': 'Productos',
  'Sale': 'Oferta',
  'New': 'Nuevo',
  'Free Shipping': 'Envío gratis',
  'Best Price': 'Mejor precio',
  'Quality': 'Calidad',
  'Save': 'Guardar',
  'Cart': 'Carrito',
  'Checkout': 'Pagar',
  'Account': 'Cuenta',
  'Login': 'Iniciar sesión',
  'Register': 'Registrarse',
  'Search': 'Buscar',
  'Menu': 'Menú',
  'Close': 'Cerrar',
  'Price': 'Precio',
  'Sale Price': 'Precio de oferta',
  'In Stock': 'En stock',
  'Out of Stock': 'Agotado',
  'Add to Wishlist': 'Añadir a favoritos',
  'View Details': 'Ver detalles',
  'Continue Shopping': 'Continuar comprando',
  'Proceed to Checkout': 'Proceder al pago',
  'Subtotal': 'Subtotal',
  'Total': 'Total',
  'Quantity': 'Cantidad',
  'Size': 'Talla',
  'Color': 'Color',
  'Reviews': 'Reseñas',
  'Description': 'Descripción',
  'Features': 'Características',
  'Related Products': 'Productos relacionados',
  'Recently Viewed': 'Vistos recientemente',
};

export const getDemoTranslation = (text, targetLang) => {
  if (!text) return '';
  
  let translated = text;
  
  for (const [eng, translation] of Object.entries(DEMO_TRANSLATIONS)) {
    const regex = new RegExp(`\\b${eng}\\b`, 'gi');
    translated = translated.replace(regex, translation);
  }
  
  if (translated === text) {
    const langPrefixes = {
      'es': '¡',
      'fr': '',
      'de': '',
      'it': '',
      'pt': '',
      'ja': '',
      'ko': '',
      'zh': '',
      'ar': '',
      'hi': '',
    };
    translated = `[${targetLang.toUpperCase()}] ${text}`;
  }
  
  return translated;
};

export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export const formatPercentage = (used, limit) => {
  if (!limit) return 0;
  return Math.round((used / limit) * 100);
};

export const getUsageColor = (percentage) => {
  if (percentage >= 100) return '#dc3545';
  if (percentage >= 80) return '#ffc107';
  if (percentage >= 50) return '#17a2b8';
  return '#28a745';
};

export default SUPPORTED_LANGUAGES;
