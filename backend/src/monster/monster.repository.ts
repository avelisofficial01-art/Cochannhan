import { eq } from 'drizzle-orm';
import { db } from '../database/connection.js';
import { mapSpawns, monsterTemplates } from '../database/schema/index.js';
import type { CreateMonsterInput } from './monster.schema.js';

type MonsterSelect = typeof monsterTemplates.$inferSelect;

interface CamelMonsterRow {
  id: string;
  name: string;
  realm: number;
  hp: number;
  atk: number;
  def: number;
  speed: number;
  element: string;
  sprite: string;
  dropTable: unknown;
  mapId: string;
  respawnTime: number;
  createdAt: Date;
}

function toCamelCase(row: MonsterSelect, mapId = ''): CamelMonsterRow {
  return {
    id: row.id,
    name: row.name,
    realm: row.realm,
    hp: row.hp,
    atk: row.atk,
    def: row.def,
    speed: row.spd,
    element: row.ai_type,
    sprite: 'monster_1',
    dropTable: row.drop_table,
    mapId,
    respawnTime: row.respawn_time,
    createdAt: row.created_at,
  };
}

export async function findAllMonsters(): Promise<CamelMonsterRow[]> {
  const rows = await db.select().from(monsterTemplates);
  return rows.map((row) => toCamelCase(row));
}

export async function findMonsterById(id: string): Promise<CamelMonsterRow | undefined> {
  const rows = await db.select().from(monsterTemplates).where(eq(monsterTemplates.id, id));
  if (rows.length === 0) return undefined;

  const spawnRows = await db.select().from(mapSpawns).where(eq(mapSpawns.monster_id, id)).limit(1);
  return toCamelCase(rows[0], spawnRows[0]?.map_id ?? '');
}

export async function findMonstersByMapId(mapId: string): Promise<CamelMonsterRow[]> {
  const spawnRows = await db.select().from(mapSpawns).where(eq(mapSpawns.map_id, mapId));
  const result: CamelMonsterRow[] = [];

  for (const spawn of spawnRows) {
    const rows = await db
      .select()
      .from(monsterTemplates)
      .where(eq(monsterTemplates.id, spawn.monster_id))
      .limit(1);

    if (rows[0]) {
      result.push(toCamelCase(rows[0], spawn.map_id));
    }
  }

  return result;
}

export async function createMonster(data: CreateMonsterInput): Promise<CamelMonsterRow> {
  const [row] = await db
    .insert(monsterTemplates)
    .values({
      name: data.name,
      realm: data.realm,
      hp: data.hp,
      atk: data.atk,
      def: data.def,
      spd: data.speed,
      ai_type: data.element,
      drop_table: data.dropTable ?? [],
      respawn_time: data.respawnTime,
    })
    .returning();

  await db.insert(mapSpawns).values({
    map_id: data.mapId,
    monster_id: row.id,
    max_count: 1,
  });

  return toCamelCase(row, data.mapId);
}

export async function deleteMonster(id: string): Promise<boolean> {
  const result = await db.delete(monsterTemplates).where(eq(monsterTemplates.id, id));
  return result.length > 0;
}
