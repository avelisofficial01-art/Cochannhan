import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { error } from '../utils/response.js';
import type { TokenPayload } from '@co-dao/shared';
import { playerRepository } from '../player/player.repository.js';

export interface AuthenticatedRequest extends Request {
  account?: TokenPayload;
  playerId?: string;
}

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    error(res, 'INVALID_TOKEN', 'Access token is required.', 401);
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, config.jwt.secret) as TokenPayload;
    req.account = payload;
    next();
  } catch {
    error(res, 'INVALID_TOKEN', 'Access token is invalid or expired.', 401);
  }
}

export async function resolvePlayer(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!req.account?.accountId) {
    error(res, 'INVALID_TOKEN', 'Authentication required.', 401);
    return;
  }

  const player = await playerRepository.findByAccountId(req.account.accountId);
  if (!player) {
    error(res, 'PLAYER_NOT_FOUND', 'Player not found. Please create a character first.', 404);
    return;
  }

  req.playerId = player.id;
  next();
}
