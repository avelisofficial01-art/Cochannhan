// ============================================================
// Status Effect System — centralized status management
// docs/02_SYSTEM_BIBLE.md: Tất cả Status đều dùng chung StatusSystem
// ============================================================

import type { ActiveStatusEffect, StatusEffectType } from './types.js';
import { tickStatusEffect, calculateStatusTickDamage } from './damage-calculator.js';

export interface StatusTickResult {
  damageDealt: number;
  remainingEffects: ActiveStatusEffect[];
  blockedActions: StatusEffectType[];
}

/**
 * Process one tick of status effects on an entity.
 * Returns damage dealt and remaining effects.
 */
export function processStatusTick(
  effects: ActiveStatusEffect[],
  targetMaxHp: number,
): StatusTickResult {
  let totalDamage = 0;
  const remainingEffects: ActiveStatusEffect[] = [];
  const blockedActions: StatusEffectType[] = [];

  for (const effect of effects) {
    // Apply damage-over-time
    if (effect.ticksSinceLast >= effect.tickInterval) {
      totalDamage += calculateStatusTickDamage(effect, targetMaxHp);
    }

    // Tick the effect
    const updated = tickStatusEffect(effect);
    if (updated) {
      remainingEffects.push({ ...updated, ticksSinceLast: 0 });
    }
  }

  // Determine blocked actions
  for (const effect of remainingEffects) {
    if (effect.type === 'stun') {
      blockedActions.push('stun');
    }
    if (effect.type === 'freeze') {
      blockedActions.push('freeze');
    }
    if (effect.type === 'fear') {
      blockedActions.push('fear');
    }
  }

  return {
    damageDealt: Math.round(totalDamage),
    remainingEffects,
    blockedActions,
  };
}

/**
 * Check if entity can act based on status effects.
 */
export function canAct(effects: ActiveStatusEffect[]): boolean {
  return !effects.some(
    (e) => e.type === 'stun' || e.type === 'freeze' || e.type === 'fear',
  );
}

/**
 * Check if entity can use skills.
 */
export function canUseSkill(effects: ActiveStatusEffect[]): boolean {
  return !effects.some((e) => e.type === 'silence');
}

/**
 * Get movement speed multiplier from status effects.
 */
export function getSpeedMultiplier(effects: ActiveStatusEffect[]): number {
  const slow = effects.find((e) => e.type === 'slow');
  if (!slow) return 1;
  // Slow reduces speed by 50%
  return 0.5;
}

/**
 * Get accuracy multiplier from status effects (blind).
 */
export function getAccuracyMultiplier(effects: ActiveStatusEffect[]): number {
  const blind = effects.find((e) => e.type === 'blind');
  if (!blind) return 1;
  // Blind reduces accuracy by 50%
  return 0.5;
}

/**
 * Add a new status effect to the list (no duplicate of same type from same source).
 */
export function addStatusEffect(
  currentEffects: ActiveStatusEffect[],
  newEffect: ActiveStatusEffect,
): ActiveStatusEffect[] {
  // Remove existing effect of same type from same source
  const filtered = currentEffects.filter(
    (e) => !(e.type === newEffect.type && e.source === newEffect.source),
  );
  return [...filtered, newEffect];
}
