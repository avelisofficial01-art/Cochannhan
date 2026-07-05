import { eq } from 'drizzle-orm';
import { db } from '../database/connection.js';
import { playerSaves } from '../database/schema/index.js';
import type { PlayerSave } from '@co-dao/shared';

function toCamel(row: typeof playerSaves.$inferSelect): PlayerSave {
  return {
    id: row.id,
    playerId: row.player_id,
    saveName: row.save_name,
    isAuto: row.is_auto,
    saveData: row.save_data as Record<string, unknown>,
    createdAt: row.created_at.toISOString(),
  };
}

export async function getSaves(playerId: string): Promise<PlayerSave[]> {
  const rows = await db
    .select()
    .from(playerSaves)
    .where(eq(playerSaves.player_id, playerId))
    .orderBy(playerSaves.created_at);
  return rows.map(toCamel);
}

export async function getSave(id: string): Promise<PlayerSave | null> {
  const rows = await db
    .select()
    .from(playerSaves)
    .where(eq(playerSaves.id, id))
    .limit(1);
  return rows[0] ? toCamel(rows[0]) : null;
}

export async function createSave(
  playerId: string,
  saveName: string,
  isAuto: boolean,
  saveData: Record<string, unknown>,
): Promise<PlayerSave> {
  // Limit to 5 saves per player (remove oldest if exceeded)
  const existing = await getSaves(playerId);
  if (existing.length >= 5) {
    const toDelete = existing.slice(0, existing.length - 4);
    for (const s of toDelete) {
      await db.delete(playerSaves).where(eq(playerSaves.id, s.id));
    }
  }

  const rows = await db
    .insert(playerSaves)
    .values({
      player_id: playerId,
      save_name: saveName,
      is_auto: isAuto ? 'true' : 'false',
      save_data: saveData,
    })
    .returning();
  return toCamel(rows[0]);
}

export async function deleteSave(id: string): Promise<void> {
  await db.delete(playerSaves).where(eq(playerSaves.id, id));
}
