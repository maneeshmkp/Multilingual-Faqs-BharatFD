import { FAQ } from '../models/faqModel.js';
import { redisClient } from '../config/db.js';

const CACHE_EXPIRATION = 3600; // 1 hour

export const getFAQs = async (req, res) => {
  const lang = req.query.lang || 'en';
  
  try {
    const cacheKey = `faqs:${lang}`;
    const cachedFAQs = await redisClient.get(cacheKey);
    
    if (cachedFAQs) {
      return res.json(JSON.parse(cachedFAQs));
    }

    const faqs = await FAQ.find().lean();
    const localizedFAQs = faqs.map(faq => ({
      question: faq.question[lang] || faq.question.en,
      answer: faq.answer[lang] || faq.answer.en
    }));

    await redisClient.setEx(cacheKey, CACHE_EXPIRATION, JSON.stringify(localizedFAQs));
    res.json(localizedFAQs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFAQ = async (req, res) => {
  try {
    const faq = new FAQ({
      question: { en: req.body.question },
      answer: { en: req.body.answer }
    });
    
    const savedFAQ = await faq.save();
    // Invalidate cache
    await redisClient.del('faqs:*');
    res.status(201).json(savedFAQ);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};