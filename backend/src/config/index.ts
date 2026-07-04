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

// ============================================================
// SEED DATA — Equipment Templates
// ============================================================

export const equipmentSeeds = [
  {
    name: 'Thanh Đồng Kiếm',
    type: 'weapon',
    slot: 'main_hand',
    tier: 'common',
    base_hp: 0,
    base_atk: 25,
    base_def: 0,
    base_crit: 5,
    required_level: 1,
    description: 'Thanh kiếm đồng xanh cổ xưa, vẫn còn sắc bén sau bao năm.',
    icon: 'eq_vu_khi_st',
  },
  {
    name: 'Mộc Trượng',
    type: 'weapon',
    slot: 'main_hand',
    tier: 'common',
    base_hp: 50,
    base_atk: 15,
    base_def: 0,
    base_crit: 0,
    required_level: 1,
    description: 'Trượng gỗ trăm năm, có linh khí nhẹ nhàng.',
    icon: 'eq_vu_khi_h',
  },
  {
    name: 'Liệp Cung',
    type: 'weapon',
    slot: 'main_hand',
    tier: 'common',
    base_hp: 0,
    base_atk: 20,
    base_def: 0,
    base_crit: 10,
    required_level: 1,
    description: 'Cung săn bắn của thợ săn Bắc Nguyên.',
    icon: 'eq_vu_khi_pt',
  },
  {
    name: 'Bì Giáp',
    type: 'armor',
    slot: 'body',
    tier: 'common',
    base_hp: 100,
    base_atk: 0,
    base_def: 15,
    base_crit: 0,
    required_level: 1,
    description: 'Giáp da thú đơn giản nhưng chắc chắn.',
    icon: 'eq_giap_st',
  },
  {
    name: 'Mộc Thuẫn',
    type: 'armor',
    slot: 'off_hand',
    tier: 'common',
    base_hp: 50,
    base_atk: 0,
    base_def: 25,
    base_crit: 0,
    required_level: 1,
    description: 'Thuẫn gỗ cứng cáp, chặn được hầu hết đòn tấn công nhẹ.',
    icon: 'eq_giap_h',
  },
];

// ============================================================
// SEED DATA — Craft Recipes
// ============================================================

export const recipeSeeds = [
  {
    name: 'Rèn Thanh Đồng Kiếm',
    result_type: 'equipment',
    result_name: 'Thanh Đồng Kiếm',
    required_gold: 200,
    success_rate: 80,
    min_realm: 0,
    materials: [
      { item_name: 'Quặng Sắt', quantity: 3 },
    ],
  },
  {
    name: 'Chế Bì Giáp',
    result_type: 'equipment',
    result_name: 'Bì Giáp',
    required_gold: 150,
    success_rate: 80,
    min_realm: 0,
    materials: [
      { item_name: 'Da Thú', quantity: 3 },
    ],
  },
  {
    name: 'Chế Dược Hoàn Sơ Cấp',
    result_type: 'item',
    result_name: 'Dược Hoàn Sơ Cấp',
    required_gold: 100,
    success_rate: 90,
    min_realm: 0,
    materials: [
      { item_name: 'Thảo Dược', quantity: 2 },
    ],
  },
];

// ============================================================
// SEED DATA — Bắc Nguyên Monster Templates (Sprint 6)
// ============================================================

