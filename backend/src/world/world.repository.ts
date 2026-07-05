import { eq } from 'drizzle-orm';
import { db } from '../database/connection.js';
import { maps, portals } from '../database/schema/index.js';

export type MapRow = typeof maps.$inferSelect;
export type PortalRow = typeof portals.$inferSelect;

// ─── Maps ────────────────────────────────────────────────────

async function findAllMaps(): Promise<MapRow[]> {
  return db.select().from(maps).orderBy(maps.name);
}

async function findMapById(id: string): Promise<MapRow | undefined> {
  const [row] = await db.select().from(maps).where(eq(maps.id, id));
  return row;
}

async function findMapByName(name: string): Promise<MapRow | undefined> {
  const [row] = await db.select().from(maps).where(eq(maps.name, name));
  return row;
}

// ─── Portals ─────────────────────────────────────────────────

async function findPortalsByMapId(mapId: string): Promise<PortalRow[]> {
  return db.select().from(portals).where(eq(portals.from_map, mapId));
}

async function findPortalById(id: string): Promise<PortalRow | undefined> {
  const [row] = await db.select().from(portals).where(eq(portals.id, id));
  return row;
}

export const worldRepository = {
  findAllMaps,
  findMapById,
  findMapByName,
  findPortalsByMapId,
  findPortalById,
};
