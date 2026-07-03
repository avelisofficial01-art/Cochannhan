import { eq, and } from 'drizzle-orm';
import { db } from '../database/connection.js';
import { storyFlags } from '../database/schema/index.js';
import type { StoryFlag } from '@co-dao/shared';

function toCamel(row: typeof storyFlags.$inferSelect): StoryFlag {
  return {
    id: row.id,
    playerId: row.player_id,
    flagKey: row.flag_key,
    flagValue: row.flag_value,
    updatedAt: row.set_at.toISOString(),
  };
}

export async function getPlayerFlags(playerId: string): Promise<StoryFlag[]> {
  const rows = await db
    .select()
    .from(storyFlags)
    .where(eq(storyFlags.player_id, playerId));
  return rows.map(toCamel);
}

export async function getFlag(playerId: string, flagKey: string): Promise<StoryFlag | null> {
  const rows = await db
    .select()
    .from(storyFlags)
    .where(
      and(
        eq(storyFlags.player_id, playerId),
        eq(storyFlags.flag_key, flagKey),
      ),
    )
    .limit(1);
  return rows[0] ? toCamel(rows[0]) : null;
}

export async function setFlag(
  playerId: string,
  flagKey: string,
  flagValue: string,
): Promise<StoryFlag> {
  const existing = await getFlag(playerId, flagKey);
  if (existing) {
    await db
      .update(storyFlags)
      .set({ flag_value: flagValue, set_at: new Date() })
      .where(
        and(
          eq(storyFlags.player_id, playerId),
          eq(storyFlags.flag_key, flagKey),
        ),
      );
    return { ...existing, flagValue, updatedAt: new Date().toISOString() };
  }

  const rows = await db
    .insert(storyFlags)
    .values({ player_id: playerId, flag_key: flagKey, flag_value: flagValue })
    .returning();
  return toCamel(rows[0]);
}

export async function deleteFlag(playerId: string, flagKey: string): Promise<void> {
  await db
    .delete(storyFlags)
    .where(
      and(
        eq(storyFlags.player_id, playerId),
        eq(storyFlags.flag_key, flagKey),
      ),
    );
}
