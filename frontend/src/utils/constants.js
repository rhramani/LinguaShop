export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', rtl: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', rtl: false },
  { code: 'pt-br', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', flag: '🇧🇷', rtl: false },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', rtl: false },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', rtl: false },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', rtl: false },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', rtl: false },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳', rtl: false },
  { code: 'zh-tw', name: 'Chinese (Traditional)', nativeName: '繁體中文', flag: '🇹🇼', rtl: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', rtl: false },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', rtl: false },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', rtl: false },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', rtl: false },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', rtl: false },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', rtl: false },
];

export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: ['2 languages', '10,000 chars/month', 'Basic widget'],
    limits: { languages: 2, charsPerMonth: 10000 },
  },
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    features: ['10 languages', '50,000 chars/month', 'Widget customization', 'Translation history'],
    limits: { languages: 10, charsPerMonth: 50000 },
    popular: true,
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    price: 24.99,
    features: ['50 languages', '200,000 chars/month', 'Manual editor', 'SEO hreflang', 'Priority support'],
    limits: { languages: 50, charsPerMonth: 200000 },
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 49.99,
    features: ['130+ languages', 'Unlimited chars', 'All features', 'Advanced analytics'],
    limits: { languages: 999, charsPerMonth: 100000000 },
  },
};

export const WIDGET_POSITIONS = [
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'top-left', label: 'Top Left' },
];

export const WIDGET_SIZES = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

export const WIDGET_THEMES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' },
];

export const CONTENT_TYPES = [
  { value: 'products', label: 'Products' },
  { value: 'collections', label: 'Collections' },
  { value: 'pages', label: 'Pages' },
  { value: 'blogs', label: 'Blog Posts' },
  { value: 'navigation', label: 'Navigation' },
  { value: 'footer', label: 'Footer' },
];

export const DEFAULT_WIDGET_CONFIG = {
  position: 'bottom-right',
  color: '#008060',
  textColor: '#ffffff',
  theme: 'light',
  size: 'medium',
  showFlags: true,
  showNativeNames: true,
  autoDetect: true,
};

export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatPercentage = (value, total) => {
  if (total === 0) return '0%';
  return Math.round((value / total) * 100) + '%';
};

export const getUsageColor = (percentage) => {
  if (percentage >= 100) return '#dc3545';
  if (percentage >= 80) return '#ffc107';
  if (percentage >= 50) return '#17a2b8';
  return '#28a745';
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
