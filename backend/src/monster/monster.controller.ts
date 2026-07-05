import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { success, error } from '../utils/response.js';
import { createMonsterSchema } from './monster.schema.js';
import * as monsterService from './monster.service.js';
import { ERROR_CODES } from '@co-dao/shared';

export async function getAllMonsters(
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const monsters = await monsterService.getAllMonsters();
    success(res, monsters);
  } catch (err) {
    next(err);
  }
}

export async function getMonster(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const monster = await monsterService.getMonster(req.params.id as string);
    if (!monster) {
      error(res, 'MONSTER_NOT_FOUND', 'Monster not found', 404);
      return;
    }
    success(res, monster);
  } catch (err) {
    next(err);
  }
}

export async function getMonstersByMap(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const monsters = await monsterService.getMonstersByMap(req.params.mapId as string);
    success(res, monsters);
  } catch (err) {
    next(err);
  }
}

export async function createMonster(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = createMonsterSchema.safeParse(req.body);
    if (!parsed.success) {
      error(res, ERROR_CODES.VALIDATION_ERROR, parsed.error.message, 400);
      return;
    }
    const monster = await monsterService.createMonster(parsed.data);
    success(res, monster, 201);
  } catch (err) {
    next(err);
  }
}
