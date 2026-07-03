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
  game: {
    defaultMaxGuSlots: parseInt(process.env.MAX_GU_SLOTS ?? '5', 10),
    maxEnhance: parseInt(process.env.MAX_ENHANCE ?? '20', 10),
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

// ============================================================
// SEED DATA — 5 Gu Mẫu (Phàm Cổ)
// ============================================================

export const guSeeds = [
  {
    template: {
      name: 'Hỏa Cổ',
      rank: 1,
      element: 'Fire',
      role: 'damage',
      quality: 'common',
      description: 'Cổ Trùng hệ Hỏa. Tăng sát thương hỏa và thiêu đốt kẻ địch.',
      sprite: 'gu_fire',
      is_immortal: 'false',
      unique_world: 'false',
      max_enhance: 20,
      can_evolve: 'true',
    },
    stats: { hp: 0, atk: 25, def: 0, crit: 5, crit_damage: 10, move_speed: 0, attack_speed: 0, life_steal: 0 },
    skills: [
      {
        skill_id: 'fire_blast',
        name: 'Hỏa Cầu',
        type: 'active',
        description: 'Bắn một quả cầu lửa về phía kẻ địch, gây sát thương Hỏa.',
        cooldown: 3,
        damage_multiplier: 150,
        target_type: 'single',
        aoe_radius: null,
      },
    ],
  },
  {
    template: {
      name: 'Phong Cổ',
      rank: 1,
      element: 'Wind',
      role: 'support',
      quality: 'common',
      description: 'Cổ Trùng hệ Phong. Tăng tốc độ di chuyển và tốc đánh.',
      sprite: 'gu_wind',
      is_immortal: 'false',
      unique_world: 'false',
      max_enhance: 20,
      can_evolve: 'true',
    },
    stats: { hp: 0, atk: 5, def: 0, crit: 0, crit_damage: 0, move_speed: 10, attack_speed: 8, life_steal: 0 },
    skills: [
      {
        skill_id: 'wind_step',
        name: 'Phong Bộ',
        type: 'passive',
        description: 'Tăng tốc độ di chuyển.',
        cooldown: 0,
        damage_multiplier: 0,
        target_type: 'self',
        aoe_radius: null,
      },
    ],
  },
  {
    template: {
      name: 'Thạch Cổ',
      rank: 1,
      element: 'Earth',
      role: 'tank',
      quality: 'common',
      description: 'Cổ Trùng hệ Thổ. Tăng phòng thủ và máu tối đa.',
      sprite: 'gu_stone',
      is_immortal: 'false',
      unique_world: 'false',
      max_enhance: 20,
      can_evolve: 'true',
    },
    stats: { hp: 150, atk: 0, def: 20, crit: 0, crit_damage: 0, move_speed: 0, attack_speed: 0, life_steal: 0 },
    skills: [
      {
        skill_id: 'stone_armor',
        name: 'Thạch Giáp',
        type: 'passive',
        description: 'Tăng phòng thủ.',
        cooldown: 0,
        damage_multiplier: 0,
        target_type: 'self',
        aoe_radius: null,
      },
    ],
  },
  {
    template: {
      name: 'Huyết Cổ',
      rank: 1,
      element: 'Blood',
      role: 'utility',
      quality: 'common',
      description: 'Cổ Trùng hệ Huyết. Hút máu từ kẻ địch, hồi phục bản thân.',
      sprite: 'gu_blood',
      is_immortal: 'false',
      unique_world: 'false',
      max_enhance: 20,
      can_evolve: 'true',
    },
    stats: { hp: 50, atk: 10, def: 5, crit: 0, crit_damage: 0, move_speed: 0, attack_speed: 0, life_steal: 5 },
    skills: [
      {
        skill_id: 'blood_drain',
        name: 'Hấp Huyết',
        type: 'active',
        description: 'Hút máu từ kẻ địch, hồi 50% sát thương gây ra.',
        cooldown: 6,
        damage_multiplier: 120,
        target_type: 'single',
        aoe_radius: null,
      },
    ],
  },
  {
    template: {
      name: 'Độc Cổ',
      rank: 1,
      element: 'Poison',
      role: 'control',
      quality: 'common',
      description: 'Cổ Trùng hệ Độc. Gây độc lên kẻ địch, giảm tốc và sát thương theo thời gian.',
      sprite: 'gu_poison',
      is_immortal: 'false',
      unique_world: 'false',
      max_enhance: 20,
      can_evolve: 'true',
    },
    stats: { hp: 0, atk: 15, def: 0, crit: 3, crit_damage: 0, move_speed: 0, attack_speed: 0, life_steal: 0 },
    skills: [
      {
        skill_id: 'poison_sting',
        name: 'Độc Châm',
        type: 'active',
        description: 'Tiêm độc vào kẻ địch, gây sát thương độc trong 5 giây.',
        cooldown: 4,
        damage_multiplier: 100,
        target_type: 'single',
        aoe_radius: null,
      },
    ],
  },
];

// Synergy seeds
export const guSynergySeeds = [
  {
    gu_a: '', // filled at runtime with Hỏa Cổ template ID
    gu_b: '', // filled at runtime with Phong Cổ template ID
    result_name: 'Hỏa Phong Bạo',
    result_description: 'Hỏa + Phong = Bão Lửa. Tăng 15% sát thương Hỏa.',
    result_skill_id: 'fire_storm',
    bonus_hp: 0,
    bonus_atk: 15,
    bonus_def: 0,
  },
];
