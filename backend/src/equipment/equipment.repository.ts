import { eq, and } from 'drizzle-orm';
import { db } from '../database/connection.js';
import {
  equipmentTemplates,
  playerEquipment,
} from '../database/schema/index.js';

function getStatBonus(statBonuses: unknown, key: string): number {
  if (!statBonuses || typeof statBonuses !== 'object' || !(key in statBonuses)) {
    return 0;
  }

  const value = (statBonuses as Record<string, unknown>)[key];
  return typeof value === 'number' ? value : 0;
}

function toCamelEquipment(row: typeof equipmentTemplates.$inferSelect): Record<string, unknown> {
  return {
    id: row.id,
    name: row.name,
    type: row.slot,
    slot: row.slot,
    tier: row.rarity,
    baseHp: getStatBonus(row.stat_bonuses, 'hp'),
    baseAtk: getStatBonus(row.stat_bonuses, 'atk'),
    baseDef: getStatBonus(row.stat_bonuses, 'def'),
    baseCrit: getStatBonus(row.stat_bonuses, 'crit'),
    requiredLevel: row.required_realm,
    description: row.description,
    icon: null,
  };
}

function toCamelPlayerEquip(row: typeof playerEquipment.$inferSelect): Record<string, unknown> {
  return {
    id: row.id,
    playerId: row.player_id,
    equipmentId: row.equipment_id,
    enhancement: row.enhancement,
    isEquipped: row.is_equipped,
    slotIndex: row.slot_index,
    obtainedAt: row.obtained_at,
  };
}

export async function getAllTemplates(): Promise<Record<string, unknown>[]> {
  const rows = await db.select().from(equipmentTemplates);
  return rows.map(toCamelEquipment);
}

export async function getTemplateById(id: string): Promise<Record<string, unknown> | null> {
  const rows = await db.select().from(equipmentTemplates).where(eq(equipmentTemplates.id, id)).limit(1);
  return rows.length > 0 ? toCamelEquipment(rows[0]) : null;
}

export async function getPlayerEquipment(playerId: string): Promise<Record<string, unknown>[]> {
  const rows = await db
    .select()
    .from(playerEquipment)
    .where(eq(playerEquipment.player_id, playerId));
  return rows.map(toCamelPlayerEquip);
}

export async function getPlayerEquipById(playerEquipId: string): Promise<Record<string, unknown> | null> {
  const rows = await db
    .select()
    .from(playerEquipment)
    .where(eq(playerEquipment.id, playerEquipId))
    .limit(1);
  return rows.length > 0 ? toCamelPlayerEquip(rows[0]) : null;
}

export async function giveEquipment(playerId: string, equipmentId: string): Promise<Record<string, unknown> | null> {
  const rows = await db
    .insert(playerEquipment)
    .values({
      player_id: playerId,
      equipment_id: equipmentId,
      enhancement: 0,
      is_equipped: 'false',
      slot_index: null,
    })
    .returning();
  return rows.length > 0 ? toCamelPlayerEquip(rows[0]) : null;
}

export async function equipPlayerEquipment(playerEquipId: string, slotIndex: number): Promise<void> {
  await db
    .update(playerEquipment)
    .set({ is_equipped: 'true', slot_index: slotIndex })
    .where(eq(playerEquipment.id, playerEquipId));
}

export async function unequipPlayerEquipment(playerEquipId: string): Promise<void> {
  await db
    .update(playerEquipment)
    .set({ is_equipped: 'false', slot_index: null })
    .where(eq(playerEquipment.id, playerEquipId));
}

export async function enhancePlayerEquipment(playerEquipId: string, newEnhancement: number): Promise<void> {
  await db
    .update(playerEquipment)
    .set({ enhancement: newEnhancement })
    .where(eq(playerEquipment.id, playerEquipId));
}

export async function getEquippedInSlot(playerId: string, slotIndex: number): Promise<Record<string, unknown> | null> {
  const rows = await db
    .select()
    .from(playerEquipment)
    .where(
      and(
        eq(playerEquipment.player_id, playerId),
        eq(playerEquipment.is_equipped, 'true'),
        eq(playerEquipment.slot_index, slotIndex),
      ),
    )
    .limit(1);
  return rows.length > 0 ? toCamelPlayerEquip(rows[0]) : null;
}
