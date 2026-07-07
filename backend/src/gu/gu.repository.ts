import { eq, and } from 'drizzle-orm';
import { db } from '../database/connection.js';
import type { GuTemplate, GuStats, GuSkill, PlayerGu, GuSynergy } from '@co-dao/shared';
import {
  guTemplates,
  playerGu,
} from '../database/schema/index.js';

type GuTemplateRow = typeof guTemplates.$inferSelect;
type PlayerGuRow = typeof playerGu.$inferSelect;

function getNumberEffect(effects: unknown, key: string, fallback: number): number {
  if (!effects || typeof effects !== 'object' || !(key in effects)) {
    return fallback;
  }

  const value = (effects as Record<string, unknown>)[key];
  return typeof value === 'number' ? value : fallback;
}

function toCamelTemplate(row: GuTemplateRow): GuTemplate {
  return {
    id: row.id,
    name: row.name,
    rank: row.rank,
    element: row.dao_affinity ?? 'neutral',
    role: row.type,
    quality: row.rank >= 6 ? 'immortal' : row.rank >= 4 ? 'legendary' : 'common',
    description: row.description,
    sprite: null,
    isImmortal: row.rank >= 6 ? 'true' : 'false',
    uniqueWorld: 'false',
    maxEnhance: 10,
    canEvolve: 'false',
    evolveTo: null,
  };
}

function toCamelPlayerGu(row: PlayerGuRow): PlayerGu {
  return {
    id: row.id,
    playerId: row.player_id,
    guTemplateId: row.gu_id,
    level: 1,
    enhancement: 0,
    mastery: 0,
    bondLevel: 0,
    isEquipped: row.is_equipped ? 'true' : 'false',
    slotIndex: row.slot_index,
  };
}

export async function getAllGuTemplates(): Promise<GuTemplate[]> {
  const rows = await db.select().from(guTemplates);
  return rows.map(toCamelTemplate);
}

export async function getGuTemplateById(id: string): Promise<GuTemplate | null> {
  const rows = await db.select().from(guTemplates).where(eq(guTemplates.id, id)).limit(1);
  return rows.length > 0 ? toCamelTemplate(rows[0]) : null;
}

export async function getGuStats(templateId: string): Promise<GuStats | null> {
  const rows = await db.select().from(guTemplates).where(eq(guTemplates.id, templateId)).limit(1);
  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];
  return {
    id: row.id,
    guTemplateId: row.id,
    hp: getNumberEffect(row.effects, 'hp_bonus', 0),
    atk: getNumberEffect(row.effects, 'atk_bonus', 0),
    def: getNumberEffect(row.effects, 'def_bonus', 0),
    crit: getNumberEffect(row.effects, 'crit_bonus', 0),
    critDamage: getNumberEffect(row.effects, 'crit_damage_bonus', 0),
    moveSpeed: getNumberEffect(row.effects, 'move_speed_bonus', 0),
    attackSpeed: getNumberEffect(row.effects, 'attack_speed_bonus', 0),
    lifeSteal: getNumberEffect(row.effects, 'life_steal_bonus', 0),
  };
}

export async function getGuSkills(templateId: string): Promise<GuSkill[]> {
  const rows = await db.select().from(guTemplates).where(eq(guTemplates.id, templateId)).limit(1);
  if (rows.length === 0) {
    return [];
  }

  const row = rows[0];
  return [
    {
      id: row.id,
      guTemplateId: row.id,
      skillId: `${row.type}_${row.rank}`,
      name: row.name,
      type: row.type === 'support' ? 'active' : 'passive',
      description: row.description,
      cooldown: getNumberEffect(row.effects, 'cooldown', 5),
      damageMultiplier: getNumberEffect(row.effects, 'atk_multiplier', 1),
      targetType: row.type === 'support' ? 'self' : 'enemy',
      aoeRadius: null,
    },
  ];
}

export async function getPlayerGuList(playerId: string): Promise<PlayerGu[]> {
  const rows = await db.select().from(playerGu).where(eq(playerGu.player_id, playerId));
  return rows.map(toCamelPlayerGu);
}

export async function getPlayerGuById(playerGuId: string): Promise<PlayerGu | null> {
  const rows = await db.select().from(playerGu).where(eq(playerGu.id, playerGuId)).limit(1);
  return rows.length > 0 ? toCamelPlayerGu(rows[0]) : null;
}

export async function getEquippedGuCount(playerId: string): Promise<number> {
  const rows = await db
    .select()
    .from(playerGu)
    .where(and(eq(playerGu.player_id, playerId), eq(playerGu.is_equipped, true)));
  return rows.length;
}

export async function equipPlayerGu(playerGuId: string, slotIndex: number): Promise<void> {
  await db
    .update(playerGu)
    .set({ is_equipped: true, slot_index: slotIndex })
    .where(eq(playerGu.id, playerGuId));
}

export async function unequipPlayerGu(playerGuId: string): Promise<void> {
  await db
    .update(playerGu)
    .set({ is_equipped: false, slot_index: null })
    .where(eq(playerGu.id, playerGuId));
}

export async function enhancePlayerGu(_playerGuId: string, _newEnhancement: number): Promise<void> {
  return Promise.resolve();
}

export async function getAllSynergies(): Promise<GuSynergy[]> {
  return [];
}

export async function getSynergiesForGu(_guTemplateId: string): Promise<GuSynergy[]> {
  return [];
}
