export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  code?: string;
  message?: string;
}

export interface TokenPayload {
  accountId: string;
  username: string;
}

export const ERROR_CODES = {
  INVALID_TOKEN: 'INVALID_TOKEN',
  PLAYER_NOT_FOUND: 'PLAYER_NOT_FOUND',
  ITEM_NOT_FOUND: 'ITEM_NOT_FOUND',
  GU_SLOT_FULL: 'GU_SLOT_FULL',
  REALM_TOO_LOW: 'REALM_TOO_LOW',
  NOT_ENOUGH_MATERIAL: 'NOT_ENOUGH_MATERIAL',
  IMMORTAL_GU_EXISTS: 'IMMORTAL_GU_EXISTS',
  INVENTORY_FULL: 'INVENTORY_FULL',
  QUEST_LOCKED: 'QUEST_LOCKED',
  STORY_LOCKED: 'STORY_LOCKED',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  MAP_NOT_FOUND: 'MAP_NOT_FOUND',
  PLAYER_ALREADY_EXISTS: 'PLAYER_ALREADY_EXISTS',
  PORTAL_LOCKED: 'PORTAL_LOCKED',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

// Account
export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  player: PlayerProfile | null;
}

export interface PlayerProfile {
  id: string;
  name: string;
  realm: number;
  daoId: string | null;
}

// Player Stats (computed final values)
export interface PlayerStatsResponse {
  hp: number;
  mana: number;
  atk: number;
  def: number;
  crit: number;
  critDamage: number;
  moveSpeed: number;
  realm: number;
  daoId: string | null;
}

// World
export interface MapInfo {
  id: string;
  name: string;
  background: string;
  music: string | null;
  levelMin: number;
  levelMax: number;
}

export interface PortalInfo {
  id: string;
  fromMap: string;
  toMap: string;
  x: number;
  y: number;
  condition: string | null;
}

// Game Config
export const GAME_CONFIG_KEYS = {
  MAX_REALM: 'MAX_REALM',
  MAX_GU_SLOT: 'MAX_GU_SLOT',
  MAX_ENHANCE: 'MAX_ENHANCE',
  PLAYER_SPEED: 'PLAYER_SPEED',
  BASE_HP: 'BASE_HP',
  BASE_MANA: 'BASE_MANA',
  CRIT_MULTIPLIER: 'CRIT_MULTIPLIER',
} as const;

export type GameConfigKey = (typeof GAME_CONFIG_KEYS)[keyof typeof GAME_CONFIG_KEYS];

// Create Player
export interface CreatePlayerRequest {
  name: string;
}

export interface CreatePlayerResponse {
  player: PlayerProfile;
}

// Re-export Stat Calculator
export { calculatePlayerStats } from './stat-calculator.js';
export type { StatInput } from './stat-calculator.js';

// ============================================================
// NPC
// ============================================================

export interface NpcInfo {
  id: string;
  name: string;
  sprite: string;
  faction: string;
  occupation: string;
  mapId: string;
  x: number;
  y: number;
  affectionMin: number;
  affectionMax: number;
  hasShop: string;
  schedule: string | null;
}

export interface DialogueNode {
  id: string;
  npcId: string;
  orderIndex: number;
  text: string;
  speaker: string;
  choices: DialogueChoice[] | null;
  conditionFlag: string | null;
  conditionAffectionMin: number | null;
  setFlag: string | null;
  nextDialogueId: string | null;
}

export interface DialogueChoice {
  text: string;
  nextDialogueId: string | null;
}

// ============================================================
// Quest
// ============================================================

export type QuestType = 'main' | 'side' | 'hidden' | 'daily' | 'legendary' | 'faction';

export interface QuestInfo {
  id: string;
  name: string;
  type: QuestType;
  description: string;
  npcGiverId: string | null;
  prerequisites: QuestPrerequisite[] | null;
  objectives: QuestObjective[];
  rewards: QuestReward[] | null;
  flagRequired: string | null;
  flagComplete: string | null;
  isRepeatable: string;
  minRealm: number;
}

export interface QuestPrerequisite {
  type: 'quest' | 'flag';
  id?: string;
  key?: string;
}

export interface QuestObjective {
  type: 'kill' | 'collect' | 'talk' | 'reach';
  target: string;
  count: number;
  description: string;
}

export interface QuestReward {
  type: 'gold' | 'spirit_stone' | 'item' | 'exp';
  amount: number;
  itemId?: string;
}

export interface PlayerQuest {
  id: string;
  playerId: string;
  questId: string;
  status: 'active' | 'completed' | 'failed';
  objectivesProgress: ObjectiveProgress[];
  acceptedAt: string;
  completedAt: string | null;
}

export interface ObjectiveProgress {
  index: number;
  current: number;
  target: number;
}

// ============================================================
// Inventory
// ============================================================

export interface ItemInfo {
  id: string;
  name: string;
  type: 'equipment' | 'consumable' | 'material' | 'quest_item' | 'gu';
  description: string | null;
  stackable: string;
  maxStack: number;
  sellPrice: number;
  sprite: string | null;
}

export interface InventorySlot {
  id: string;
  playerId: string;
  itemId: string;
  item?: ItemInfo;
  quantity: number;
  slot: number;
}

// ============================================================
// Story Flag
// ============================================================

export interface StoryFlag {
  key: string;
  value: string;
}

// Create Quest Request
export interface AcceptQuestRequest {
  questId: string;
}

export interface UpdateQuestProgressRequest {
  objectiveIndex: number;
  amount: number;
}

// Create Inventory Request
export interface AddItemRequest {
  itemId: string;
  quantity: number;
  slot?: number;
}

export interface MoveItemRequest {
  fromSlot: number;
  toSlot: number;
}

export interface SortInventoryRequest {
  sortBy: 'name' | 'type' | 'quantity';
}
