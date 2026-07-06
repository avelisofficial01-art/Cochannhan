import { db } from '../database/connection.js';
import {
  shops,
  shopItems,
  itemTemplates,
} from '../database/schema/index.js';
import { eq, and } from 'drizzle-orm';

export const shopRepository = {
  async findShopByNpcId(npcId: string) {
    const rows = await db
      .select()
      .from(shops)
      .where(eq(shops.npc_id, npcId))
      .limit(1);
    return rows[0] ?? null;
  },

  async findShopById(id: string) {
    const rows = await db
      .select()
      .from(shops)
      .where(eq(shops.id, id))
      .limit(1);
    return rows[0] ?? null;
  },

  async getShopItems(shopId: string) {
    return db
      .select({
        id: shopItems.id,
        shopId: shopItems.shop_id,
        itemId: shopItems.item_id,
        price: shopItems.price,
        stock: shopItems.stock,
        refreshTime: shopItems.refresh_time,
        itemName: itemTemplates.name,
        itemType: itemTemplates.type,
        itemDescription: itemTemplates.description,
        itemSprite: itemTemplates.sprite,
      })
      .from(shopItems)
      .innerJoin(itemTemplates, eq(shopItems.item_id, itemTemplates.id))
      .where(eq(shopItems.shop_id, shopId));
  },

  async getShopItem(shopId: string, itemId: string) {
    const rows = await db
      .select()
      .from(shopItems)
      .where(
        and(
          eq(shopItems.shop_id, shopId),
          eq(shopItems.item_id, itemId)
        )
      )
      .limit(1);
    return rows[0] ?? null;
  },

  async updateShopItemStock(id: string, newStock: number) {
    const rows = await db
      .update(shopItems)
      .set({ stock: newStock })
      .where(eq(shopItems.id, id))
      .returning();
    return rows[0];
  },

  async createShop(npcId: string, name: string) {
    const rows = await db
      .insert(shops)
      .values({
        npc_id: npcId,
        name,
      })
      .returning();
    return rows[0];
  },

  async addShopItem(shopId: string, itemId: string, price: number, stock: number | null = null) {
    const rows = await db
      .insert(shopItems)
      .values({
        shop_id: shopId,
        item_id: itemId,
        price,
        stock,
      })
      .returning();
    return rows[0];
  },
};
