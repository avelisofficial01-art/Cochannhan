import type { MonsterTemplate, DropEntry } from '@co-dao/shared';
import * as monsterRepo from './monster.repository.js';
import type { CreateMonsterInput } from './monster.schema.js';

export async function getMonstersByMap(mapId: string): Promise<MonsterTemplate[]> {
  const rows = await monsterRepo.findMonstersByMapId(mapId);
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    realm: row.realm,
    hp: row.hp,
    atk: row.atk,
    def: row.def,
    speed: row.speed,
    element: row.element as MonsterTemplate['element'],
    sprite: row.sprite,
    dropTable: row.dropTable as DropEntry[] | null,
    mapId: row.mapId,
    respawnTime: row.respawnTime,
  }));
}

export async function getMonster(id: string): Promise<MonsterTemplate | null> {
  const row = await monsterRepo.findMonsterById(id);
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    realm: row.realm,
    hp: row.hp,
    atk: row.atk,
    def: row.def,
    speed: row.speed,
    element: row.element as MonsterTemplate['element'],
    sprite: row.sprite,
    dropTable: row.dropTable as DropEntry[] | null,
    mapId: row.mapId,
    respawnTime: row.respawnTime,
  };
}

export async function getAllMonsters(): Promise<MonsterTemplate[]> {
  const rows = await monsterRepo.findAllMonsters();
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    realm: row.realm,
    hp: row.hp,
    atk: row.atk,
    def: row.def,
    speed: row.speed,
    element: row.element as MonsterTemplate['element'],
    sprite: row.sprite,
    dropTable: row.dropTable as DropEntry[] | null,
    mapId: row.mapId,
    respawnTime: row.respawnTime,
  }));
}

export async function createMonster(data: CreateMonsterInput): Promise<MonsterTemplate> {
  const row = await monsterRepo.createMonster(data);
  return {
    id: row.id,
    name: row.name,
    realm: row.realm,
    hp: row.hp,
    atk: row.atk,
    def: row.def,
    speed: row.speed,
    element: row.element as MonsterTemplate['element'],
    sprite: row.sprite,
    dropTable: row.dropTable as DropEntry[] | null,
    mapId: row.mapId,
    respawnTime: row.respawnTime,
  };
}
