import { eq } from 'drizzle-orm';
import { db } from '../database/connection.js';
import { combatLogs } from '../database/schema/index.js';

export interface CombatLogRow {
  id: string;
  player_id: string;
  monster_id: string;
  damage: number;
  skill: string | null;
  is_critical: string;
  damage_type: string;
  created_at: Date;
}

export async function createCombatLog(data: {
  playerId: string;
  monsterId: string;
  damage: number;
  skill: string | null;
  isCritical: boolean;
  damageType: string;
}): Promise<CombatLogRow> {
  const [row] = await db
    .insert(combatLogs)
    .values({
      player_id: data.playerId,
      monster_id: data.monsterId,
      damage: data.damage,
      skill: data.skill,
      is_critical: data.isCritical ? 'true' : 'false',
      damage_type: data.damageType,
    })
    .returning();

  return row;
}

export async function getCombatLogsByPlayer(
  playerId: string,
  limit = 50,
): Promise<CombatLogRow[]> {
  return db
    .select()
    .from(combatLogs)
    .where(eq(combatLogs.player_id, playerId))
    .orderBy(combatLogs.created_at)
    .limit(limit);
}
