import mongoose from 'mongoose';

const languageSchema = new mongoose.Schema({
  shop: { type: String, required: true, lowercase: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  nativeName: { type: String, required: true },
  flag: { type: String, default: '' },
  rtl: { type: Boolean, default: false },
  enabled: { type: Boolean, default: false },
  isDefault: { type: Boolean, default: false },
  locale: { type: String },
  sortOrder: { type: Number, default: 0 },
  manualOverrides: [{
    originalText: String,
    translatedText: String,
    updatedAt: Date,
  }],
});

languageSchema.index({ shop: 1, code: 1 }, { unique: true });
languageSchema.index({ shop: 1, enabled: 1 });

languageSchema.statics.SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', rtl: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', rtl: false },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', rtl: false },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', rtl: false },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', rtl: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', rtl: false },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', rtl: false },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', rtl: false },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', rtl: false },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', rtl: false },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', rtl: false },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', rtl: false },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', rtl: false },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', rtl: false },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', rtl: true },
];

languageSchema.statics.initializeLanguages = async function(shop) {
  const languages = this.SUPPORTED_LANGUAGES;
  
  const bulkOps = languages.map((lang, index) => ({
    updateOne: {
      filter: { shop, code: lang.code },
      update: {
        $setOnInsert: {
          ...lang,
          shop,
          enabled: index < 3,
          isDefault: index === 0,
          sortOrder: index,
        }
      },
      upsert: true,
    },
  }));
  
  await this.bulkWrite(bulkOps);
};

languageSchema.statics.getEnabledLanguages = async function(shop) {
  return this.find({ shop, enabled: true }).sort({ sortOrder: 1 });
};

const Language = mongoose.model('Language', languageSchema);

export default Language;
