import type { Request, Response, NextFunction } from 'express';
import { inventoryService } from './inventory.service.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import {
  addItemSchema,
  moveItemSchema,
  sortInventorySchema,
  createItemSchema,
} from './inventory.schema.js';

function getPlayerId(req: Request): string {
  const playerId = (req as AuthenticatedRequest).playerId;
  if (!playerId) throw new Error('Player not resolved');
  return playerId;
}

export const inventoryController = {
  // Item Templates
  async getAllItems(_req: Request, res: Response, next: NextFunction) {
    try {
      const items = await inventoryService.getAllItems();
      res.json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  },

  async getItem(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await inventoryService.getItem(req.params.id as string);
      if (!item) {
        res.status(404).json({ success: false, code: 'ITEM_NOT_FOUND', message: 'Item not found' });
        return;
      }
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  },

  async createItem(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createItemSchema.parse(req.body);
      const item = await inventoryService.createItem(input);
      res.status(201).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  },

  // Player Inventory
  async getInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const playerId = getPlayerId(req);
      const slots = await inventoryService.getInventory(playerId);
      res.json({ success: true, data: slots });
    } catch (err) {
      next(err);
    }
  },

  async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const playerId = getPlayerId(req);
      const input = addItemSchema.parse(req.body);
      const slot = await inventoryService.addItem(playerId, input);
      res.status(201).json({ success: true, data: slot });
    } catch (err) {
      next(err);
    }
  },

  async moveItem(req: Request, res: Response, next: NextFunction) {
    try {
      const playerId = getPlayerId(req);
      const input = moveItemSchema.parse(req.body);
      await inventoryService.moveItem(playerId, input);
      res.json({ success: true, data: null });
    } catch (err) {
      next(err);
    }
  },

  async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const playerId = getPlayerId(req);
      const { itemId, quantity } = req.body;
      await inventoryService.removeItem(playerId, itemId, quantity);
      res.json({ success: true, data: null });
    } catch (err) {
      next(err);
    }
  },

  async sortInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const playerId = getPlayerId(req);
      const { sortBy } = sortInventorySchema.parse(req.body);
      const slots = await inventoryService.sortInventory(playerId, sortBy);
      res.json({ success: true, data: slots });
    } catch (err) {
      next(err);
    }
  },
};
