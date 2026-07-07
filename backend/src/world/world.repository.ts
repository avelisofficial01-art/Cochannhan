import { eq } from 'drizzle-orm';
import { db } from '../database/connection.js';
import { mapPortals, worldMaps } from '../database/schema/index.js';

export interface MapRow {
  id: string;
  name: string;
  background: string;
  music: string | null;
  level_min: number;
  level_max: number;
}

export interface PortalRow {
  id: string;
  from_map: string;
  to_map: string;
  x: number;
  y: number;
  condition: string | null;
}

function toMapRow(row: typeof worldMaps.$inferSelect): MapRow {
  return {
    id: row.id,
    name: row.name,
    background: row.background ?? 'forest',
    music: null,
    level_min: row.recommended_realm,
    level_max: row.recommended_realm + 2,
  };
}

function toPortalRow(row: typeof mapPortals.$inferSelect): PortalRow {
  return {
    id: row.id,
    from_map: row.from_map_id,
    to_map: row.to_map_id,
    x: row.from_x,
    y: row.from_y,
    condition: row.min_realm > 1 ? `realm:${row.min_realm}` : null,
  };
}

async function findAllMaps(): Promise<MapRow[]> {
  const rows = await db.select().from(worldMaps).orderBy(worldMaps.name);
  return rows.map(toMapRow);
}

async function findMapById(id: string): Promise<MapRow | undefined> {
  const [row] = await db.select().from(worldMaps).where(eq(worldMaps.id, id));
  return row ? toMapRow(row) : undefined;
}

async function findMapByName(name: string): Promise<MapRow | undefined> {
  const [row] = await db.select().from(worldMaps).where(eq(worldMaps.name, name));
  return row ? toMapRow(row) : undefined;
}

async function findPortalsByMapId(mapId: string): Promise<PortalRow[]> {
  const rows = await db.select().from(mapPortals).where(eq(mapPortals.from_map_id, mapId));
  return rows.map(toPortalRow);
}

async function findPortalById(id: string): Promise<PortalRow | undefined> {
  const [row] = await db.select().from(mapPortals).where(eq(mapPortals.id, id));
  return row ? toPortalRow(row) : undefined;
}

export const worldRepository = {
  findAllMaps,
  findMapById,
  findMapByName,
  findPortalsByMapId,
  findPortalById,
};
