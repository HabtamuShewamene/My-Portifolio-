const memoryCache = new Map();
let redisClient = null;
let redisReady = false;

async function getRedisClient() {
  if (redisReady) return redisClient;
  redisReady = true;

  if (!process.env.REDIS_URL) return null;
  try {
    const { createClient } = await import('redis');
    redisClient = createClient({ url: process.env.REDIS_URL });
    redisClient.on('error', () => {
      redisClient = null;
    });
    await redisClient.connect();
    return redisClient;
  } catch {
    redisClient = null;
    return null;
  }
}

export async function getCache(key) {
  const redis = await getRedisClient();
  if (redis) {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  const found = memoryCache.get(key);
  if (!found) return null;
  if (Date.now() > found.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return found.value;
}

export async function setCache(key, value, ttlSeconds = 60) {
  const redis = await getRedisClient();
  if (redis) {
    await redis.set(key, JSON.stringify(value), { EX: ttlSeconds });
    return;
  }
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}
