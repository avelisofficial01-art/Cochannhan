export interface ShopRow {
  id: string;
  npc_id: string;
  name: string;
}

export interface ShopItemRow {
  id: string;
  shopId: string;
  itemId: string;
  price: number;
  stock: number | null;
  refreshTime: Date | null;
  itemName: string;
  itemType: string;
  itemDescription: string | null;
  itemSprite: string | null;
}

export const shopRepository = {
  async findShopByNpcId(_npcId: string): Promise<ShopRow | null> {
    return null;
  },

  async findShopById(_id: string): Promise<ShopRow | null> {
    return null;
  },

  async getShopItems(_shopId: string): Promise<ShopItemRow[]> {
    return [];
  },

  async getShopItem(_shopId: string, _itemId: string): Promise<ShopItemRow | null> {
    return null;
  },

  async updateShopItemStock(_id: string, _newStock: number): Promise<ShopItemRow | null> {
    return null;
  },

  async createShop(npcId: string, name: string): Promise<ShopRow> {
    return {
      id: crypto.randomUUID(),
      npc_id: npcId,
      name,
    };
  },

  async addShopItem(
    shopId: string,
    itemId: string,
    price: number,
    stock: number | null = null,
  ): Promise<ShopItemRow> {
    return {
      id: crypto.randomUUID(),
      shopId,
      itemId,
      price,
      stock,
      refreshTime: null,
      itemName: '',
      itemType: '',
      itemDescription: null,
      itemSprite: null,
    };
  },
};
