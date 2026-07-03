import { createClient } from 'redis';
import { config } from '../config/index.js';

let redisClient: ReturnType<typeof createClient> | null = null;
let redisSkipped = false;

export async function getRedisClient(): Promise<ReturnType<typeof createClient> | null> {
  if (redisSkipped) return null;

  // In production without REDIS_URL, skip Redis entirely
  if (!process.env.REDIS_URL && config.nodeEnv === 'production') {
    console.warn('[Redis] No REDIS_URL configured — skipping Redis.');
    redisSkipped = true;
    return null;
  }

  if (!redisClient) {
    redisClient = createClient({ url: config.redis.url });
    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err.message);
    });
    try {
      await redisClient.connect();
    } catch {
      console.warn('[Redis] Connection failed — continuing without cache.');
      redisSkipped = true;
      return null;
    }
  }
  return redisClient;
}