export const bacNguyenMonsterSeeds = [
  {
    ref: 'wolf_01',
    name: 'Sói Tuyết',
    realm: 'pham_nhan',
    hp: 100,
    atk: 15,
    def: 6,
    speed: 5,
    element: 'ice',
    sprite: 'mob_wolf',
    drop_table: JSON.stringify([
      { itemName: 'Lông Thú', chance: 0.7, minQuantity: 1, maxQuantity: 3 },
      { itemName: 'Đá Linh Hồn', chance: 0.2, minQuantity: 1, maxQuantity: 3 },
    ]),
    map_id: 'bac_nguyen',
    respawn_time: 30,
  },
  {
    ref: 'bear_01',
    name: 'Gấu Trắng',
    realm: 'pham_nhan',
    hp: 200,
    atk: 22,
    def: 12,
    speed: 3,
    element: 'physical',
    sprite: 'mob_bear',
    drop_table: JSON.stringify([
      { itemName: 'Da Thú', chance: 0.6, minQuantity: 1, maxQuantity: 3 },
      { itemName: 'Đá Linh Hồn', chance: 0.25, minQuantity: 2, maxQuantity: 5 },
    ]),
    map_id: 'bac_nguyen',
    respawn_time: 45,
  },
  {
    ref: 'rabbit_01',
    name: 'Thỏ Tuyết',
    realm: 'pham_nhan',
    hp: 60,
    atk: 10,
    def: 3,
    speed: 8,
    element: 'ice',
    sprite: 'mob_rabbit',
    drop_table: JSON.stringify([
      { itemName: 'Lông Thú', chance: 0.5, minQuantity: 1, maxQuantity: 2 },
      { itemName: 'Thảo Dược', chance: 0.3, minQuantity: 1, maxQuantity: 2 },
    ]),
    map_id: 'bac_nguyen',
    respawn_time: 20,
  },
  {
    ref: 'eagle_01',
    name: 'Ưng Bắc Nguyên',
    realm: 'luyen_khi',
    hp: 150,
    atk: 25,
    def: 8,
    speed: 7,
    element: 'wind',
    sprite: 'mob_eagle',
    drop_table: JSON.stringify([
      { itemName: 'Đá Linh Hồn', chance: 0.4, minQuantity: 2, maxQuantity: 6 },
      { itemName: 'Lông Thú', chance: 0.5, minQuantity: 1, maxQuantity: 3 },
    ]),
    map_id: 'bac_nguyen',
    respawn_time: 50,
  },
];

export const bossSeeds = [
  {
    ref: 'boss_wolf_king',
    name: 'Bạch Lang Vương',
    realm: 'luyen_khi',
    hp: 800,
    atk: 35,
    def: 20,
    speed: 6,
    element: 'ice',
    sprite: 'boss_wolf_king',
    drop_table: JSON.stringify([
      { itemName: 'Đá Linh Hồn', chance: 1.0, minQuantity: 10, maxQuantity: 20 },
      { itemName: 'Tinh Hoa Băng', chance: 1.0, minQuantity: 1, maxQuantity: 1 },
      { itemName: 'Da Thú', chance: 0.8, minQuantity: 3, maxQuantity: 6 },
    ]),
    map_id: 'bac_nguyen',
    respawn_time: 300,
  },
];

// ============================================================
// SEED DATA — World Maps (Sprint 6)
// ============================================================

export const worldMapSeeds = [
  { ref: 'lang_cothao', name: 'Làng Cổ Thảo', region: 'bac_nguyen', recommended_realm: 1, is_safe_zone: 'true', background: 'bg_village', width: 1500, height: 1500 },
  { ref: 'dongco_hoang', name: 'Đồng Cỏ Hoang', region: 'bac_nguyen', recommended_realm: 1, is_safe_zone: 'false', background: 'bg_grassland', width: 2500, height: 2000 },
  { ref: 'rung_tuyet', name: 'Rừng Tuyết', region: 'bac_nguyen', recommended_realm: 1, is_safe_zone: 'false', background: 'bg_snow_forest', width: 3000, height: 2500 },
  { ref: 'dinh_bangphong', name: 'Đỉnh Băng Phong', region: 'bac_nguyen', recommended_realm: 2, is_safe_zone: 'false', background: 'bg_ice_peak', width: 2000, height: 2000 },
  { ref: 'canhdong_tuyet', name: 'Cánh Đồng Tuyết', region: 'bac_nguyen', recommended_realm: 1, is_safe_zone: 'false', background: 'bg_snow_field', width: 2500, height: 2000 },
];

