// Combat Engine — barrel export
export {
  calculateDamage,
  calculateStatusTickDamage,
  applyStatusEffect,
  tickStatusEffect,
  buildCombatStats,
} from './damage-calculator.js';

export {
  processStatusTick,
  canAct,
  canUseSkill,
  getSpeedMultiplier,
  getAccuracyMultiplier,
  addStatusEffect,
} from './status-effect.js';

export type {
  CombatStats,
  DamageType,
  StatusEffectType,
  ActiveStatusEffect,
  DamageInput,
  DamageResult,
  CombatResult,
  MonsterTemplate,
  DropEntry,
  MonsterInstance,
  CombatLogEntry,
} from './types.js';

export type { StatusTickResult } from './status-effect.js';
