import { translate } from '@vitalets/google-translate-api';
import { redisClient } from '../config/db.js';

const CACHE_EXPIRATION = 86400; // 24 hours

export const translateWithFallback = async (text, targetLang) => {
  try {
    // Check cache first
    const cacheKey = `translation:${text}:${targetLang}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return cached;

    // Translate and cache
    const { text: translated } = await translate(text, { to: targetLang });
    await redisClient.setEx(cacheKey, CACHE_EXPIRATION, translated);
    return translated;
  } catch (error) {
    console.error(`Translation failed: ${error.message}`);
    return text; // Fallback to original
  }
};