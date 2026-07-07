import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  text,
  jsonb,
  boolean,
} from 'drizzle-orm/pg-core';

// ============================================================
// ACCOUNT MODULE
// ============================================================

export const accounts = pgTable('accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  password_hash: text('password_hash').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const accountSessions = pgTable('account_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  account_id: uuid('account_id')
    .notNull()
    .references(() => accounts.id, { onDelete: 'cascade' }),
  refresh_token: text('refresh_token').notNull(),
  expired_at: timestamp('expired_at').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================
// THAP TUYET THE MODULE (Body Constitution — 10 Thập Tuyệt Thể)
// ============================================================

export const bodyConstitutions = pgTable('body_constitutions', {
  id: integer('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description').notNull(),
  // Passive stat bonuses applied at character creation (JSON: { hp_pct, atk_pct, def_pct, ... })
  stat_bonuses: jsonb('stat_bonuses').notNull().default({}),
  // Unique passive ability identifier (e.g. "blood_regen", "poison_immune")
  passive_ability: varchar('passive_ability', { length: 100 }).notNull(),
  // Description of the passive shown in UI
  passive_description: text('passive_description').notNull(),
  // Realm unlock bonus (some constitutions scale with breakthrough)
  realm_scaling: boolean('realm_scaling').notNull().default(false),
  // Rarity tier: common | rare | epic | legendary
  rarity: varchar('rarity', { length: 20 }).notNull().default('rare'),
  // Weakness displayed in UI (e.g. "Attack thấp, không có Crit")
  weakness: varchar('weakness', { length: 255 }).notNull().default(''),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================
// PLAYER MODULE
// ============================================================

export const players = pgTable('players', {
  id: uuid('id').defaultRandom().primaryKey(),
  account_id: uuid('account_id')
    .notNull()
    .unique()
    .references(() => accounts.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 50 }).notNull(),
  realm: integer('realm').notNull().default(1),
  dao_id: uuid('dao_id'),
  constitution_id: integer('constitution_id').references(() => bodyConstitutions.id),
  exp: integer('exp').notNull().default(0),
  hp: integer('hp').notNull().default(100),
  mana: integer('mana').notNull().default(50),
  gold: integer('gold').notNull().default(0),
  spirit_stone: integer('spirit_stone').notNull().default(0),
  current_map: varchar('current_map', { length: 100 }).notNull().default('bac_nguyen_village'),
  current_x: integer('current_x').notNull().default(0),
  current_y: integer('current_y').notNull().default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================
// GU MODULE
// ============================================================

// Gu Templates — danh sách cổ (mẫu)
export const guTemplates = pgTable('gu_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  rank: integer('rank').notNull().default(1),
  dao_affinity: varchar('dao_affinity', { length: 50 }),
  description: text('description'),
  effects: jsonb('effects').notNull().default({}),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Player Gu — cổ người chơi sở hữu
export const playerGu = pgTable('player_gu', {
  id: uuid('id').defaultRandom().primaryKey(),
  player_id: uuid('player_id')
    .notNull()
    .references(() => players.id, { onDelete: 'cascade' }),
  gu_id: uuid('gu_id')
    .notNull()
    .references(() => guTemplates.id, { onDelete: 'cascade' }),
  is_equipped: boolean('is_equipped').notNull().default(false),
  slot_index: integer('slot_index'),
  obtained_at: timestamp('obtained_at').defaultNow().notNull(),
});

// ============================================================
// ITEM MODULE
// ============================================================

export const itemTemplates = pgTable('item_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  rarity: varchar('rarity', { length: 20 }).notNull().default('common'),
  description: text('description'),
  effects: jsonb('effects').notNull().default({}),
  stack_limit: integer('stack_limit').notNull().default(99),
  sell_price: integer('sell_price').notNull().default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const playerInventory = pgTable('player_inventory', {
  id: uuid('id').defaultRandom().primaryKey(),
  player_id: uuid('player_id')
    .notNull()
    .references(() => players.id, { onDelete: 'cascade' }),
  item_id: uuid('item_id')
    .notNull()
    .references(() => itemTemplates.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
  obtained_at: timestamp('obtained_at').defaultNow().notNull(),
});

// ============================================================
// MONSTER MODULE
// ============================================================

export const monsterTemplates = pgTable('monster_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  realm: integer('realm').notNull().default(1),
  hp: integer('hp').notNull().default(100),
  atk: integer('atk').notNull().default(10),
  def: integer('def').notNull().default(5),
  spd: integer('spd').notNull().default(5),
  exp_reward: integer('exp_reward').notNull().default(10),
  gold_reward: integer('gold_reward').notNull().default(5),
  respawn_time: integer('respawn_time').notNull().default(60), // seconds
  ai_type: varchar('ai_type', { length: 50 }).notNull().default('passive'),
  drop_table: jsonb('drop_table').notNull().default([]),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const mapSpawns = pgTable('map_spawns', {
  id: uuid('id').defaultRandom().primaryKey(),
  map_id: varchar('map_id', { length: 100 }).notNull(),
  monster_id: uuid('monster_id')
    .notNull()
    .references(() => monsterTemplates.id, { onDelete: 'cascade' }),
  spawn_x: integer('spawn_x').notNull().default(0),
  spawn_y: integer('spawn_y').notNull().default(0),
  max_count: integer('max_count').notNull().default(1),
});

// ============================================================
// NPC MODULE
// ============================================================

export const npcs = pgTable('npcs', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('villager'),
  map_id: varchar('map_id', { length: 100 }).notNull(),
  x: integer('x').notNull().default(0),
  y: integer('y').notNull().default(0),
  sprite: varchar('sprite', { length: 100 }),
  dialogue_id: varchar('dialogue_id', { length: 100 }),
  shop_id: uuid('shop_id'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================
// DIALOGUE MODULE
// ============================================================

export const dialogues = pgTable('dialogues', {
  id: varchar('id', { length: 100 }).primaryKey(),
  speaker: varchar('speaker', { length: 100 }).notNull(),
  text: text('text').notNull(),
  choices: jsonb('choices').notNull().default([]),
  next_dialogue_id: varchar('next_dialogue_id', { length: 100 }),
  flag_key: varchar('flag_key', { length: 100 }),
  flag_value: varchar('flag_value', { length: 100 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================
// QUEST MODULE
// ============================================================

export const quests = pgTable('quests', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  type: varchar('type', { length: 50 }).notNull().default('main'),
  flag_required: varchar('flag_required', { length: 100 }),
  objectives: jsonb('objectives').notNull().default([]),
  rewards: jsonb('rewards').notNull().default({}),
  min_realm: integer('min_realm').notNull().default(1),
  is_repeatable: boolean('is_repeatable').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const playerQuests = pgTable('player_quests', {
  id: uuid('id').defaultRandom().primaryKey(),
  player_id: uuid('player_id')
    .notNull()
    .references(() => players.id, { onDelete: 'cascade' }),
  quest_id: uuid('quest_id')
    .notNull()
    .references(() => quests.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  progress: jsonb('progress').notNull().default({}),
  accepted_at: timestamp('accepted_at').defaultNow().notNull(),
  completed_at: timestamp('completed_at'),
});

export const storyFlags = pgTable('story_flags', {
  id: uuid('id').defaultRandom().primaryKey(),
  player_id: uuid('player_id')
    .notNull()
    .references(() => players.id, { onDelete: 'cascade' }),
  flag_key: varchar('flag_key', { length: 100 }).notNull(),
  flag_value: varchar('flag_value', { length: 100 }).notNull().default('true'),
  set_at: timestamp('set_at').defaultNow().notNull(),
});

// ============================================================
// EQUIPMENT MODULE
// ============================================================

export const equipmentTemplates = pgTable('equipment_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  slot: varchar('slot', { length: 50 }).notNull(),
  rarity: varchar('rarity', { length: 20 }).notNull().default('common'),
  required_realm: integer('required_realm').notNull().default(1),
  stat_bonuses: jsonb('stat_bonuses').notNull().default({}),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Player Equipment — trang bị người chơi sở hữu
export const playerEquipment = pgTable('player_equipment', {
  id: uuid('id').defaultRandom().primaryKey(),
  player_id: uuid('player_id')
    .notNull()
    .references(() => players.id, { onDelete: 'cascade' }),
  equipment_id: uuid('equipment_id')
    .notNull()
    .references(() => equipmentTemplates.id, { onDelete: 'cascade' }),
  enhancement: integer('enhancement').notNull().default(0),
  is_equipped: varchar('is_equipped', { length: 5 }).notNull().default('false'),
  slot_index: integer('slot_index'),
  obtained_at: timestamp('obtained_at').defaultNow().notNull(),
});

// ============================================================
// CRAFT MODULE
// ============================================================

// Craft Recipes — công thức chế tạo
export const craftRecipes = pgTable('craft_recipes', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  result_type: varchar('result_type', { length: 20 }).notNull(), // equipment, item, gu
  result_id: uuid('result_id').notNull(), // FK linh hoạt: equipment_templates, item_templates, gu_templates
  result_quantity: integer('result_quantity').notNull().default(1),
  required_gold: integer('required_gold').notNull().default(0),
  success_rate: integer('success_rate').notNull().default(100),
  min_realm: integer('min_realm').notNull().default(1),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Recipe Materials — nguyên liệu cho công thức
export const recipeMaterials = pgTable('recipe_materials', {
  id: uuid('id').defaultRandom().primaryKey(),
  recipe_id: uuid('recipe_id')
    .notNull()
    .references(() => craftRecipes.id, { onDelete: 'cascade' }),
  item_id: uuid('item_id')
    .notNull()
    .references(() => itemTemplates.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
});

// Craft Logs — lịch sử chế tạo
export const craftLogs = pgTable('craft_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  player_id: uuid('player_id')
    .notNull()
    .references(() => players.id, { onDelete: 'cascade' }),
  recipe_id: uuid('recipe_id')
    .notNull()
    .references(() => craftRecipes.id, { onDelete: 'cascade' }),
  result_type: varchar('result_type', { length: 20 }).notNull(),
  result_id: uuid('result_id').notNull(),
  success: boolean('success').notNull().default(true),
  crafted_at: timestamp('crafted_at').defaultNow().notNull(),
});

// ============================================================
// CULTIVATION MODULE
// ============================================================

export const cultivationRealms = pgTable('cultivation_realms', {
  id: integer('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  level: integer('level').notNull(),
  exp_required: integer('exp_required').notNull().default(0),
  max_hp_bonus: integer('max_hp_bonus').notNull().default(0),
  max_mana_bonus: integer('max_mana_bonus').notNull().default(0),
  atk_bonus: integer('atk_bonus').notNull().default(0),
  def_bonus: integer('def_bonus').notNull().default(0),
  breakthrough_gold: integer('breakthrough_gold').notNull().default(0),
  breakthrough_item_id: uuid('breakthrough_item_id'),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Player Cultivation — tiến độ tu luyện của player
export const playerCultivation = pgTable('player_cultivation', {
  id: uuid('id').defaultRandom().primaryKey(),
  player_id: uuid('player_id')
    .notNull()
    .unique()
    .references(() => players.id, { onDelete: 'cascade' }),
  realm_level: integer('realm_level').notNull().default(1),
  experience: integer('experience').notNull().default(0),
  breakthrough_count: integer('breakthrough_count').notNull().default(0),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================
// SAVE SYSTEM (Sprint 6)
// ============================================================

export const playerSaves = pgTable('player_saves', {
  id: uuid('id').defaultRandom().primaryKey(),
  player_id: uuid('player_id')
    .notNull()
    .references(() => players.id, { onDelete: 'cascade' }),
  save_name: varchar('save_name', { length: 100 }).notNull(),
  is_auto: varchar('is_auto', { length: 5 }).notNull().default('false'),
  save_data: jsonb('save_data').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================
// WORLD MAPS (Sprint 6)
// ============================================================

export const worldMaps = pgTable('world_maps', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  region: varchar('region', { length: 50 }).notNull(), // bac_nguyen, nam_cuong, etc.
  recommended_realm: integer('recommended_realm').notNull().default(1),
  is_safe_zone: varchar('is_safe_zone', { length: 5 }).notNull().default('false'),
  background: varchar('background', { length: 255 }),
  width: integer('width').notNull().default(2000),
  height: integer('height').notNull().default(2000),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const mapPortals = pgTable('map_portals', {
  id: uuid('id').defaultRandom().primaryKey(),
  from_map_id: varchar('from_map_id', { length: 100 }).notNull(),
  to_map_id: varchar('to_map_id', { length: 100 }).notNull(),
  from_x: integer('from_x').notNull(),
  from_y: integer('from_y').notNull(),
  to_x: integer('to_x').notNull(),
  to_y: integer('to_y').notNull(),
  label: varchar('label', { length: 100 }),
  min_realm: integer('min_realm').notNull().default(1),
});
