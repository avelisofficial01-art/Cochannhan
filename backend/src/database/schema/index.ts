import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  text,
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
// PLAYER STATS MODULE
// Chỉ lưu bonus vĩnh viễn (thưởng cốt truyện, thành tựu)
// ============================================================

export const playerStats = pgTable('player_stats', {
  id: uuid('id').defaultRandom().primaryKey(),
  player_id: uuid('player_id')
    .notNull()
    .unique()
    .references(() => players.id, { onDelete: 'cascade' }),
  hp_bonus: integer('hp_bonus').notNull().default(0),
  atk_bonus: integer('atk_bonus').notNull().default(0),
  def_bonus: integer('def_bonus').notNull().default(0),
  crit_bonus: integer('crit_bonus').notNull().default(0),
  move_speed: integer('move_speed').notNull().default(300),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================
// WORLD MODULE
// ============================================================

export const maps = pgTable('maps', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  background: varchar('background', { length: 255 }).notNull().default('default'),
  music: varchar('music', { length: 255 }),
  level_min: integer('level_min').notNull().default(1),
  level_max: integer('level_max').notNull().default(9),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const portals = pgTable('portals', {
  id: uuid('id').defaultRandom().primaryKey(),
  from_map: uuid('from_map')
    .notNull()
    .references(() => maps.id, { onDelete: 'cascade' }),
  to_map: uuid('to_map')
    .notNull()
    .references(() => maps.id, { onDelete: 'cascade' }),
  x: integer('x').notNull(),
  y: integer('y').notNull(),
  condition: text('condition'),
});

export const hiddenAreas = pgTable('hidden_areas', {
  id: uuid('id').defaultRandom().primaryKey(),
  map_id: uuid('map_id')
    .notNull()
    .references(() => maps.id, { onDelete: 'cascade' }),
  condition: text('condition').notNull(),
  reward: text('reward'),
});

// ============================================================
// SYSTEM MODULE
// ============================================================

export const gameConfig = pgTable('game_config', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value').notNull(),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================
// NPC MODULE
// ============================================================

export const npcTemplates = pgTable('npc_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  sprite: varchar('sprite', { length: 255 }).notNull().default('char_2'),
  faction: varchar('faction', { length: 50 }).notNull().default('neutral'),
  occupation: varchar('occupation', { length: 50 }).notNull(),
  map_id: uuid('map_id')
    .notNull()
    .references(() => maps.id, { onDelete: 'cascade' }),
  x: integer('x').notNull().default(0),
  y: integer('y').notNull().default(0),
  affection_min: integer('affection_min').notNull().default(-100),
  affection_max: integer('affection_max').notNull().default(100),
  has_shop: varchar('has_shop', { length: 5 }).notNull().default('false'),
  schedule: text('schedule'), // JSON: [{time: "06:00", action: "wake"}]
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const npcDialogues = pgTable('npc_dialogues', {
  id: uuid('id').defaultRandom().primaryKey(),
  npc_id: uuid('npc_id')
    .notNull()
    .references(() => npcTemplates.id, { onDelete: 'cascade' }),
  order_index: integer('order_index').notNull().default(0),
  text: text('text').notNull(),
  speaker: varchar('speaker', { length: 50 }).notNull().default('npc'),
  choices: text('choices'), // JSON: [{text: "...", next_dialogue_id: "..."}]
  condition_flag: varchar('condition_flag', { length: 100 }), // story flag required
  condition_affection_min: integer('condition_affection_min'),
  set_flag: varchar('set_flag', { length: 100 }), // story flag to set after dialogue
  next_dialogue_id: uuid('next_dialogue_id'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================
// QUEST MODULE
// ============================================================

export const questTemplates = pgTable('quest_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  type: varchar('type', { length: 20 }).notNull().default('side'), // main, side, hidden, daily, legendary, faction
  description: text('description').notNull(),
  npc_giver_id: uuid('npc_giver_id')
    .references(() => npcTemplates.id, { onDelete: 'set null' }),
  prerequisites: text('prerequisites'), // JSON: [{type: "quest", id: "..."}, {type: "flag", key: "..."}]
  objectives: text('objectives').notNull(), // JSON: [{type: "kill"|"collect"|"talk"|"reach", target: "...", count: N, description: "..."}]
  rewards: text('rewards'), // JSON: [{type: "gold"|"spirit_stone"|"item"|"exp", amount: N, item_id: "..."}]
  flag_required: varchar('flag_required', { length: 100 }), // story flag required to accept
  flag_complete: varchar('flag_complete', { length: 100 }), // story flag set on complete
  is_repeatable: varchar('is_repeatable', { length: 5 }).notNull().default('false'),
  min_realm: integer('min_realm').notNull().default(1),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const playerQuests = pgTable('player_quests', {
  id: uuid('id').defaultRandom().primaryKey(),
  player_id: uuid('player_id')
    .notNull()
    .references(() => players.id, { onDelete: 'cascade' }),
  quest_id: uuid('quest_id')
    .notNull()
    .references(() => questTemplates.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 20 }).notNull().default('active'), // active, completed, failed
  objectives_progress: text('objectives_progress').notNull().default('[]'), // JSON: [{index: 0, current: 0, target: N}]
  accepted_at: timestamp('accepted_at').defaultNow().notNull(),
  completed_at: timestamp('completed_at'),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================
// STORY MODULE
// ============================================================

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
// INVENTORY MODULE
// ============================================================

export const itemTemplates = pgTable('item_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  type: varchar('type', { length: 30 }).notNull(), // equipment, consumable, material, quest_item, gu
  description: text('description'),
  stackable: varchar('stackable', { length: 5 }).notNull().default('false'),
  max_stack: integer('max_stack').notNull().default(1),
  sell_price: integer('sell_price').notNull().default(0),
  sprite: varchar('sprite', { length: 255 }),
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
  slot: integer('slot').notNull().default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================
// COMBAT MODULE
// ============================================================

export const monsterTemplates = pgTable('monster_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  realm: integer('realm').notNull().default(1),
  hp: integer('hp').notNull().default(50),
  atk: integer('atk').notNull().default(10),
  def: integer('def').notNull().default(5),
  speed: integer('speed').notNull().default(200),
  element: varchar('element', { length: 30 }).notNull().default('physical'),
  sprite: varchar('sprite', { length: 255 }).notNull().default('monster_1'),
  drop_table: text('drop_table'), // JSON: [{itemId, chance, quantityMin, quantityMax}]
  map_id: uuid('map_id')
    .notNull()
    .references(() => maps.id, { onDelete: 'cascade' }),
  respawn_time: integer('respawn_time').notNull().default(30), // seconds
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const combatLogs = pgTable('combat_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  player_id: uuid('player_id')
    .notNull()
    .references(() => players.id, { onDelete: 'cascade' }),
  monster_id: uuid('monster_id').notNull(),
  damage: integer('damage').notNull(),
  skill: varchar('skill', { length: 100 }),
  is_critical: varchar('is_critical', { length: 5 }).notNull().default('false'),
  damage_type: varchar('damage_type', { length: 30 }).notNull().default('physical'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================
// GU MODULE
// ============================================================

// Gu Template — định nghĩa Cổ Trùng
export const guTemplates = pgTable('gu_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  rank: integer('rank').notNull().default(1), // 1-9 Chuyển
  element: varchar('element', { length: 30 }).notNull(),
  role: varchar('role', { length: 30 }).notNull(), // damage, tank, support, control, summon, utility, economy
  quality: varchar('quality', { length: 20 }).notNull().default('common'), // common, rare, epic, legendary, immortal
  description: text('description'),
  sprite: varchar('sprite', { length: 255 }),
  is_immortal: varchar('is_immortal', { length: 5 }).notNull().default('false'),
  unique_world: varchar('unique_world', { length: 5 }).notNull().default('false'),
  max_enhance: integer('max_enhance').notNull().default(20),
  can_evolve: varchar('can_evolve', { length: 5 }).notNull().default('true'),
  evolve_to: uuid('evolve_to'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Gu Stats — chỉ số Cổ Trùng (cộng trực tiếp vào player)
export const guStats = pgTable('gu_stats', {
  id: uuid('id').defaultRandom().primaryKey(),
  gu_template_id: uuid('gu_template_id')
    .notNull()
    .unique()
    .references(() => guTemplates.id, { onDelete: 'cascade' }),
  hp: integer('hp').notNull().default(0),
  atk: integer('atk').notNull().default(0),
  def: integer('def').notNull().default(0),
  crit: integer('crit').notNull().default(0),
  crit_damage: integer('crit_damage').notNull().default(0),
  move_speed: integer('move_speed').notNull().default(0),
  attack_speed: integer('attack_speed').notNull().default(0),
  life_steal: integer('life_steal').notNull().default(0), // percentage * 100
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Gu Skills — kỹ năng Cổ Trùng
export const guSkills = pgTable('gu_skills', {
  id: uuid('id').defaultRandom().primaryKey(),
  gu_template_id: uuid('gu_template_id')
    .notNull()
    .references(() => guTemplates.id, { onDelete: 'cascade' }),
  skill_id: varchar('skill_id', { length: 100 }).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(), // active, passive, aura, trigger
  description: text('description'),
  cooldown: integer('cooldown').notNull().default(0), // seconds, 0 = passive/aura
  damage_multiplier: integer('damage_multiplier').notNull().default(100), // percentage
  target_type: varchar('target_type', { length: 20 }).notNull().default('single'), // single, aoe, self
  aoe_radius: integer('aoe_radius'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Player Gu — Gu mà player sở hữu
export const playerGu = pgTable('player_gu', {
  id: uuid('id').defaultRandom().primaryKey(),
  player_id: uuid('player_id')
    .notNull()
    .references(() => players.id, { onDelete: 'cascade' }),
  gu_template_id: uuid('gu_template_id')
    .notNull()
    .references(() => guTemplates.id, { onDelete: 'cascade' }),
  level: integer('level').notNull().default(1),
  enhancement: integer('enhancement').notNull().default(0),
  mastery: integer('mastery').notNull().default(0),
  bond_level: integer('bond_level').notNull().default(0),
  is_equipped: varchar('is_equipped', { length: 5 }).notNull().default('false'),
  slot_index: integer('slot_index'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Gu Synergy — cộng hưởng giữa các Cổ Trùng
export const guSynergy = pgTable('gu_synergy', {
  id: uuid('id').defaultRandom().primaryKey(),
  gu_a: uuid('gu_a')
    .notNull()
    .references(() => guTemplates.id, { onDelete: 'cascade' }),
  gu_b: uuid('gu_b')
    .notNull()
    .references(() => guTemplates.id, { onDelete: 'cascade' }),
  result_name: varchar('result_name', { length: 200 }).notNull(),
  result_description: text('result_description'),
  result_skill_id: varchar('result_skill_id', { length: 100 }),
  bonus_hp: integer('bonus_hp').notNull().default(0),
  bonus_atk: integer('bonus_atk').notNull().default(0),
  bonus_def: integer('bonus_def').notNull().default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
