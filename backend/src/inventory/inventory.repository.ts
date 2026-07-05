import { db } from '../database/connection.js';
import {
  itemTemplates,
  playerInventory,
} from '../database/schema/index.js';
import { eq, and, asc } from 'drizzle-orm';
import type { CreateItemInput } from './inventory.schema.js';

export const inventoryRepository = {
  // Item Templates
  async findAllItems() {
    return db.select().from(itemTemplates);
  },

  async findItemById(id: string) {
    const rows = await db
      .select()
      .from(itemTemplates)
      .where(eq(itemTemplates.id, id))
      .limit(1);
    return rows[0] ?? null;
  },

  async createItem(input: CreateItemInput) {
    const rows = await db.insert(itemTemplates).values({
      name: input.name,
      type: input.type,
      description: input.description ?? null,
      stackable: input.stackable,
      max_stack: input.maxStack,
      sell_price: input.sellPrice,
      sprite: input.sprite ?? null,
    }).returning();
    return rows[0];
  },

  // Player Inventory
  async getInventory(playerId: string) {
    return db
      .select()
      .from(playerInventory)
      .where(eq(playerInventory.player_id, playerId))
      .orderBy(asc(playerInventory.slot));
  },

  async findSlot(playerId: string, slot: number) {
    const rows = await db
      .select()
      .from(playerInventory)
      .where(
        and(
          eq(playerInventory.player_id, playerId),
          eq(playerInventory.slot, slot),
        ),
      )
      .limit(1);
    return rows[0] ?? null;
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
    return rows[0] ?? null;
  },

  async addItem(
    playerId: string,
    itemId: string,
    quantity: number,
    slot: number,
  ) {
    const rows = await db
      .insert(playerInventory)
      .values({
        player_id: playerId,
        item_id: itemId,
        quantity,
        slot,
      })
      .returning();
    return rows[0];
  },

  async updateSlot(id: string, updates: { quantity?: number; slot?: number }) {
    const rows = await db
      .update(playerInventory)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(playerInventory.id, id))
      .returning();
    return rows[0];
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
        .set({ quantity: slot.quantity - quantity, updated_at: new Date() })
        .where(eq(playerInventory.id, slot.id));
    }
  },
};
