import { inventoryRepository } from './inventory.repository.js';
import type { ItemInfo, InventorySlot } from '@co-dao/shared';
import type { CreateItemInput, AddItemInput, MoveItemInput } from './inventory.schema.js';

interface ItemRow {
  id: string;
  name: string;
  type: string;
  description: string | null;
  stackable: string;
  max_stack: number;
  sell_price: number;
  sprite: string | null;
}

interface InventoryRow {
  id: string;
  player_id: string;
  item_id: string;
  quantity: number;
  slot: number;
}

function mapItem(row: ItemRow): ItemInfo {
  return {
    id: row.id,
    name: row.name,
    type: row.type as ItemInfo['type'],
    description: row.description,
    stackable: row.stackable,
    maxStack: row.max_stack,
    sellPrice: row.sell_price,
    sprite: row.sprite,
  };
}

function mapSlot(row: InventoryRow, item?: ItemInfo): InventorySlot {
  return {
    id: row.id,
    playerId: row.player_id,
    itemId: row.item_id,
    item,
    quantity: row.quantity,
    slot: row.slot,
  };
}

export const inventoryService = {
  // Item Templates
  async getAllItems(): Promise<ItemInfo[]> {
    const rows = await inventoryRepository.findAllItems();
    return rows.map(mapItem);
  },

  async getItem(id: string): Promise<ItemInfo | null> {
    const row = await inventoryRepository.findItemById(id);
    return row ? mapItem(row as unknown as ItemRow) : null;
  },

  async createItem(input: CreateItemInput): Promise<ItemInfo> {
    const row = await inventoryRepository.createItem(input);
    return mapItem(row as unknown as ItemRow);
  },

  // Player Inventory
  async getInventory(playerId: string): Promise<InventorySlot[]> {
    const rows = await inventoryRepository.getInventory(playerId);
    const slots: InventorySlot[] = [];
    for (const row of rows) {
      const r = row as unknown as InventoryRow;
      const item = await this.getItem(r.item_id);
      slots.push(mapSlot(r, item ?? undefined));
    }
    return slots;
  },

  async addItem(
    playerId: string,
    input: AddItemInput,
  ): Promise<InventorySlot> {
    const item = await this.getItem(input.itemId);
    if (!item) throw new Error('Item not found');

    // If stackable, try to stack
    if (item.stackable === 'true') {
      const existing = await inventoryRepository.findItemInInventory(
        playerId,
        input.itemId,
      );
      if (existing) {
        const r = existing as unknown as InventoryRow;
        const newQty = r.quantity + input.quantity;
        if (newQty <= item.maxStack) {
          const updated = await inventoryRepository.updateSlot(r.id, {
            quantity: newQty,
          });
          return mapSlot(updated as unknown as InventoryRow, item);
        }
      }
    }

    // Find empty slot
    let slot = input.slot ?? 0;
    if (input.slot === undefined) {
      const existing = await inventoryRepository.getInventory(playerId);
      const usedSlots = new Set(existing.map((s) => (s as unknown as InventoryRow).slot));
      slot = 0;
      while (usedSlots.has(slot)) slot++;
    }

    const row = await inventoryRepository.addItem(
      playerId,
      input.itemId,
      input.quantity,
      slot,
    );
    return mapSlot(row as unknown as InventoryRow, item);
  },

  async moveItem(
    playerId: string,
    input: MoveItemInput,
  ): Promise<void> {
    const from = await inventoryRepository.findSlot(playerId, input.fromSlot);
    const to = await inventoryRepository.findSlot(playerId, input.toSlot);

    if (!from) throw new Error('Source slot empty');

    if (to) {
      // Swap
      await inventoryRepository.updateSlot(from.id, { slot: input.toSlot });
      await inventoryRepository.updateSlot(to.id, { slot: input.fromSlot });
    } else {
      await inventoryRepository.updateSlot(from.id, { slot: input.toSlot });
    }
  },

  async removeItem(
    playerId: string,
    itemId: string,
    quantity: number,
  ): Promise<void> {
    await inventoryRepository.removeItem(playerId, itemId, quantity);
  },

  async sortInventory(
    playerId: string,
    sortBy: 'name' | 'type' | 'quantity',
  ): Promise<InventorySlot[]> {
    const slots = await this.getInventory(playerId);
    const sorted = [...slots].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.item?.name ?? '').localeCompare(b.item?.name ?? '');
        case 'type':
          return (a.item?.type ?? '').localeCompare(b.item?.type ?? '');
        case 'quantity':
          return b.quantity - a.quantity;
        default:
          return 0;
      }
    });

    // Update all slots
    for (let i = 0; i < sorted.length; i++) {
      await inventoryRepository.updateSlot(sorted[i].id, { slot: i });
    }

    return this.getInventory(playerId);
  },
};