export const mapPortalSeeds = [
  { from_map_ref: 'lang_cothao', to_map_ref: 'dongco_hoang', from_x: 1400, from_y: 750, to_x: 100, to_y: 1000, portal_name: 'Cổng Làng → Đồng Cỏ' },
  { from_map_ref: 'dongco_hoang', to_map_ref: 'lang_cothao', from_x: 80, from_y: 1000, to_x: 1350, to_y: 750, portal_name: 'Quay về Làng' },
  { from_map_ref: 'dongco_hoang', to_map_ref: 'rung_tuyet', from_x: 2400, from_y: 1000, to_x: 100, to_y: 1250, portal_name: 'Đường Rừng → Núi' },
  { from_map_ref: 'rung_tuyet', to_map_ref: 'dongco_hoang', from_x: 80, from_y: 1250, to_x: 2350, to_y: 1000, portal_name: 'Quay về Đồng Cỏ' },
  { from_map_ref: 'rung_tuyet', to_map_ref: 'dinh_bangphong', from_x: 1500, from_y: 50, to_x: 1000, to_y: 1900, portal_name: 'Dốc Băng' },
  { from_map_ref: 'dinh_bangphong', to_map_ref: 'rung_tuyet', from_x: 1000, from_y: 1950, to_x: 1450, to_y: 100, portal_name: 'Xuống Rừng' },
  { from_map_ref: 'dinh_bangphong', to_map_ref: 'canhdong_tuyet', from_x: 100, from_y: 1000, to_x: 2400, to_y: 1000, portal_name: 'Triền Núi → Đồng' },
  { from_map_ref: 'canhdong_tuyet', to_map_ref: 'dinh_bangphong', from_x: 2450, from_y: 1000, to_x: 150, to_y: 1000, portal_name: 'Lên Núi' },
];

export const mapSpawnSeeds = [
  // Làng Cổ Thảo (safe zone with 2 weak practice monsters near outskirts)
  { map_ref: 'lang_cothao', spawn_type: 'monster', spawn_ref: 'Thỏ Tuyết', x: 1600, y: 600, respawn_time: 15 },
  { map_ref: 'lang_cothao', spawn_type: 'monster', spawn_ref: 'Thỏ Tuyết', x: 200, y: 1600, respawn_time: 15 },
  { map_ref: 'lang_cothao', spawn_type: 'npc', spawn_ref: 'Trưởng làng', x: 500, y: 400, respawn_time: 30 },
  { map_ref: 'lang_cothao', spawn_type: 'npc', spawn_ref: 'Thợ rèn', x: 600, y: 300, respawn_time: 30 },
  { map_ref: 'lang_cothao', spawn_type: 'npc', spawn_ref: 'Thương nhân', x: 400, y: 500, respawn_time: 30 },
  { map_ref: 'lang_cothao', spawn_type: 'npc', spawn_ref: 'Trưởng lão', x: 700, y: 450, respawn_time: 30 },
  // Đồng Cỏ Hoang
  { map_ref: 'dongco_hoang', spawn_type: 'monster', spawn_ref: 'Sói Tuyết', x: 500, y: 600, respawn_time: 30 },
  { map_ref: 'dongco_hoang', spawn_type: 'monster', spawn_ref: 'Sói Tuyết', x: 1200, y: 400, respawn_time: 30 },
  { map_ref: 'dongco_hoang', spawn_type: 'monster', spawn_ref: 'Thỏ Tuyết', x: 800, y: 300, respawn_time: 20 },
  { map_ref: 'dongco_hoang', spawn_type: 'monster', spawn_ref: 'Thỏ Tuyết', x: 1500, y: 700, respawn_time: 20 },
  // Rừng Tuyết
  { map_ref: 'rung_tuyet', spawn_type: 'monster', spawn_ref: 'Sói Tuyết', x: 600, y: 800, respawn_time: 30 },
  { map_ref: 'rung_tuyet', spawn_type: 'monster', spawn_ref: 'Gấu Trắng', x: 1200, y: 500, respawn_time: 45 },
  { map_ref: 'rung_tuyet', spawn_type: 'monster', spawn_ref: 'Gấu Trắng', x: 2000, y: 1000, respawn_time: 45 },
  { map_ref: 'rung_tuyet', spawn_type: 'monster', spawn_ref: 'Thỏ Tuyết', x: 800, y: 1500, respawn_time: 20 },
  // Đỉnh Băng Phong
  { map_ref: 'dinh_bangphong', spawn_type: 'monster', spawn_ref: 'Ưng Bắc Nguyên', x: 500, y: 500, respawn_time: 50 },
  { map_ref: 'dinh_bangphong', spawn_type: 'monster', spawn_ref: 'Ưng Bắc Nguyên', x: 1500, y: 600, respawn_time: 50 },
  { map_ref: 'dinh_bangphong', spawn_type: 'monster', spawn_ref: 'Sói Tuyết', x: 1000, y: 1200, respawn_time: 30 },
  { map_ref: 'dinh_bangphong', spawn_type: 'boss', spawn_ref: 'Bạch Lang Vương', x: 1000, y: 500, respawn_time: 300 },
  // Cánh Đồng Tuyết
  { map_ref: 'canhdong_tuyet', spawn_type: 'monster', spawn_ref: 'Sói Tuyết', x: 700, y: 500, respawn_time: 30 },
  { map_ref: 'canhdong_tuyet', spawn_type: 'monster', spawn_ref: 'Thỏ Tuyết', x: 400, y: 1000, respawn_time: 20 },
  { map_ref: 'canhdong_tuyet', spawn_type: 'monster', spawn_ref: 'Gấu Trắng', x: 1800, y: 800, respawn_time: 45 },
];

