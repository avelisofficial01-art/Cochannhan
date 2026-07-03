import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim()),
  jwt: {
    secret: process.env.JWT_SECRET ?? 'dev_secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'dev_refresh_secret',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },
  redis: {
    url: process.env.REDIS_URL ?? 'redis://localhost:6379',
  },
};

// ============================================================
// SEED DATA — NPC / Quest / Inventory
// ============================================================

export const npcSeeds = [
  {
    name: 'Trưởng làng',
    sprite: 'char_2',
    faction: 'chinh_dao',
    occupation: 'village_chief',
    mapId: 'bac_nguyen',
    x: 500,
    y: 400,
  },
  {
    name: 'Thợ rèn',
    sprite: 'char_3',
    faction: 'neutral',
    occupation: 'blacksmith',
    mapId: 'bac_nguyen',
    x: 600,
    y: 300,
    hasShop: 'true',
  },
  {
    name: 'Thương nhân',
    sprite: 'char_4',
    faction: 'neutral',
    occupation: 'merchant',
    mapId: 'bac_nguyen',
    x: 400,
    y: 500,
    hasShop: 'true',
  },
  {
    name: 'Trưởng lão',
    sprite: 'char_5',
    faction: 'chinh_dao',
    occupation: 'elder',
    mapId: 'bac_nguyen',
    x: 700,
    y: 450,
  },
];

export const questSeeds = [
  {
    name: 'Lời chào từ trưởng làng',
    type: 'main',
    description: 'Hãy đến gặp Trưởng làng và lắng nghe lời khuyên đầu tiên của người.',
    npcGiverId: null,
    objectives: JSON.stringify([{ type: 'talk', target: 'Trưởng làng', count: 1, description: 'Nói chuyện với Trưởng làng' }]),
    rewards: JSON.stringify([{ type: 'gold', amount: 50 }, { type: 'exp', amount: 20 }]),
    flagComplete: 'talked_village_chief',
  },
  {
    name: 'Dọn dẹp quái vật',
    type: 'side',
    description: 'Những con quái vật đang quấy phá khu rừng gần làng. Hãy tiêu diệt 3 con.',
    npcGiverId: null,
    objectives: JSON.stringify([{ type: 'kill', target: 'wild_beast', count: 3, description: 'Tiêu diệt 3 Quái Thú Hoang Dã' }]),
    rewards: JSON.stringify([{ type: 'gold', amount: 100 }, { type: 'exp', amount: 50 }, { type: 'spirit_stone', amount: 5 }]),
  },
];

export const itemSeeds = [
  { name: 'Bình Hồi Máu Nhỏ', type: 'consumable', description: 'Hồi phục 50 HP', stackable: 'true', maxStack: 99, sellPrice: 10, sprite: 'gui_icon_potion' },
  { name: 'Bình Hồi Mana Nhỏ', type: 'consumable', description: 'Hồi phục 30 Mana', stackable: 'true', maxStack: 99, sellPrice: 10, sprite: 'gui_icon_potion' },
  { name: 'Đá Linh Hồn', type: 'material', description: 'Nguyên liệu luyện khí cơ bản', stackable: 'true', maxStack: 999, sellPrice: 5, sprite: 'gui_icon_gem' },
  { name: 'Lông Thú', type: 'quest_item', description: 'Lông của Quái Thú Hoang Dã', stackable: 'true', maxStack: 99, sellPrice: 2, sprite: 'gui_icon_feather' },
];

// ============================================================
// SEED DATA — Monster Templates
// ============================================================

export const monsterSeeds = [
  {
    name: 'Quái Thú Hoang Dã',
    realm: 'pham_nhan',
    hp: 80,
    atk: 12,
    def: 5,
    speed: 3,
    element: 'physical',
    sprite: 'mob_beast',
    drop_table: JSON.stringify([
      { itemName: 'Lông Thú', chance: 0.6, minQuantity: 1, maxQuantity: 3 },
      { itemName: 'Đá Linh Hồn', chance: 0.15, minQuantity: 1, maxQuantity: 2 },
    ]),
    map_id: 'bac_nguyen',
    respawn_time: 30,
  },
  {
    name: 'Sói Bắc Nguyên',
    realm: 'pham_nhan',
    hp: 120,
    atk: 18,
    def: 8,
    speed: 5,
    element: 'physical',
    sprite: 'mob_wolf',
    drop_table: JSON.stringify([
      { itemName: 'Lông Thú', chance: 0.7, minQuantity: 2, maxQuantity: 4 },
      { itemName: 'Đá Linh Hồn', chance: 0.2, minQuantity: 2, maxQuantity: 5 },
    ]),
    map_id: 'bac_nguyen',
    respawn_time: 45,
  },
  {
    name: 'Hỏa Hồ Yêu',
    realm: 'luyen_khi',
    hp: 200,
    atk: 25,
    def: 12,
    speed: 6,
    element: 'fire',
    sprite: 'mob_fox',
    drop_table: JSON.stringify([
      { itemName: 'Đá Linh Hồn', chance: 0.4, minQuantity: 3, maxQuantity: 8 },
      { itemName: 'Bình Hồi Máu Nhỏ', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
    ]),
    map_id: 'bac_nguyen',
    respawn_time: 60,
  },
];
