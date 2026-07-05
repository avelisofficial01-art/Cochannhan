import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { success, error } from '../utils/response.js';
import * as worldService from './world.service.js';
import { ERROR_CODES } from '@co-dao/shared';

export async function getMaps(
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const maps = await worldService.getMaps();
    success(res, maps);
  } catch (err) {
    next(err);
  }
}

export async function getMapById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const mapId = req.params.mapId as string;
    const map = await worldService.getMapById(mapId);

    if (!map) {
      error(res, ERROR_CODES.MAP_NOT_FOUND, 'Map does not exist.', 404);
      return;
    }

    const portals = await worldService.getPortals(mapId);
    success(res, { map, portals });
  } catch (err) {
    next(err);
  }
}

export async function getPortals(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const mapId = req.params.mapId as string;
    const portals = await worldService.getPortals(mapId);
    success(res, portals);
  } catch (err) {
    next(err);
  }
}
