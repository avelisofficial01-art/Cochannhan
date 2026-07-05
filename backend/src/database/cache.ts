/**
 * Redis Cache Service
 * Cung cấp các helper để cache dữ liệu thường truy cập:
 * - Player Profile
 * - Game Config
 * - NPC Dialogue (sprint sau)
 */

import { getRedisClient } from '../database/redis.js';

const DEFAULT_TTL = 300; // 5 minutes

async function getClient(): Promise<ReturnType<typeof getRedisClient> | null> {
  try {
    return await getRedisClient();
  } catch {
    return null;
  }
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const redis = await getClient();
  if (!redis) return null;

  try {
    const value = await redis.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds = DEFAULT_TTL,
): Promise<void> {
  const redis = await getClient();
  if (!redis) return;

  try {
    await redis.setEx(key, ttlSeconds, JSON.stringify(value));
  } catch {
    // Cache write failure is non-fatal
  }
}

export async function cacheDelete(key: string): Promise<void> {
  const redis = await getClient();
  if (!redis) return;

  try {
    await redis.del(key);
  } catch {
    // Non-fatal
  }
}

export async function cacheInvalidatePattern(pattern: string): Promise<void> {
  const redis = await getClient();
  if (!redis) return;

  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch {
    // Non-fatal
  }
}

// Key builders
export const CacheKeys = {
  playerProfile: (accountId: string) => `player:profile:${accountId}`,
  playerStats: (accountId: string) => `player:stats:${accountId}`,
  gameConfig: (key: string) => `config:${key}`,
  allGameConfig: () => 'config:all',
} as const;
