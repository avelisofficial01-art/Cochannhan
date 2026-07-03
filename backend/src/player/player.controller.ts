import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { success, error } from '../utils/response.js';
import { createPlayerSchema } from './player.schema.js';
import * as playerService from './player.service.js';
import { ERROR_CODES } from '@co-dao/shared';

export async function getProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const accountId = req.account?.accountId;
    if (!accountId) {
      error(res, ERROR_CODES.INVALID_TOKEN, 'Authentication required.', 401);
      return;
    }

    const profile = await playerService.getProfile(accountId);

    if (!profile) {
      error(res, ERROR_CODES.PLAYER_NOT_FOUND, 'Player does not exist.', 404);
      return;
    }

    success(res, profile);
  } catch (err) {
    next(err);
  }
}

export async function getStats(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const accountId = req.account?.accountId;
    if (!accountId) {
      error(res, ERROR_CODES.INVALID_TOKEN, 'Authentication required.', 401);
      return;
    }

    const stats = await playerService.getStats(accountId);

    if (!stats) {
      error(res, ERROR_CODES.PLAYER_NOT_FOUND, 'Player does not exist.', 404);
      return;
    }

    success(res, stats);
  } catch (err) {
    next(err);
  }
}

export async function createPlayer(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = createPlayerSchema.safeParse(req.body);
    if (!parsed.success) {
      error(
        res,
        ERROR_CODES.VALIDATION_ERROR,
        parsed.error.errors[0].message,
        400,
      );
      return;
    }

    const accountId = req.account?.accountId;
    if (!accountId) {
      error(res, ERROR_CODES.INVALID_TOKEN, 'Authentication required.', 401);
      return;
    }

    const player = await playerService.createPlayer(accountId, parsed.data);

    success(res, { player }, 201);
  } catch (err) {
    next(err);
  }
}
