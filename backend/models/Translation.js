import mongoose from 'mongoose';

const translationSchema = new mongoose.Schema({
  shop: { type: String, required: true, lowercase: true },
  textHash: { type: String, required: true },
  sourceText: { type: String, required: true },
  targetLang: { type: String, required: true },
  translatedText: { type: String, required: true },
  charCount: { type: Number, required: true },
  createdAt: { type: Date, expires: 86400, default: Date.now },
});

translationSchema.index({ shop: 1, textHash: 1, targetLang: 1 }, { unique: true });

const Translation = mongoose.model('Translation', translationSchema);

export default Translation;
