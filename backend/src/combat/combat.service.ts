import {
  calculateDamage,
  processStatusTick,
  buildCombatStats,
  canAct,
} from '@co-dao/shared';
import type { DamageInput, MonsterInstance, MonsterTemplate, CombatResult } from '@co-dao/shared';
import * as combatRepo from './combat.repository.js';
import * as playerService from '../player/player.service.js';
import * as storyRepo from '../story/story.repository.js';
import { questService } from '../quest/quest.service.js';
import { db } from '../database/connection.js';
import * as schema from '../database/schema/index.js';
import { eq } from 'drizzle-orm';
import { inventoryService } from '../inventory/inventory.service.js';
import { playerRepository } from '../player/player.repository.js';
import {
  initBossState,
  checkBossPhase,
  getBossConfig,
  getBossStoryFlagOnDefeat,
} from './boss-ai.js';
import type { BossInstanceState } from './boss-ai.js';

// ─── In-memory monster instances ────────────────────────────

const monsterInstances = new Map<string, MonsterInstance>();
const bossStates = new Map<string, BossInstanceState>();

let instanceCounter = 0;

function nextInstanceId(): string {
  instanceCounter++;
  return `monster_inst_${instanceCounter}`;
}

type MonsterChangeCallback = (mapId: string) => void;
let monsterChangeCallback: MonsterChangeCallback | null = null;

export function registerMonsterChangeCallback(cb: MonsterChangeCallback): void {
  monsterChangeCallback = cb;
}

export function scheduleRespawn(template: MonsterTemplate, x: number, y: number): void {
  const respawnMs = (template.respawnTime || 30) * 1000;
  console.log(`[Combat] Scheduling respawn for ${template.name} in ${template.respawnTime || 30}s at (${x}, ${y})`);
  setTimeout(() => {
    try {
      const instance = spawnMonster(template, x, y);
      console.log(`[Combat] Respawned ${template.name} (instanceId: ${instance.instanceId})`);
      if (monsterChangeCallback) {
        monsterChangeCallback(template.mapId);
      }
    } catch (err) {
      console.error('[Combat] Respawn failed:', err);
    }
  }, respawnMs);
}

// ─── Boss Helpers ───────────────────────────────────────────

