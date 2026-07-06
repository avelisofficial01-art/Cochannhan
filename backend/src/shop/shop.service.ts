import { shopRepository } from './shop.repository.js';
import { inventoryService } from '../inventory/inventory.service.js';
import { playerRepository } from '../player/player.repository.js';
import { ERROR_CODES } from '@co-dao/shared';

export interface ShopItemPayload {
  id: string;
  itemId: string;
  price: number;
  stock: number | null;
  itemName: string;
  itemType: string;
  itemDescription: string | null;
  itemSprite: string | null;
}

export const shopService = {
  async getShopByNpc(npcId: string) {
    const shop = await shopRepository.findShopByNpcId(npcId);
    if (!shop) return null;

    const items = await shopRepository.getShopItems(shop.id);
    return {
      shop,
      items: items as ShopItemPayload[],
    };
  },

  async buyItem(
    playerId: string,
    npcId: string,
    itemId: string,
    quantity: number
  ) {
    if (quantity <= 0) {
      throw { code: ERROR_CODES.VALIDATION_ERROR, message: 'Số lượng mua phải lớn hơn 0.', status: 400 };
    }

    const shopData = await this.getShopByNpc(npcId);
    if (!shopData) {
      throw { code: ERROR_CODES.VALIDATION_ERROR, message: 'NPC này không có cửa hàng.', status: 400 };
    }

    const shopItem = shopData.items.find((item) => item.itemId === itemId);
    if (!shopItem) {
      throw { code: ERROR_CODES.VALIDATION_ERROR, message: 'Vật phẩm không được bán tại cửa hàng này.', status: 400 };
    }

    // Check stock
    if (shopItem.stock !== null && shopItem.stock < quantity) {
      throw { code: ERROR_CODES.VALIDATION_ERROR, message: 'Cửa hàng không đủ số lượng tồn kho.', status: 400 };
    }

    const player = await playerRepository.findById(playerId);
    if (!player) {
      throw { code: ERROR_CODES.PLAYER_NOT_FOUND, message: 'Không tìm thấy người chơi.', status: 404 };
    }

    const totalPrice = shopItem.price * quantity;
    if ((player.gold ?? 0) < totalPrice) {
      throw { code: ERROR_CODES.VALIDATION_ERROR, message: 'Không đủ linh thạch (vàng) để mua.', status: 400 };
    }

    // Check inventory capacity
    const inventory = await inventoryService.getInventory(playerId);
    const existingSlot = inventory.find((s) => s.itemId === itemId);
    
    // Check if we need a new slot
    const itemTemplate = await inventoryService.getItem(itemId);
    if (!itemTemplate) {
      throw { code: ERROR_CODES.ITEM_NOT_FOUND, message: 'Không tìm thấy thông tin vật phẩm.', status: 404 };
    }

    const isStackable = itemTemplate.stackable === 'true';
    let needsNewSlot = true;
    if (isStackable && existingSlot) {
      if (existingSlot.quantity + quantity <= itemTemplate.maxStack) {
        needsNewSlot = false;
      }
    }

    if (needsNewSlot) {
      const usedSlots = new Set(inventory.map((s) => s.slot));
      let freeSlot = 0;
      while (usedSlots.has(freeSlot)) {
        freeSlot++;
      }
      if (freeSlot >= 24) {
        throw { code: ERROR_CODES.INVENTORY_FULL, message: 'Hành trang đã đầy.', status: 400 };
      }
    }

    // Transactional processing
    // Decrement player gold
    const updatedGold = (player.gold ?? 0) - totalPrice;
    await playerRepository.update(playerId, { gold: updatedGold });

    // Decrement shop stock if limited
    if (shopItem.stock !== null) {
      await shopRepository.updateShopItemStock(shopItem.id, shopItem.stock - quantity);
    }

    // Add item to inventory
    await inventoryService.addItem(playerId, { itemId, quantity });

    // Get fresh data
    const freshInventory = await inventoryService.getInventory(playerId);
    const freshProfile = await playerRepository.findById(playerId);

    return {
      inventory: freshInventory,
      gold: freshProfile?.gold ?? 0,
    };
  },

  async sellItem(playerId: string, itemId: string, quantity: number) {
    if (quantity <= 0) {
      throw { code: ERROR_CODES.VALIDATION_ERROR, message: 'Số lượng bán phải lớn hơn 0.', status: 400 };
    }

    const player = await playerRepository.findById(playerId);
    if (!player) {
      throw { code: ERROR_CODES.PLAYER_NOT_FOUND, message: 'Không tìm thấy người chơi.', status: 404 };
    }

    const item = await inventoryService.getItem(itemId);
    if (!item) {
      throw { code: ERROR_CODES.ITEM_NOT_FOUND, message: 'Không tìm thấy thông tin vật phẩm.', status: 404 };
    }

    // Find the item in player inventory
    const inventory = await inventoryService.getInventory(playerId);
    const playerItemSlot = inventory.find((s) => s.itemId === itemId);
    if (!playerItemSlot || playerItemSlot.quantity < quantity) {
      throw { code: ERROR_CODES.VALIDATION_ERROR, message: 'Không đủ số lượng vật phẩm trong hành trang để bán.', status: 400 };
    }

    if (item.sellPrice <= 0) {
      throw { code: ERROR_CODES.VALIDATION_ERROR, message: 'Vật phẩm này không thể bán được.', status: 400 };
    }

    const totalEarned = item.sellPrice * quantity;

    // Remove item from inventory
    await inventoryService.removeItem(playerId, itemId, quantity);

    // Add gold to player
    const updatedGold = (player.gold ?? 0) + totalEarned;
    await playerRepository.update(playerId, { gold: updatedGold });

    // Get fresh data
    const freshInventory = await inventoryService.getInventory(playerId);
    const freshProfile = await playerRepository.findById(playerId);

    return {
      inventory: freshInventory,
      gold: freshProfile?.gold ?? 0,
    };
  },
};
