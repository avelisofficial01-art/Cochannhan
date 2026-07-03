import { eq, and } from 'drizzle-orm';
import { db } from '../database/connection.js';
import type { GuTemplate, GuStats, GuSkill, PlayerGu, GuSynergy } from '@co-dao/shared';
import {
  guTemplates,
  guStats,
  guSkills,
  playerGu,
  guSynergy,
} from '../database/schema/index.js';

// ── Row types ──
interface GuTemplateRow {
  id: string;
  name: string;
  rank: number;
  element: string;
  role: string;
  quality: string;
  description: string | null;
  sprite: string | null;
  is_immortal: string;
  unique_world: string;
  max_enhance: number;
  can_evolve: string;
  evolve_to: string | null;
  created_at: Date;
}

interface GuStatsRow {
  id: string;
  gu_template_id: string;
  hp: number;
  atk: number;
  def: number;
  crit: number;
  crit_damage: number;
  move_speed: number;
  attack_speed: number;
  life_steal: number;
  created_at: Date;
}

interface GuSkillRow {
  id: string;
  gu_template_id: string;
  skill_id: string;
  name: string;
  type: string;
  description: string | null;
  cooldown: number;
  damage_multiplier: number;
  target_type: string;
  aoe_radius: number | null;
  created_at: Date;
}

interface PlayerGuRow {
  id: string;
  player_id: string;
  gu_template_id: string;
  level: number;
  enhancement: number;
  mastery: number;
  bond_level: number;
  is_equipped: string;
  slot_index: number | null;
  created_at: Date;
}

interface GuSynergyRow {
  id: string;
  gu_a: string;
  gu_b: string;
  result_name: string;
  result_description: string | null;
  result_skill_id: string | null;
  bonus_hp: number;
  bonus_atk: number;
  bonus_def: number;
  created_at: Date;
}

// ── CamelCase helpers ──
function toCamelTemplate(row: GuTemplateRow): GuTemplate {
  return {
    id: row.id,
    name: row.name,
    rank: row.rank,
    element: row.element,
    role: row.role,
    quality: row.quality,
    description: row.description,
    sprite: row.sprite,
    isImmortal: row.is_immortal,
    uniqueWorld: row.unique_world,
    maxEnhance: row.max_enhance,
    canEvolve: row.can_evolve,
    evolveTo: row.evolve_to,
  };
}

function toCamelStats(row: GuStatsRow): GuStats {
  return {
    id: row.id,
    guTemplateId: row.gu_template_id,
    hp: row.hp,
    atk: row.atk,
    def: row.def,
    crit: row.crit,
    critDamage: row.crit_damage,
    moveSpeed: row.move_speed,
    attackSpeed: row.attack_speed,
    lifeSteal: row.life_steal,
  };
}

function toCamelSkill(row: GuSkillRow): GuSkill {
  return {
    id: row.id,
    guTemplateId: row.gu_template_id,
    skillId: row.skill_id,
    name: row.name,
    type: row.type,
    description: row.description,
    cooldown: row.cooldown,
    damageMultiplier: row.damage_multiplier,
    targetType: row.target_type,
    aoeRadius: row.aoe_radius,
  };
}

function toCamelPlayerGu(row: PlayerGuRow): PlayerGu {
  return {
    id: row.id,
    playerId: row.player_id,
    guTemplateId: row.gu_template_id,
    level: row.level,
    enhancement: row.enhancement,
    mastery: row.mastery,
    bondLevel: row.bond_level,
    isEquipped: row.is_equipped,
    slotIndex: row.slot_index,
  };
}

function toCamelSynergy(row: GuSynergyRow): GuSynergy {
  return {
    id: row.id,
    guA: row.gu_a,
    guB: row.gu_b,
    resultName: row.result_name,
    resultDescription: row.result_description,
    resultSkillId: row.result_skill_id,
    bonusHp: row.bonus_hp,
    bonusAtk: row.bonus_atk,
    bonusDef: row.bonus_def,
  };
}

// ── Gu Templates ──
export async function getAllGuTemplates(): Promise<GuTemplate[]> {
  const rows = await db.select().from(guTemplates);
  return rows.map(toCamelTemplate);
}

export async function getGuTemplateById(id: string): Promise<GuTemplate | null> {
  const rows = await db.select().from(guTemplates).where(eq(guTemplates.id, id)).limit(1);
  return rows.length > 0 ? toCamelTemplate(rows[0]) : null;
}

// ── Gu Stats ──
export async function getGuStats(templateId: string): Promise<GuStats | null> {
  const rows = await db.select().from(guStats).where(eq(guStats.gu_template_id, templateId)).limit(1);
  return rows.length > 0 ? toCamelStats(rows[0]) : null;
}

// ── Gu Skills ──
export async function getGuSkills(templateId: string): Promise<GuSkill[]> {
  const rows = await db.select().from(guSkills).where(eq(guSkills.gu_template_id, templateId));
  return rows.map(toCamelSkill);
}

// ── Player Gu ──
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
    .where(and(eq(playerGu.player_id, playerId), eq(playerGu.is_equipped, 'true')));
  return rows.length;
}

export async function equipPlayerGu(playerGuId: string, slotIndex: number): Promise<void> {
  await db
    .update(playerGu)
    .set({ is_equipped: 'true', slot_index: slotIndex })
    .where(eq(playerGu.id, playerGuId));
}

export async function unequipPlayerGu(playerGuId: string): Promise<void> {
  await db
    .update(playerGu)
    .set({ is_equipped: 'false', slot_index: null })
    .where(eq(playerGu.id, playerGuId));
}

// ── Gu Enhancement ──
export async function enhancePlayerGu(playerGuId: string, newEnhancement: number): Promise<void> {
  await db
    .update(playerGu)
    .set({ enhancement: newEnhancement })
    .where(eq(playerGu.id, playerGuId));
}

// ── Gu Synergy ──
export async function getAllSynergies(): Promise<GuSynergy[]> {
  const rows = await db.select().from(guSynergy);
  return rows.map(toCamelSynergy);
}

export async function getSynergiesForGu(guTemplateId: string): Promise<GuSynergy[]> {
  const rows = await db
    .select()
    .from(guSynergy)
    .where(eq(guSynergy.gu_a, guTemplateId));
  const rowsB = await db
    .select()
    .from(guSynergy)
    .where(eq(guSynergy.gu_b, guTemplateId));
  return [...rows.map(toCamelSynergy), ...rowsB.map(toCamelSynergy)];
}