// ============================================================
// SEED DATA — Chapter 1 Dialogues (Sprint 6)
// ============================================================

export const dialogueSeeds = [
  // ─── Trưởng làng (Làng Cổ Thảo) ─────────────────────────
  {
    ref: 'dlg_village_chief_intro',
    npc_ref: 'Trưởng làng',
    order_index: 0,
    text: 'Chào mừng ngươi đến Làng Cổ Thảo, lữ khách. Ta là trưởng làng nơi đây. Ngươi có vẻ mệt mỏi sau chặng đường dài — hãy nghỉ ngơi đã.',
    speaker: 'Trưởng làng',
    set_flag: 'ch1_intro_done',
  },
  {
    ref: 'dlg_village_chief_threat',
    npc_ref: 'Trưởng làng',
    order_index: 1,
    text: 'Thật không may, làng ta đang gặp nguy hiểm. Bầy Sói Tuyết từ Đồng Cỏ Hoang ngày càng hung hãn. Chúng đã tấn công mấy người dân trong làng rồi.',
    speaker: 'Trưởng làng',
    condition_flag: 'ch1_intro_done',
    set_flag: 'ch1_threat_known',
    choices: JSON.stringify([
      { text: 'Để ta giúp!', next_dialogue_ref: 'dlg_village_chief_accept' },
      { text: 'Kể thêm cho ta nghe...', next_dialogue_ref: 'dlg_village_chief_detail' },
    ]),
  },
  {
    ref: 'dlg_village_chief_detail',
    npc_ref: 'Trưởng làng',
    order_index: 2,
    text: 'Đồng Cỏ Hoang nằm ở phía Đông ngôi làng. Ở đó có rất nhiều Sói Tuyết. Những thợ săn của làng không đủ sức chống lại chúng.',
    speaker: 'Trưởng làng',
  },
  {
    ref: 'dlg_village_chief_accept',
    npc_ref: 'Trưởng làng',
    order_index: 3,
    text: 'Cảm ơn ngươi, lữ khách dũng cảm! Hãy đến Đồng Cỏ Hoang và tiêu diệt 3 con Sói Tuyết. Làng chúng ta sẽ mãi ghi ơn.',
    speaker: 'Trưởng làng',
    set_flag: 'ch1_quest_wolves_accepted',
  },
  {
    ref: 'dlg_village_chief_thanks',
    npc_ref: 'Trưởng làng',
    order_index: 4,
    text: 'Ngươi đã làm được! Làng chúng ta an toàn hơn rồi. Nhưng... ta e rằng vấn đề còn lớn hơn thế. Hãy đến gặp Trưởng lão — ông ấy có điều quan trọng muốn nói.',
    speaker: 'Trưởng làng',
    condition_flag: 'ch1_wolves_hunted',
    set_flag: 'ch1_sent_to_elder',
  },
  // ─── Trưởng lão (Làng Cổ Thảo) ─────────────────────────
  {
    ref: 'dlg_elder_intro',
    npc_ref: 'Trưởng lão',
    order_index: 0,
    text: 'Ta đã chờ ngươi... từ rất lâu rồi. Ngồi xuống đi, lữ khách.',
    speaker: 'Trưởng lão',
    set_flag: 'ch1_elder_met',
  },
  {
    ref: 'dlg_elder_prophecy',
    npc_ref: 'Trưởng lão',
    order_index: 1,
    text: 'Ngàn năm trước, một con yêu thú khổng lồ xuất hiện ở Đỉnh Băng Phong — Bạch Lang Vương. Nó bị phong ấn bởi một vị tu sĩ cổ đại. Nhưng bây giờ... phong ấn đang yếu dần.',
    speaker: 'Trưởng lão',
    condition_flag: 'ch1_sent_to_elder',
    set_flag: 'ch1_prophecy_heard',
    choices: JSON.stringify([
      { text: 'Ta sẽ lên núi!', next_dialogue_ref: 'dlg_elder_bless' },
      { text: 'Phong ấn là gì?', next_dialogue_ref: 'dlg_elder_seal' },
    ]),
  },
  {
    ref: 'dlg_elder_seal',
    npc_ref: 'Trưởng lão',
    order_index: 2,
    text: 'Phong ấn là một trận pháp cổ xưa, dùng để giam giữ Bạch Lang Vương trên đỉnh núi. Nhưng sau ngàn năm, sức mạnh của nó đã suy yếu. Nếu không có ai ngăn chặn, nó sẽ thoát ra và hủy diệt cả vùng Bắc Nguyên.',
    speaker: 'Trưởng lão',
    set_flag: 'ch1_prophecy_heard',
  },
  {
    ref: 'dlg_elder_bless',
    npc_ref: 'Trưởng lão',
    order_index: 3,
    text: 'Dũng khí của ngươi khiến ta nhớ đến vị tu sĩ năm xưa. Hãy đến gặp Thợ rèn — ông ấy sẽ giúp ngươi chuẩn bị cho cuộc chiến. Đường lên Đỉnh Băng Phong rất nguy hiểm, qua Rừng Tuyết lạnh giá.',
    speaker: 'Trưởng lão',
    set_flag: 'ch1_sent_to_blacksmith',
  },
  {
    ref: 'dlg_elder_warning',
    npc_ref: 'Trưởng lão',
    order_index: 4,
    text: 'Hãy nhớ: Bạch Lang Vương có ba giai đoạn sức mạnh. Khi máu nó giảm xuống 70% và 40%, nó sẽ trở nên hung dữ hơn. Đừng chủ quan!',
    speaker: 'Trưởng lão',
    condition_flag: 'ch1_sent_to_blacksmith',
  },
  // ─── Thợ rèn (Làng Cổ Thảo) ──────────────────────────
  {
    ref: 'dlg_blacksmith_intro',
    npc_ref: 'Thợ rèn',
    order_index: 0,
    text: 'Hừm, một gương mặt mới. Ta là thợ rèn của làng. Cần vũ khí hay giáp trụ gì không?',
    speaker: 'Thợ rèn',
    set_flag: 'ch1_blacksmith_met',
  },
  {
    ref: 'dlg_blacksmith_quest',
    npc_ref: 'Thợ rèn',
    order_index: 1,
    text: 'Ồ, Trưởng lão bảo ngươi đến à? Được rồi, ta sẽ rèn cho ngươi một món vũ khí. Nhưng trước hết, hãy lên Đỉnh Băng Phong và mang về cho ta một ít Đá Linh Hồn.',
    speaker: 'Thợ rèn',
    condition_flag: 'ch1_sent_to_blacksmith',
    set_flag: 'ch1_blacksmith_quest',
  },
  {
    ref: 'dlg_blacksmith_reward',
    npc_ref: 'Thợ rèn',
    order_index: 2,
    text: 'Tốt lắm! Cầm lấy thanh kiếm này. Nó được tôi luyện từ băng hàn của Đỉnh Băng Phong — sẽ giúp ích cho ngươi trong trận chiến với Bạch Lang Vương.',
    speaker: 'Thợ rèn',
    condition_flag: 'ch1_reached_peak',
    set_flag: 'ch1_got_weapon',
  },
  // ─── Thương nhân (Làng Cổ Thảo) ──────────────────────
  {
    ref: 'dlg_merchant_intro',
    npc_ref: 'Thương nhân',
    order_index: 0,
    text: 'Chào khách! Hàng hóa của ta tốt nhất vùng Bắc Nguyên đấy. Bình máu, thức ăn, bản đồ — muốn gì cũng có!',
    speaker: 'Thương nhân',
  },
  {
    ref: 'dlg_merchant_tips',
    npc_ref: 'Thương nhân',
    order_index: 1,
    text: 'Nghe nói ngươi định đối đầu với Bạch Lang Vương? Mang theo nhiều bình máu vào. Và nếu có Thảo Dược thì càng tốt — nó giải độc được đấy.',
    speaker: 'Thương nhân',
    condition_flag: 'ch1_prophecy_heard',
  },
  {
    ref: 'dlg_merchant_rumor',
    npc_ref: 'Thương nhân',
    order_index: 2,
    text: 'Ta nghe nói ở Rừng Tuyết có Gấu Trắng rất hung dữ. Nhưng da của chúng bán được giá lắm. Tiện đường thì săn vài con nhé!',
    speaker: 'Thương nhân',
  },
];

