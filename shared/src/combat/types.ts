// ============================================================
// Combat Types — shared between backend & frontend
// ============================================================

export interface CombatStats {
  atk: number;
  def: number;
  hp: number;
  maxHp: number;
  crit: number;        // 0-100 percentage
  critDamage: number;  // multiplier (e.g. 1.5 = 150%)
  speed: number;
}

export type DamageType =
  | 'physical'
  | 'fire'
  | 'water'
  | 'lightning'
  | 'wind'
  | 'earth'
  | 'wood'
  | 'ice'
  | 'poison'
  | 'blood'
  | 'soul'
  | 'space'
  | 'time'
  | 'light'
  | 'dark';

export type StatusEffectType =
  | 'burn'
  | 'freeze'
  | 'poison'
  | 'bleeding'
  | 'stun'
  | 'slow'
  | 'silence'
  | 'blind'
  | 'fear'
  | 'curse';

export interface ActiveStatusEffect {
  type: StatusEffectType;
  source: string;       // attacker ID
  value: number;        // damage per tick or effect magnitude
  duration: number;     // remaining ticks (at 20 tick/s)
  tickInterval: number; // ticks between applications
  ticksSinceLast: number;
}

export interface DamageInput {
  baseAttack: number;
  equipmentBonus: number;
  guBonus: number;
  skillMultiplier: number;
  critChance: number;
  critMultiplier: number;
  damageType: DamageType;
  targetDefense: number;
  elementBonus: number;   // 0-1 (e.g. 0.2 = +20%)
  synergyBonus: number;   // 0-1
  statusEffects: ActiveStatusEffect[]; // attacker's status effects for bonus damage
}

export interface DamageResult {
  finalDamage: number;
  isCritical: boolean;
  damageType: DamageType;
  statusApplied: ActiveStatusEffect[];
  targetDefeated: boolean;
}

export interface CombatResult {
  attackerId: string;
  targetId: string;
  damage: number;
  isCritical: boolean;
  damageType: DamageType;
  targetHpRemaining: number;
  targetMaxHp: number;
  targetDefeated: boolean;
  statusApplied: ActiveStatusEffect[];
}

// Monster
export interface MonsterTemplate {
  id: string;
  name: string;
  realm: number;
  hp: number;
  atk: number;
  def: number;
  speed: number;
  element: DamageType;
  sprite: string;
  dropTable: DropEntry[] | null;
  mapId: string;
  respawnTime: number; // seconds
}

export interface DropEntry {
  itemId: string;
  chance: number;  // 0-100
  quantityMin: number;
  quantityMax: number;
}

export interface MonsterInstance {
  instanceId: string;
  templateId: string;
  template: MonsterTemplate;
  currentHp: number;
  x: number;
  y: number;
  statusEffects: ActiveStatusEffect[];
  targetId: string | null;
  lastAttackTick: number;
  spawnX?: number;
  spawnY?: number;
}

// Combat Log
export interface CombatLogEntry {
  id: string;
  playerId: string;
  monsterId: string;
  damage: number;
  skill: string | null;
  isCritical: boolean;
  damageType: DamageType;
  createdAt: string;
}
