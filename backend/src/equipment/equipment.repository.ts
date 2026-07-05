import { eq, and } from 'drizzle-orm';
import { db } from '../database/connection.js';
import {
  equipmentTemplates,
  playerEquipment,
} from '../database/schema/index.js';

// ── Helpers ──

function toCamelEquipment(row: typeof equipmentTemplates.$inferSelect): Record<string, unknown> {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    slot: row.slot,
    tier: row.tier,
    baseHp: row.base_hp,
    baseAtk: row.base_atk,
    baseDef: row.base_def,
    baseCrit: row.base_crit,
    requiredLevel: row.required_level,
    description: row.description,
    icon: row.icon,
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

// ── Equipment Templates ──

export async function getAllTemplates(): Promise<Record<string, unknown>[]> {
  const rows = await db.select().from(equipmentTemplates);
  return rows.map(toCamelEquipment);
}

export async function getTemplateById(id: string): Promise<Record<string, unknown> | null> {
  const rows = await db.select().from(equipmentTemplates).where(eq(equipmentTemplates.id, id)).limit(1);
  return rows.length > 0 ? toCamelEquipment(rows[0]) : null;
}

// ── Player Equipment ──

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
