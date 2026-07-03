// ============================================================
// Damage Calculator
// Formula from docs/02_SYSTEM_BIBLE.md:
// Final Damage = (BaseAttack + Equipment + GuStats) × SkillMultiplier
//                × Critical × ElementBonus × SynergyBonus - Defense
// ============================================================

import type { CombatStats, DamageInput, DamageResult, ActiveStatusEffect, StatusEffectType } from './types.js';

function rollCritical(critChance: number, critMultiplier: number): { isCrit: boolean; multiplier: number } {
  const roll = Math.random() * 100;
  if (roll < critChance) {
    return { isCrit: true, multiplier: critMultiplier };
  }
  return { isCrit: false, multiplier: 1 };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Calculate final damage for a single attack.
 */
export function calculateDamage(input: DamageInput): DamageResult {
  // Step 1: Total attack power
  const totalAttack = input.baseAttack + input.equipmentBonus + input.guBonus;

  // Step 2: Apply skill multiplier
  const skillDamage = totalAttack * input.skillMultiplier;

  // Step 3: Critical hit
  const crit = rollCritical(input.critChance, input.critMultiplier);

  // Step 4: Element bonus (from attacker's element affinity)
  const elementMultiplier = 1 + input.elementBonus;

  // Step 5: Synergy bonus (from Gu combinations)
  const synergyMultiplier = 1 + input.synergyBonus;

  // Step 6: Calculate raw damage
  let rawDamage = skillDamage * crit.multiplier * elementMultiplier * synergyMultiplier;

  // Step 7: Defense reduction
  rawDamage -= input.targetDefense;

  // Step 8: Minimum damage floor (1 damage minimum)
  const finalDamage = Math.max(1, Math.round(rawDamage));

  // Step 9: Status effect application (from attacker's status effects)
  const statusApplied: ActiveStatusEffect[] = [];
  for (const effect of input.statusEffects) {
    if (effect.type === 'freeze' || effect.type === 'slow') {
      statusApplied.push({
        type: effect.type,
        source: effect.source,
        value: effect.value,
        duration: 60, // 3 seconds at 20 tick/s
        tickInterval: 20,
        ticksSinceLast: 0,
      });
    }
  }

  return {
    finalDamage,
    isCritical: crit.isCrit,
    damageType: input.damageType,
    statusApplied,
    targetDefeated: false, // caller sets this based on remaining HP
  };
}

/**
 * Calculate damage from a status effect tick.
 */
export function calculateStatusTickDamage(
  effect: ActiveStatusEffect,
  targetMaxHp: number,
): number {
  switch (effect.type) {
    case 'burn':
      return Math.max(1, Math.round(targetMaxHp * 0.02)); // 2% max HP
    case 'poison':
      return Math.max(1, Math.round(effect.value * 0.5));
    case 'bleeding':
      return Math.max(1, Math.round(effect.value * 0.3));
    default:
      return 0;
  }
}

/**
 * Apply status effect to target.
 */
export function applyStatusEffect(
  attackerCombatId: string,
  effectType: StatusEffectType,
  baseValue: number,
): ActiveStatusEffect {
  const baseDurations: Record<StatusEffectType, number> = {
    burn: 80,      // 4 seconds
    freeze: 40,    // 2 seconds
    poison: 100,   // 5 seconds
    bleeding: 80,  // 4 seconds
    stun: 20,      // 1 second
    slow: 60,      // 3 seconds
    silence: 60,   // 3 seconds
    blind: 40,     // 2 seconds
    fear: 40,      // 2 seconds
    curse: 100,    // 5 seconds
  };

  return {
    type: effectType,
    source: attackerCombatId,
    value: baseValue,
    duration: baseDurations[effectType],
    tickInterval: 20, // every 1 second at 20 tick/s
    ticksSinceLast: 0,
  };
}

/**
 * Check if a status effect should end.
 */
export function tickStatusEffect(effect: ActiveStatusEffect): ActiveStatusEffect | null {
  const remaining = effect.duration - 1;
  if (remaining <= 0) return null;

  return {
    ...effect,
    duration: remaining,
    ticksSinceLast: effect.ticksSinceLast + 1,
  };
}

/**
 * Build combat stats from player data.
 */
export function buildCombatStats(bonuses: {
  hpBonus: number;
  atkBonus: number;
  defBonus: number;
  critBonus: number;
  moveSpeed: number;
  baseHp: number;
  baseAtk: number;
  baseDef: number;
}): CombatStats {
  return {
    hp: bonuses.baseHp + bonuses.hpBonus,
    maxHp: bonuses.baseHp + bonuses.hpBonus,
    atk: bonuses.baseAtk + bonuses.atkBonus,
    def: bonuses.baseDef + bonuses.defBonus,
    crit: clamp(bonuses.critBonus, 0, 100),
    critDamage: 1.5, // base 150%
    speed: bonuses.moveSpeed,
  };
}
