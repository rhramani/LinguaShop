import mongoose from 'mongoose';

const usageSchema = new mongoose.Schema({
  shop: { type: String, required: true, lowercase: true },
  month: { type: String, required: true },
  charsUsed: { type: Number, default: 0 },
  wordsTranslated: { type: Number, default: 0 },
  apiCalls: { type: Number, default: 0 },
  limit: { type: Number, default: 500000 },
  warningEmailSent: { type: Boolean, default: false },
  blockedAt: Date,
  lastUpdated: { type: Date, default: Date.now },
});

usageSchema.index({ shop: 1, month: 1 }, { unique: true });

usageSchema.statics.getCurrentMonth = function() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

usageSchema.statics.getOrCreate = async function(shop, limit = 500000) {
  const currentMonth = this.getCurrentMonth();
  let usage = await this.findOne({ shop, month: currentMonth });
  
  if (!usage) {
    usage = new this({ shop, month: currentMonth, charsUsed: 0, wordsTranslated: 0, apiCalls: 0, limit });
    await usage.save();
  }
  
  return usage;
};

usageSchema.methods.getPercentage = function() {
  return Math.round((this.charsUsed / this.limit) * 100);
};

usageSchema.methods.getRemaining = function() {
  return Math.max(0, this.limit - this.charsUsed);
};

usageSchema.methods.isBlocked = function() {
  return this.charsUsed >= this.limit;
};

const Usage = mongoose.model('Usage', usageSchema);

export default Usage;
