import { eq } from 'drizzle-orm';
import { db } from '../database/connection.js';
import { monsterTemplates } from '../database/schema/index.js';
import type { CreateMonsterInput } from './monster.schema.js';

export interface MonsterRow {
  id: string;
  name: string;
  realm: number;
  hp: number;
  atk: number;
  def: number;
  speed: number;
  element: string;
  sprite: string;
  drop_table: string | null;
  map_id: string;
  respawn_time: number;
  created_at: Date;
}

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

function toCamelCase(row: MonsterRow): CamelMonsterRow {
  return {
    id: row.id,
    name: row.name,
    realm: row.realm,
    hp: row.hp,
    atk: row.atk,
    def: row.def,
    speed: row.speed,
    element: row.element,
    sprite: row.sprite,
    dropTable: row.drop_table ? JSON.parse(row.drop_table) : null,
    mapId: row.map_id,
    respawnTime: row.respawn_time,
    createdAt: row.created_at,
  };
}

export async function findAllMonsters(): Promise<ReturnType<typeof toCamelCase>[]> {
  const rows = await db.select().from(monsterTemplates);
  return rows.map(toCamelCase);
}

export async function findMonsterById(
  id: string,
): Promise<ReturnType<typeof toCamelCase> | undefined> {
  const rows = await db.select().from(monsterTemplates).where(eq(monsterTemplates.id, id));
  if (rows.length === 0) return undefined;
  return toCamelCase(rows[0]);
}

export async function findMonstersByMapId(
  mapId: string,
): Promise<ReturnType<typeof toCamelCase>[]> {
  const rows = await db
    .select()
    .from(monsterTemplates)
    .where(eq(monsterTemplates.map_id, mapId));
  return rows.map(toCamelCase);
}

export async function createMonster(
  data: CreateMonsterInput,
): Promise<ReturnType<typeof toCamelCase>> {
  const [row] = await db
    .insert(monsterTemplates)
    .values({
      name: data.name,
      realm: data.realm,
      hp: data.hp,
      atk: data.atk,
      def: data.def,
      speed: data.speed,
      element: data.element,
      sprite: data.sprite,
      drop_table: data.dropTable ? JSON.stringify(data.dropTable) : null,
      map_id: data.mapId,
      respawn_time: data.respawnTime,
    })
    .returning();

  return toCamelCase(row);
}

export async function deleteMonster(id: string): Promise<boolean> {
  const result = await db.delete(monsterTemplates).where(eq(monsterTemplates.id, id));
  return result.length > 0;
}
