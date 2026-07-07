import { db } from './connection.js';
import * as schema from './schema/index.js';
import {
  bodyConstitutionSeeds,
  cultivationRealmSeeds,
  dialogueSeeds,
  equipmentSeeds,
  gameConfigSeeds,
  guSeeds,
  itemSeeds,
  mapPortalSeeds,
  mapSpawnSeeds,
  monsterSeeds,
  npcSeeds,
  questSeeds,
  worldMapSeeds,
} from './seedData.js';

export async function seedDatabase(): Promise<void> {
  console.log('[Seed] Starting database seed...');

  await seedGameConfig();
  await seedCultivationRealms();
  await seedBodyConstitutions();
  await seedItems();
  await seedEquipment();
  await seedGu();
  await seedMonsters();
  await seedWorldMaps();
  await seedMapPortals();
  await seedMapSpawns();
  await seedDialogues();
  await seedNpcs();
  await seedQuests();

  console.log('[Seed] Database seed completed.');
}

async function seedGameConfig(): Promise<void> {
  console.log('[Seed] Seeding game config...');

  for (const config of gameConfigSeeds) {
    await db
      .insert(schema.gameConfig)
      .values(config)
      .onConflictDoNothing();
  }
}

async function seedCultivationRealms(): Promise<void> {
  console.log('[Seed] Seeding cultivation realms...');

  for (const realm of cultivationRealmSeeds) {
    await db
      .insert(schema.cultivationRealms)
      .values(realm)
      .onConflictDoNothing();
  }
}

async function seedBodyConstitutions(): Promise<void> {
  console.log('[Seed] Seeding body constitutions...');

  for (const constitution of bodyConstitutionSeeds) {
    await db
      .insert(schema.bodyConstitutions)
      .values(constitution)
      .onConflictDoNothing();
  }
}

async function seedItems(): Promise<void> {
  console.log('[Seed] Seeding item templates...');

  for (const item of itemSeeds) {
    await db
      .insert(schema.itemTemplates)
      .values({
        name: item.name,
        type: item.type,
        rarity: item.rarity,
        description: item.description,
        effects: item.effects,
        stack_limit: item.stack_limit,
        sell_price: item.sell_price,
      })
      .onConflictDoNothing();
  }
}

async function seedEquipment(): Promise<void> {
  console.log('[Seed] Seeding equipment templates...');

  for (const equipment of equipmentSeeds) {
    await db
      .insert(schema.equipmentTemplates)
      .values({
        name: equipment.name,
        slot: equipment.slot,
        rarity: equipment.rarity,
        required_realm: equipment.required_realm,
        stat_bonuses: equipment.stat_bonuses,
        description: equipment.description,
      })
      .onConflictDoNothing();
  }
}

async function seedGu(): Promise<void> {
  console.log('[Seed] Seeding Gu templates...');

  for (const gu of guSeeds) {
    await db
      .insert(schema.guTemplates)
      .values({
        name: gu.name,
        type: gu.type,
        rank: gu.rank,
        dao_affinity: gu.dao_affinity,
        description: gu.description,
        effects: gu.effects,
      })
      .onConflictDoNothing();
  }
}

async function seedMonsters(): Promise<void> {
  console.log('[Seed] Seeding monster templates...');

  const itemIdByRef = await getItemIdByRef();

  for (const monster of monsterSeeds) {
    const dropTable = monster.drop_table.map(drop => ({
      itemId: itemIdByRef.get(drop.item_ref) ?? null,
      itemRef: drop.item_ref,
      chance: drop.chance,
      quantity: drop.quantity,
    }));

    await db
      .insert(schema.monsterTemplates)
      .values({
        name: monster.name,
        realm: monster.realm,
        hp: monster.hp,
        atk: monster.atk,
        def: monster.def,
        spd: monster.spd,
        exp_reward: monster.exp_reward,
        gold_reward: monster.gold_reward,
        respawn_time: monster.respawn_time,
        ai_type: monster.ai_type,
        drop_table: dropTable,
      })
      .onConflictDoNothing();
  }
}

async function seedWorldMaps(): Promise<void> {
  console.log('[Seed] Seeding world maps...');

  for (const map of worldMapSeeds) {
    await db
      .insert(schema.worldMaps)
      .values({
        name: map.name,
        region: map.region,
        recommended_realm: map.recommended_realm,
        is_safe_zone: map.is_safe_zone,
        background: map.background,
        width: map.width,
        height: map.height,
      })
      .onConflictDoNothing();
  }
}

async function seedMapPortals(): Promise<void> {
  console.log('[Seed] Seeding map portals...');

  for (const portal of mapPortalSeeds) {
    await db
      .insert(schema.mapPortals)
      .values(portal)
      .onConflictDoNothing();
  }
}

async function seedMapSpawns(): Promise<void> {
  console.log('[Seed] Seeding map spawns...');

  const monsterIdByRef = await getMonsterIdByRef();

  for (const spawn of mapSpawnSeeds) {
    const monsterId = monsterIdByRef.get(spawn.monster_ref);
    if (!monsterId) {
      console.warn(`[Seed] Skip spawn. Missing monster ref: ${spawn.monster_ref}`);
      continue;
    }

    await db
      .insert(schema.mapSpawns)
      .values({
        map_id: spawn.map_id,
        monster_id: monsterId,
        spawn_x: spawn.spawn_x,
        spawn_y: spawn.spawn_y,
        max_count: spawn.max_count,
      })
      .onConflictDoNothing();
  }
}

async function seedDialogues(): Promise<void> {
  console.log('[Seed] Seeding dialogues...');

  for (const dialogue of dialogueSeeds) {
    await db
      .insert(schema.dialogues)
      .values(dialogue)
      .onConflictDoNothing();
  }
}

async function seedNpcs(): Promise<void> {
  console.log('[Seed] Seeding NPCs...');

  for (const npc of npcSeeds) {
    await db
      .insert(schema.npcs)
      .values(npc)
      .onConflictDoNothing();
  }
}

async function seedQuests(): Promise<void> {
  console.log('[Seed] Seeding quests...');

  for (const quest of questSeeds) {
    await db
      .insert(schema.quests)
      .values({
        title: quest.title,
        description: quest.description,
        type: quest.type,
        flag_required: quest.flag_required,
        objectives: quest.objectives,
        rewards: quest.rewards,
        min_realm: quest.min_realm,
        is_repeatable: quest.is_repeatable,
      })
      .onConflictDoNothing();
  }
}

async function getItemIdByRef(): Promise<Map<string, string>> {
  const rows = await db.select().from(schema.itemTemplates);
  const result = new Map<string, string>();

  for (const item of itemSeeds) {
    const row = rows.find(candidate => candidate.name === item.name);
    if (row) {
      result.set(item.ref, row.id);
    }
  }

  return result;
}

async function getMonsterIdByRef(): Promise<Map<string, string>> {
  const rows = await db.select().from(schema.monsterTemplates);
  const result = new Map<string, string>();

  for (const monster of monsterSeeds) {
    const row = rows.find(candidate => candidate.name === monster.name);
    if (row) {
      result.set(monster.ref, row.id);
    }
  }

  return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('[Seed] Database seed failed:', error);
      process.exit(1);
    });
}
