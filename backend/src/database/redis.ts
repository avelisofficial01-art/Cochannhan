import { createClient } from 'redis';
import { config } from '../config/index.js';

let redisClient: ReturnType<typeof createClient> | null = null;

export async function getRedisClient(): Promise<ReturnType<typeof createClient>> {
  if (!redisClient) {
    redisClient = createClient({ url: config.redis.url });
    redisClient.on('error', (err) => {
      // Redis errors are logged but do not crash the server
      console.error('Redis connection error:', err.message);
    });
    await redisClient.connect();
  }
  return redisClient;
}
