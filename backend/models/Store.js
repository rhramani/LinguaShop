import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  shop: { type: String, unique: true, required: true, lowercase: true, trim: true },
  accessToken: { type: String, required: true },
  plan: { type: String, enum: ['free', 'basic', 'growth', 'premium'], default: 'free' },
  isActive: { type: Boolean, default: true },
  installedAt: { type: Date, default: Date.now },
  uninstalledAt: Date,
  scriptTagId: { type: String, default: null },
  shopifyDomain: { type: String },
  shopOwner: { type: String },
  shopEmail: { type: String },
});

storeSchema.index({ shop: 1 });
storeSchema.index({ isActive: 1 });

const Store = mongoose.model('Store', storeSchema);

export default Store;