async function setBossDefeatFlag(playerId: string, flagKey: string): Promise<void> {
  await storyRepo.setFlag(playerId, flagKey, 'true');
  console.log(`[Boss] Story flag set: ${flagKey} = true for player ${playerId}`);
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
    spawnX: x,
    spawnY: y,
  };
  monsterInstances.set(instance.instanceId, instance);

  // Init boss state if this is a boss template
  const bossConfig = getBossConfig(template.name);
  if (bossConfig) {
    const bossState = initBossState(bossConfig.bossId, template.hp);
    if (bossState) {
      bossStates.set(instance.instanceId, bossState);
    }
  }

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
  bossStates.delete(instanceId);
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
  skillId?: string,
): Promise<CombatResult | null> {
  // Get player
  const player = await playerService.getPlayerById(playerId);
  if (!player) return null;

  // Get target monster instance
  const target = monsterInstances.get(targetInstanceId);
  if (!target) return null;

  // Set target to attacking player
  target.targetId = playerId;

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

  let skillMultiplier = 1.0;
  let skillName: string | null = null;
  let damageType: DamageInput['damageType'] = 'physical';

  if (skillId) {
    const [skillRow] = await db
      .select()
      .from(schema.guSkills)
      .where(eq(schema.guSkills.skill_id, skillId))
      .limit(1);
    if (skillRow) {
      skillMultiplier = (skillRow.damage_multiplier ?? 100) / 100;
      skillName = skillRow.name;

      const [guTemplate] = await db
        .select()
        .from(schema.guTemplates)
        .where(eq(schema.guTemplates.id, skillRow.gu_template_id))
        .limit(1);
      if (guTemplate && guTemplate.element) {
        const lowerElement = guTemplate.element.toLowerCase();
        const validTypes = [
          'physical', 'fire', 'water', 'lightning', 'wind', 'earth', 'wood', 'ice', 'poison', 'blood', 'soul', 'space', 'time', 'light', 'dark'
        ];
        if (validTypes.includes(lowerElement)) {
          damageType = lowerElement as DamageInput['damageType'];
        }
      }
    }
  }

  // Build damage input
  const damageInput: DamageInput = {
    baseAttack: playerCombatStats.atk,
    equipmentBonus: 0, // Sprint 4
    guBonus: 0,         // Sprint 5
    skillMultiplier,
    critChance: playerCombatStats.crit,
    critMultiplier: playerCombatStats.critDamage,
    damageType,
    targetDefense: target.template.def,
    elementBonus: 0,
    synergyBonus: 0,
    statusEffects: [], // No Gu skills yet
  };

  const result = calculateDamage(damageInput);

  // Apply damage to monster
  target.currentHp -= result.finalDamage;
  const defeated = target.currentHp <= 0;
  const grantedDrops: Array<{ itemName: string; quantity: number }> = [];
  let goldReward = 0;

  if (defeated) {
    // Boss defeat — set story flag
    const storyFlagKey = getBossStoryFlagOnDefeat(target.template.name);
    if (storyFlagKey) {
      setBossDefeatFlag(playerId, storyFlagKey).catch((err) => {
        console.error('Failed to set boss defeat flag:', err);
      });
    }
    bossStates.delete(targetInstanceId);

    // Roll drops
    const dropTable = target.template.dropTable || (target.template as unknown as Record<string, unknown>).drop_table;
    const rolledDrops = [];
    if (dropTable) {
      const parsedDropTable = typeof dropTable === 'string' ? JSON.parse(dropTable) : dropTable;
      if (Array.isArray(parsedDropTable)) {
        for (const entry of parsedDropTable) {
          // entry.chance is configured as fraction (e.g. 0.6 = 60%). Scale by 2.0 (cap at 1.0) for dev mode.
          const adjustedChance = Math.min(1.0, (entry.chance ?? 0) * 2.0);
          const roll = Math.random();
          if (roll <= adjustedChance) {
            const minQ = entry.minQuantity ?? entry.quantityMin ?? 1;
            const maxQ = entry.maxQuantity ?? entry.quantityMax ?? 1;
            const qty = maxQ > minQ ? minQ + Math.floor(Math.random() * (maxQ - minQ + 1)) : minQ;
            
            // Find item by name
            const itemName = entry.itemName ?? entry.itemId;
            if (itemName) {
              const [item] = await db.select().from(schema.itemTemplates)
                .where(eq(schema.itemTemplates.name, itemName))
                .limit(1);
              if (item) {
                rolledDrops.push({ itemId: item.id, itemName: item.name, quantity: qty });
              }
            }
          }
        }
      }
    }

    // Grant items to inventory
    for (const drop of rolledDrops) {
      try {
        await inventoryService.addItem(playerId, {
          itemId: drop.itemId,
          quantity: drop.quantity,
        });
        grantedDrops.push({ itemName: drop.itemName, quantity: drop.quantity });
      } catch (err) {
        console.error(`[Combat] Failed to grant drop to player ${playerId}:`, err);
      }
    }

    // Gold reward
    try {
      const goldEarned = Math.floor((target.template.hp / 10) + (target.template.atk / 2) + Math.random() * 10);
      const currentPlayer = await playerRepository.findById(playerId);
      if (currentPlayer) {
        const newGold = (currentPlayer.gold ?? 0) + goldEarned;
        await playerRepository.update(playerId, { gold: newGold });
        goldReward = goldEarned;
      }
    } catch (err) {
      console.error(`[Combat] Failed to award gold to player ${playerId}:`, err);
    }

    despawnMonster(targetInstanceId);

    // Schedule respawn
    scheduleRespawn(target.template, target.spawnX ?? target.x, target.spawnY ?? target.y);

    // Update quest progress for monster kill
    questService.handleMonsterKill(playerId, target.template.name).catch((err) => {
      console.error('Failed to handle quest kill progress:', err);
    });
  } else {
    // Check boss phase transition
    const bossState = bossStates.get(targetInstanceId);
    if (bossState) {
      const phaseChanged = checkBossPhase(bossState, target.currentHp, target.template.hp);
      if (phaseChanged) {
        console.log(`[Boss] ${bossState.bossConfig.name} entered ${bossState.currentPhase.name}`);
      }
    }
  }

  // Log combat
  await combatRepo.createCombatLog({
    playerId,
    monsterId: target.templateId,
    damage: result.finalDamage,
    skill: skillName,
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
    drops: grantedDrops,
    goldReward,
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

  // Attack cooldown: 2.5 seconds (50 ticks)
  if (currentTick - monster.lastAttackTick < 50) return null;

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
      bossStates.delete(monster.instanceId);
      despawnMonster(monster.instanceId);
      scheduleRespawn(monster.template, monster.spawnX ?? monster.x, monster.spawnY ?? monster.y);
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
    // entry.chance is configured as fraction (e.g. 0.6 = 60%). Scale by 2.0 (cap at 1.0) for dev mode.
    const adjustedChance = Math.min(1.0, (entry.chance ?? 0) * 2.0);
    const roll = Math.random();
    if (roll <= adjustedChance) {
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
