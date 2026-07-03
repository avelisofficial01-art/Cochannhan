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
