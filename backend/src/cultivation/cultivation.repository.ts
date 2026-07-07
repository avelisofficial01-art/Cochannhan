import { eq } from 'drizzle-orm';
import { db } from '../database/connection.js';
import { cultivationRealms, playerCultivation } from '../database/schema/index.js';
import type { CultivationRealm, PlayerCultivation } from '@co-dao/shared';

function toCamelRealm(row: typeof cultivationRealms.$inferSelect): CultivationRealm {
  return {
    id: String(row.id),
    name: row.name,
    level: row.level,
    statMultiplier: row.max_hp_bonus ?? 100,
    requiredBreakthrough: row.level > 1 ? 'true' : 'false',
    breakthroughGold: row.breakthrough_gold,
    breakthroughItemId: row.breakthrough_item_id,
    description: row.description,
  };
}

function toCamelPlayerCult(row: typeof playerCultivation.$inferSelect): PlayerCultivation {
  return {
    id: row.id,
    playerId: row.player_id,
    realmLevel: row.realm_level,
    experience: row.experience,
    breakthroughCount: row.breakthrough_count,
  };
}

export async function getAllRealms(): Promise<CultivationRealm[]> {
  const rows = await db.select().from(cultivationRealms).orderBy(cultivationRealms.level);
  return rows.map(toCamelRealm);
}

export async function getRealmByLevel(level: number): Promise<CultivationRealm | null> {
  const rows = await db
    .select()
    .from(cultivationRealms)
    .where(eq(cultivationRealms.level, level))
    .limit(1);
  return rows[0] ? toCamelRealm(rows[0]) : null;
}

export async function getPlayerCultivation(playerId: string): Promise<PlayerCultivation | null> {
  const rows = await db
    .select()
    .from(playerCultivation)
    .where(eq(playerCultivation.player_id, playerId))
    .limit(1);
  return rows[0] ? toCamelPlayerCult(rows[0]) : null;
}

export async function initPlayerCultivation(playerId: string): Promise<PlayerCultivation> {
  const rows = await db
    .insert(playerCultivation)
    .values({ player_id: playerId, realm_level: 1, experience: 0, breakthrough_count: 0 })
    .returning();
  return toCamelPlayerCult(rows[0]);
}

export async function updateRealm(
  playerId: string,
  newLevel: number,
): Promise<PlayerCultivation> {
  const rows = await db
    .update(playerCultivation)
    .set({ realm_level: newLevel, updated_at: new Date() })
    .where(eq(playerCultivation.player_id, playerId))
    .returning();
  return toCamelPlayerCult(rows[0]);
}

export async function incrementBreakthroughCount(playerId: string): Promise<PlayerCultivation> {
  const current = await getPlayerCultivation(playerId);
  if (!current) throw new Error('Player cultivation not found');

  const rows = await db
    .update(playerCultivation)
    .set({
      breakthrough_count: current.breakthroughCount + 1,
      updated_at: new Date(),
    })
    .where(eq(playerCultivation.player_id, playerId))
    .returning();
  return toCamelPlayerCult(rows[0]);
}
