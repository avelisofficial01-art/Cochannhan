import { eq } from 'drizzle-orm';
import { db } from '../database/connection.js';
import { gameConfig } from '../database/schema/index.js';
import { cacheGet, cacheSet, CacheKeys } from '../database/cache.js';
import type { GameConfigKey } from '@co-dao/shared';

export type GameConfigRow = typeof gameConfig.$inferSelect;

async function getConfigValue(key: GameConfigKey | string): Promise<string | null> {
  // Try cache first
  const cacheKey = CacheKeys.gameConfig(key);
  const cached = await cacheGet<string>(cacheKey);
  if (cached !== null) return cached;

  const [row] = await db
    .select()
    .from(gameConfig)
    .where(eq(gameConfig.key, key));

  if (!row) return null;

  await cacheSet(cacheKey, row.value);
  return row.value;
}

async function getConfigNumber(
  key: GameConfigKey | string,
  defaultValue: number,
): Promise<number> {
  const value = await getConfigValue(key);
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
}

async function getConfigBoolean(
  key: GameConfigKey | string,
  defaultValue: boolean,
): Promise<boolean> {
  const value = await getConfigValue(key);
  if (!value) return defaultValue;
  return value === 'true' || value === '1';
}

async function getAllConfigs(): Promise<Record<string, string>> {
  const cacheKey = CacheKeys.allGameConfig();
  const cached = await cacheGet<Record<string, string>>(cacheKey);
  if (cached) return cached;

  const rows = await db.select().from(gameConfig);
  const result: Record<string, string> = {};
  for (const row of rows) {
    result[row.key] = row.value;
  }

  await cacheSet(cacheKey, result);
  return result;
}

async function setConfig(key: string, value: string, description?: string): Promise<void> {
  await db
    .insert(gameConfig)
    .values({ key, value, description: description ?? null })
    .onConflictDoUpdate({
      target: gameConfig.key,
      set: { value, description: description ?? null, updated_at: new Date() },
    });

  // Invalidate cache
  await cacheSet(CacheKeys.gameConfig(key), value);
  await cacheSet(CacheKeys.allGameConfig(), null);
}

export const configRepository = {
  getConfigValue,
  getConfigNumber,
  getConfigBoolean,
  getAllConfigs,
  setConfig,
};
