import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  shop: { type: String, unique: true, required: true, lowercase: true },
  defaultLang: { type: String, default: 'en' },
  widgetPosition: { type: String, default: 'bottom-right' },
  widgetColor: { type: String, default: '#008060' },
  widgetTextColor: { type: String, default: '#ffffff' },
  widgetTheme: { type: String, default: 'light' },
  widgetSize: { type: String, default: 'medium' },
  autoDetectLang: { type: Boolean, default: true },
  showFlags: { type: Boolean, default: true },
  showNativeNames: { type: Boolean, default: true },
  translateCheckout: { type: Boolean, default: false },
  translateProducts: { type: Boolean, default: true },
  translateCollections: { type: Boolean, default: true },
  translatePages: { type: Boolean, default: true },
  translateBlogs: { type: Boolean, default: true },
  translateNavigation: { type: Boolean, default: true },
  translateFooter: { type: Boolean, default: true },
  hreflangEnabled: { type: Boolean, default: true },
  hreflangMode: { type: String, default: 'all' },
  enableCache: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

settingsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

settingsSchema.statics.getSettings = async function(shop) {
  let settings = await this.findOne({ shop });
  if (!settings) {
    settings = new this({ shop });
    await settings.save();
  }
  return settings;
};

settingsSchema.methods.getWidgetConfig = function() {
  return {
    position: this.widgetPosition,
    color: this.widgetColor,
    textColor: this.widgetTextColor,
    theme: this.widgetTheme,
    size: this.widgetSize,
    autoDetect: this.autoDetectLang,
    showFlags: this.showFlags,
    showNativeNames: this.showNativeNames,
  };
};

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
