import type { Request, Response, NextFunction } from 'express';
import { questService } from './quest.service.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import {
  acceptQuestSchema,
  updateQuestProgressSchema,
  createQuestSchema,
} from './quest.schema.js';

function getPlayerId(req: Request): string {
  const playerId = (req as AuthenticatedRequest).playerId;
  if (!playerId) throw new Error('Player not resolved');
  return playerId;
}

export const questController = {
  async getAllQuests(_req: Request, res: Response, next: NextFunction) {
    try {
      const quests = await questService.getAllQuests();
      res.json({ success: true, data: quests });
    } catch (err) {
      next(err);
    }
  },

  async getQuest(req: Request, res: Response, next: NextFunction) {
    try {
      const quest = await questService.getQuest(req.params.id as string);
      if (!quest) {
        res.status(404).json({ success: false, code: 'QUEST_NOT_FOUND', message: 'Quest not found' });
        return;
      }
      res.json({ success: true, data: quest });
    } catch (err) {
      next(err);
    }
  },

  async createQuest(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createQuestSchema.parse(req.body);
      const quest = await questService.createQuest(input);
      res.status(201).json({ success: true, data: quest });
    } catch (err) {
      next(err);
    }
  },

  // Player Quests
  async getPlayerQuests(req: Request, res: Response, next: NextFunction) {
    try {
      const playerId = getPlayerId(req);
      const quests = await questService.getPlayerQuests(playerId);
      res.json({ success: true, data: quests });
    } catch (err) {
      next(err);
    }
  },

  async acceptQuest(req: Request, res: Response, next: NextFunction) {
    try {
      const playerId = getPlayerId(req);
      const { questId } = acceptQuestSchema.parse(req.body);
      const pq = await questService.acceptQuest(playerId, questId);
      res.status(201).json({ success: true, data: pq });
    } catch (err) {
      next(err);
    }
  },

  async updateQuestProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const playerId = getPlayerId(req);
      const { questId } = req.params as { questId: string };
      const { objectiveIndex, amount } = updateQuestProgressSchema.parse(req.body);
      const pq = await questService.updateQuestProgress(playerId, questId, objectiveIndex, amount);
      res.json({ success: true, data: pq });
    } catch (err) {
      next(err);
    }
  },

  // Story Flags
  async getStoryFlags(req: Request, res: Response, next: NextFunction) {
    try {
      const playerId = getPlayerId(req);
      const flags = await questService.getStoryFlags(playerId);
      res.json({ success: true, data: flags });
    } catch (err) {
      next(err);
    }
  },

  async setStoryFlag(req: Request, res: Response, next: NextFunction) {
    try {
      const playerId = getPlayerId(req);
      const { key, value } = req.body;
      const flag = await questService.setStoryFlag(playerId, key, value);
      res.json({ success: true, data: flag });
    } catch (err) {
      next(err);
    }
  },
};
