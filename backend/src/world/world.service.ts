import { worldRepository } from './world.repository.js';
import type { MapInfo, PortalInfo } from '@co-dao/shared';

function toMapInfo(row: {
  id: string;
  name: string;
  background: string;
  music: string | null;
  level_min: number;
  level_max: number;
}): MapInfo {
  return {
    id: row.id,
    name: row.name,
    background: row.background,
    music: row.music,
    levelMin: row.level_min,
    levelMax: row.level_max,
  };
}

function toPortalInfo(row: {
  id: string;
  from_map: string;
  to_map: string;
  x: number;
  y: number;
  condition: string | null;
}): PortalInfo {
  return {
    id: row.id,
    fromMap: row.from_map,
    toMap: row.to_map,
    x: row.x,
    y: row.y,
    condition: row.condition,
  };
}

export async function getMaps(): Promise<MapInfo[]> {
  const rows = await worldRepository.findAllMaps();
  return rows.map(toMapInfo);
}

export async function getMapById(id: string): Promise<MapInfo | null> {
  const row = await worldRepository.findMapById(id);
  if (!row) return null;
  return toMapInfo(row);
}

export async function getPortals(mapId: string): Promise<PortalInfo[]> {
  const rows = await worldRepository.findPortalsByMapId(mapId);
  return rows.map(toPortalInfo);
}

export const worldService = {
  getMaps,
  getMapById,
  getPortals,
};
