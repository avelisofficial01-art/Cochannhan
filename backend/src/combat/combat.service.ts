import {
  calculateDamage,
  processStatusTick,
  buildCombatStats,
  canAct,
} from '@co-dao/shared';
import type { DamageInput, MonsterInstance, MonsterTemplate, CombatResult } from '@co-dao/shared';
import * as combatRepo from './combat.repository.js';
import * as playerService from '../player/player.service.js';

// ─── In-memory monster instances ────────────────────────────

const monsterInstances = new Map<string, MonsterInstance>();

let instanceCounter = 0;

function nextInstanceId(): string {
  instanceCounter++;
  return `monster_inst_${instanceCounter}`;
}

// ─── Spawn / Despawn ───────────────────────────────────────

export function spawnMonster(template: MonsterTemplate, x: number, y: number): MonsterInstance {
  const instance: MonsterInstance = {
    instanceId: nextInstanceId(),
    templateId: template.id,
    template,
    currentHp: template.hp,
    x,
    y,
    statusEffects: [],
    targetId: null,
    lastAttackTick: 0,
  };
  monsterInstances.set(instance.instanceId, instance);
  return instance;
}

export function spawnMonstersFromTemplate(
  template: MonsterTemplate,
  count: number,
  spawns: Array<{ x: number; y: number }>,
): MonsterInstance[] {
  const instances: MonsterInstance[] = [];
  for (let i = 0; i < Math.min(count, spawns.length); i++) {
    instances.push(spawnMonster(template, spawns[i].x, spawns[i].y));
  }
  return instances;
}

export function despawnMonster(instanceId: string): boolean {
  return monsterInstances.delete(instanceId);
}

export function getMonsterInstance(instanceId: string): MonsterInstance | undefined {
  return monsterInstances.get(instanceId);
}

export function getMonstersOnMap(mapId: string): MonsterInstance[] {
  const result: MonsterInstance[] = [];
  monsterInstances.forEach((inst) => {
    if (inst.template.mapId === mapId) {
      result.push(inst);
    }
  });
  return result;
}

// ─── Attack Flow ───────────────────────────────────────────

export async function executePlayerAttack(
  playerId: string,
  targetInstanceId: string,
): Promise<CombatResult | null> {
  // Get player
  const player = await playerService.getPlayerById(playerId);
  if (!player) return null;

  // Get target monster instance
  const target = monsterInstances.get(targetInstanceId);
  if (!target) return null;

  // Get player stats
  const playerStatRow = await playerService.getPlayerStats(playerId);
  if (!playerStatRow) return null;

  // Build combat stats
  const playerCombatStats = buildCombatStats({
    hpBonus: playerStatRow.hpBonus,
    atkBonus: playerStatRow.atkBonus,
    defBonus: playerStatRow.defBonus,
    critBonus: playerStatRow.critBonus,
    moveSpeed: playerStatRow.moveSpeed,
    baseHp: player.hp,
    baseAtk: 10, // base atk from realm
    baseDef: 5,
  });

  // Build damage input
  const damageInput: DamageInput = {
    baseAttack: playerCombatStats.atk,
    equipmentBonus: 0, // Sprint 4
    guBonus: 0,         // Sprint 5
    skillMultiplier: 1.0,
    critChance: playerCombatStats.crit,
    critMultiplier: playerCombatStats.critDamage,
    damageType: 'physical',
    targetDefense: target.template.def,
    elementBonus: 0,
    synergyBonus: 0,
    statusEffects: [], // No Gu skills yet
  };

  const result = calculateDamage(damageInput);

  // Apply damage to monster
  target.currentHp -= result.finalDamage;
  const defeated = target.currentHp <= 0;

  if (defeated) {
    despawnMonster(targetInstanceId);
  }

  // Log combat
  await combatRepo.createCombatLog({
    playerId,
    monsterId: target.templateId,
    damage: result.finalDamage,
    skill: null,
    isCritical: result.isCritical,
    damageType: result.damageType,
  });

  return {
    attackerId: playerId,
    targetId: targetInstanceId,
    damage: result.finalDamage,
    isCritical: result.isCritical,
    damageType: result.damageType,
    targetHpRemaining: Math.max(0, target.currentHp),
    targetMaxHp: target.template.hp,
    targetDefeated: defeated,
    statusApplied: result.statusApplied,
  };
}

// ─── Monster AI Attack ─────────────────────────────────────

export function executeMonsterAttack(
  instanceId: string,
  targetPlayerId: string,
  currentTick: number,
): CombatResult | null {
  const monster = monsterInstances.get(instanceId);
  if (!monster) return null;

  // Check if can act
  if (!canAct(monster.statusEffects)) return null;

  // Attack cooldown: 1 attack per second (20 ticks)
  if (currentTick - monster.lastAttackTick < 20) return null;

  monster.lastAttackTick = currentTick;

  const damage = Math.max(1, monster.template.atk - 2); // simplified defense
  const isCrit = Math.random() < 0.05; // 5% monster crit

  const finalDamage = isCrit ? Math.round(damage * 1.5) : damage;

  return {
    attackerId: instanceId,
    targetId: targetPlayerId,
    damage: finalDamage,
    isCritical: isCrit,
    damageType: monster.template.element,
    targetHpRemaining: 0, // set by caller
    targetMaxHp: 0,        // set by caller
    targetDefeated: false,
    statusApplied: [],
  };
}

// ─── Tick Combat State ──────────────────────────────────────

export function tickAllMonsters(_currentTick: number): Array<{
  instanceId: string;
  damageTaken: number;
  defeated: boolean;
}> {
  const results: Array<{
    instanceId: string;
    damageTaken: number;
    defeated: boolean;
  }> = [];

  monsterInstances.forEach((monster) => {
    const { damageDealt, remainingEffects } = processStatusTick(
      monster.statusEffects,
      monster.template.hp,
    );

    monster.statusEffects = remainingEffects;
    monster.currentHp -= damageDealt;

    const defeated = monster.currentHp <= 0;
    if (defeated) {
      despawnMonster(monster.instanceId);
      results.push({
        instanceId: monster.instanceId,
        damageTaken: damageDealt,
        defeated: true,
      });
    } else if (damageDealt > 0) {
      results.push({
        instanceId: monster.instanceId,
        damageTaken: damageDealt,
        defeated: false,
      });
    }
  });

  return results;
}

// ─── Drop System ───────────────────────────────────────────

export function rollDrops(template: MonsterTemplate): Array<{
  itemId: string;
  quantity: number;
}> {
  if (!template.dropTable) return [];

  const drops: Array<{ itemId: string; quantity: number }> = [];

  for (const entry of template.dropTable) {
    const roll = Math.random() * 100;
    if (roll <= entry.chance) {
      const qty =
        entry.quantityMax > entry.quantityMin
          ? entry.quantityMin +
            Math.floor(Math.random() * (entry.quantityMax - entry.quantityMin + 1))
          : entry.quantityMin;
      drops.push({ itemId: entry.itemId, quantity: qty });
    }
  }

  return drops;
}
