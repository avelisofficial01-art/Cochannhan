import type { Request, Response, NextFunction } from 'express';
import { shopService } from './shop.service.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { z } from 'zod';
import { ERROR_CODES } from '@co-dao/shared';
import { error } from '../utils/response.js';

function getPlayerId(req: Request): string {
  const playerId = (req as AuthenticatedRequest).playerId;
  if (!playerId) {
    throw { code: ERROR_CODES.PLAYER_NOT_FOUND, message: 'Player not resolved', status: 401 };
  }
  return playerId;
}

const buyItemSchema = z.object({
  npcId: z.string().uuid(),
  itemId: z.string().uuid(),
  quantity: z.number().int().min(1),
});

const sellItemSchema = z.object({
  itemId: z.string().uuid(),
  quantity: z.number().int().min(1),
});

export const shopController = {
  async getShop(req: Request, res: Response, next: NextFunction) {
    try {
      const npcId = req.params.npcId as string;
      if (!npcId) {
        error(res, ERROR_CODES.VALIDATION_ERROR, 'npcId is required', 400);
        return;
      }
      const data = await shopService.getShopByNpc(npcId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async buyItem(req: Request, res: Response, next: NextFunction) {
    try {
      const playerId = getPlayerId(req);
      const parsed = buyItemSchema.safeParse(req.body);
      if (!parsed.success) {
        error(res, ERROR_CODES.VALIDATION_ERROR, parsed.error.errors[0].message, 400);
        return;
      }
      const { npcId, itemId, quantity } = parsed.data;
      const data = await shopService.buyItem(playerId, npcId, itemId, quantity);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async sellItem(req: Request, res: Response, next: NextFunction) {
    try {
      const playerId = getPlayerId(req);
      const parsed = sellItemSchema.safeParse(req.body);
      if (!parsed.success) {
        error(res, ERROR_CODES.VALIDATION_ERROR, parsed.error.errors[0].message, 400);
        return;
      }
      const { itemId, quantity } = parsed.data;
      const data = await shopService.sellItem(playerId, itemId, quantity);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
};