// ============================================================
// SEED DATA — Chapter 1 Quests (Sprint 6)
// ============================================================

export const chapter1QuestSeeds = [
  {
    ref: 'q_ch1_awaken',
    name: 'Tỉnh Giấc Mộng',
    type: 'main',
    description: 'Ngươi tỉnh dậy ở một ngôi làng xa lạ giữa vùng Bắc Nguyên băng giá. Hãy tìm Trưởng làng để biết mình đang ở đâu.',
    npc_giver_ref: 'Trưởng làng',
    objectives: JSON.stringify([
      { type: 'talk', target: 'Trưởng làng', count: 1, description: 'Nói chuyện với Trưởng làng' },
    ]),
    rewards: JSON.stringify([
      { type: 'gold', amount: 50 },
      { type: 'exp', amount: 20 },
    ]),
    flag_complete: 'ch1_awakened',
    min_realm: 1,
  },
  // Q2: Mối Đe Dọa Sói Tuyết
  {
    ref: 'q_ch1_wolves',
    name: 'Mối Đe Dọa Sói Tuyết',
    type: 'main',
    description: 'Bầy Sói Tuyết đang đe dọa Làng Cổ Thảo. Hãy đến Đồng Cỏ Hoang và tiêu diệt 3 con Sói Tuyết để bảo vệ dân làng.',
    npc_giver_ref: 'Trưởng làng',
    prerequisites: JSON.stringify([
      { type: 'flag', key: 'ch1_awakened' },
    ]),
    objectives: JSON.stringify([
      { type: 'kill', target: 'Sói Tuyết', count: 3, description: 'Tiêu diệt Sói Tuyết ở Đồng Cỏ Hoang' },
    ]),
    rewards: JSON.stringify([
      { type: 'gold', amount: 100 },
      { type: 'exp', amount: 50 },
      { type: 'item', item_ref: 'Thảo Dược', amount: 3 },
    ]),
    flag_complete: 'ch1_wolves_hunted',
    min_realm: 1,
  },
  // Q3: Lời Tiên Tri Cổ
  {
    ref: 'q_ch1_prophecy',
    name: 'Lời Tiên Tri Cổ',
    type: 'main',
    description: 'Trưởng làng bảo ngươi đến gặp Trưởng lão bộ lạc — ông ấy nắm giữ bí mật về mối đe dọa thực sự của vùng Bắc Nguyên.',
    npc_giver_ref: 'Trưởng làng',
    prerequisites: JSON.stringify([
      { type: 'flag', key: 'ch1_wolves_hunted' },
    ]),
    objectives: JSON.stringify([
      { type: 'talk', target: 'Trưởng lão', count: 1, description: 'Nghe lời tiên tri từ Trưởng lão' },
    ]),
    rewards: JSON.stringify([
      { type: 'exp', amount: 50 },
      { type: 'item', item_ref: 'Mảnh Bản Đồ', amount: 1 },
    ]),
    flag_complete: 'ch1_prophecy_heard',
    min_realm: 1,
  },
  // Q4: Hành Trình Lên Núi
  {
    ref: 'q_ch1_journey',
    name: 'Hành Trình Lên Núi',
    type: 'main',
    description: 'Con đường đến Đỉnh Băng Phong đi qua Rừng Tuyết nguy hiểm. Hãy vượt qua mọi chướng ngại và đặt chân lên đỉnh núi.',
    npc_giver_ref: 'Thợ rèn',
    prerequisites: JSON.stringify([
      { type: 'flag', key: 'ch1_prophecy_heard' },
    ]),
    objectives: JSON.stringify([
      { type: 'reach', target: 'dinh_bangphong', count: 1, description: 'Đến Đỉnh Băng Phong' },
    ]),
    rewards: JSON.stringify([
      { type: 'gold', amount: 200 },
      { type: 'exp', amount: 100 },
      { type: 'item', item_ref: 'Kiếm Băng Hàn', amount: 1 },
    ]),
    flag_complete: 'ch1_reached_peak',
    min_realm: 1,
  },
  // Q5: Bạch Lang Vương
  {
    ref: 'q_ch1_boss',
    name: 'Bạch Lang Vương',
    type: 'main',
    description: 'Bạch Lang Vương — con yêu thú ngàn năm đang chờ trên Đỉnh Băng Phong. Đánh bại nó để giải thoát vùng Bắc Nguyên khỏi lời nguyền và mở khóa con đường tu luyện.',
    npc_giver_ref: null,
    prerequisites: JSON.stringify([
      { type: 'flag', key: 'ch1_reached_peak' },
    ]),
    objectives: JSON.stringify([
      { type: 'kill', target: 'Bạch Lang Vương', count: 1, description: 'Đánh bại Bạch Lang Vương' },
    ]),
    rewards: JSON.stringify([
      { type: 'gold', amount: 500 },
      { type: 'exp', amount: 300 },
      { type: 'item', item_ref: 'Tinh Hoa Băng', amount: 1 },
      { type: 'spirit_stone', amount: 10 },
    ]),
    flag_required: 'ch1_reached_peak',
    flag_complete: 'ch1_complete',
    min_realm: 1,
  },
];
