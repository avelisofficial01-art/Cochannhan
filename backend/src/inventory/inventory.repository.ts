import { db } from '../database/connection.js';
import {
  itemTemplates,
  playerInventory,
} from '../database/schema/index.js';
import { eq, and } from 'drizzle-orm';
import type { CreateItemInput } from './inventory.schema.js';

function mapItemRow(row: typeof itemTemplates.$inferSelect) {
  return {
    ...row,
    stackable: row.stack_limit > 1 ? 'true' : 'false',
    max_stack: row.stack_limit,
    sprite: null,
  };
}

function mapInventoryRow(row: typeof playerInventory.$inferSelect) {
  return {
    ...row,
    slot: 0,
  };
}

export const inventoryRepository = {
  async findAllItems() {
    const rows = await db.select().from(itemTemplates);
    return rows.map(mapItemRow);
  },

  async findItemById(id: string) {
    const rows = await db
      .select()
      .from(itemTemplates)
      .where(eq(itemTemplates.id, id))
      .limit(1);
    return rows[0] ? mapItemRow(rows[0]) : null;
  },

  async createItem(input: CreateItemInput) {
    const rows = await db.insert(itemTemplates).values({
      name: input.name,
      type: input.type,
      description: input.description ?? null,
      stack_limit: input.maxStack,
      sell_price: input.sellPrice,
    }).returning();
    return mapItemRow(rows[0]);
  },

  async getInventory(playerId: string) {
    const rows = await db
      .select()
      .from(playerInventory)
      .where(eq(playerInventory.player_id, playerId));
    return rows.map(mapInventoryRow);
  },

  async findSlot(playerId: string, slot: number) {
    const rows = await this.getInventory(playerId);
    return rows.find(row => row.slot === slot) ?? null;
  },

  async findItemInInventory(playerId: string, itemId: string) {
    const rows = await db
      .select()
      .from(playerInventory)
      .where(
        and(
          eq(playerInventory.player_id, playerId),
          eq(playerInventory.item_id, itemId),
        ),
      )
      .limit(1);
    return rows[0] ? mapInventoryRow(rows[0]) : null;
  },

  async addItem(
    playerId: string,
    itemId: string,
    quantity: number,
    _slot: number,
  ) {
    const rows = await db
      .insert(playerInventory)
      .values({
        player_id: playerId,
        item_id: itemId,
        quantity,
      })
      .returning();
    return mapInventoryRow(rows[0]);
  },

  async updateSlot(id: string, updates: { quantity?: number; slot?: number }) {
    const rows = await db
      .update(playerInventory)
      .set({ quantity: updates.quantity })
      .where(eq(playerInventory.id, id))
      .returning();
    return mapInventoryRow(rows[0]);
  },

  async removeSlot(id: string) {
    await db.delete(playerInventory).where(eq(playerInventory.id, id));
  },

  async removeItem(playerId: string, itemId: string, quantity: number) {
    const slot = await this.findItemInInventory(playerId, itemId);
    if (!slot) return;
    if (slot.quantity <= quantity) {
      await db.delete(playerInventory).where(eq(playerInventory.id, slot.id));
    } else {
      await db
        .update(playerInventory)
        .set({ quantity: slot.quantity - quantity })
        .where(eq(playerInventory.id, slot.id));
    }
  },
};
