import { getCache, setCache } from '../services/cacheService.js';
import { getPortfolioStats } from '../services/statsService.js';

export async function getStats(req, res, next) {
  try {
    const cacheKey = 'portfolio:stats';
    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const stats = await getPortfolioStats();
    const payload = { ok: true, data: stats };
    await setCache(cacheKey, payload, 300);
    return res.json(payload);
  } catch (error) {
    return next(error);
  }
}
