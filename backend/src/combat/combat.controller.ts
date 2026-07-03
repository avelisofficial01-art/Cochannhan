import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { success, error } from '../utils/response.js';
import * as combatService from './combat.service.js';
import * as monsterService from '../monster/monster.service.js';
import { ERROR_CODES } from '@co-dao/shared';

export async function attack(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const playerId = req.playerId;
    const { targetInstanceId } = req.body as { targetInstanceId: string };

    if (!targetInstanceId) {
      error(res, ERROR_CODES.VALIDATION_ERROR, 'targetInstanceId is required', 400);
      return;
    }

    const currentPlayerId = playerId;
    if (!currentPlayerId) {
      error(res, ERROR_CODES.UNAUTHORIZED, 'Player not authenticated', 401);
      return;
    }

    const result = await combatService.executePlayerAttack(currentPlayerId, targetInstanceId);
    if (!result) {
      error(res, 'TARGET_NOT_FOUND', 'Target monster not found', 404);
      return;
    }

    success(res, result);
  } catch (err) {
    next(err);
  }
}

export async function getMonstersOnMap(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const mapId = req.params.mapId as string;
    const instances = combatService.getMonstersOnMap(mapId);
    success(res, instances);
  } catch (err) {
    next(err);
  }
}

export async function spawnMonsters(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { templateId, count, spawns } = req.body as {
      templateId: string;
      count: number;
      spawns: Array<{ x: number; y: number }>;
    };

    const template = await monsterService.getMonster(templateId);
    if (!template) {
      error(res, 'MONSTER_TEMPLATE_NOT_FOUND', 'Monster template not found', 404);
      return;
    }

    success(res, combatService.spawnMonstersFromTemplate(template, count, spawns));
  } catch (err) {
    next(err);
  }
}
