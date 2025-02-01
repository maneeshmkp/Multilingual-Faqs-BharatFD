import mongoose from 'mongoose';
import { translateWithFallback } from '../services/translationService.js';

const faqSchema = new mongoose.Schema({
  question: {
    en: { type: String, required: true },
    hi: String,
    bn: String
  },
  answer: {
    en: { type: String, required: true },
    hi: String,
    bn: String
  },
  createdAt: { type: Date, default: Date.now }
});

// Auto-translation pre-save hook
faqSchema.pre('save', async function(next) {
  const langs = ['hi', 'bn'];
  
  try {
    for (const lang of langs) {
      if (!this.question[lang]) {
        this.question[lang] = await translateWithFallback(this.question.en, lang);
      }
      if (!this.answer[lang]) {
        this.answer[lang] = await translateWithFallback(this.answer.en, lang);
      }
    }
    next();
  } catch (err) {
    next(err);
  }
});

export const FAQ = mongoose.model('FAQ', faqSchema);