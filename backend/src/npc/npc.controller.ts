import type { Request, Response, NextFunction } from 'express';
import { npcService } from './npc.service.js';
import { createNpcSchema, createDialogueSchema } from './npc.schema.js';

export const npcController = {
  async getAllNpcs(_req: Request, res: Response, next: NextFunction) {
    try {
      const npcs = await npcService.getAllNpcs();
      res.json({ success: true, data: npcs });
    } catch (err) {
      next(err);
    }
  },

  async getNpcsByMap(req: Request, res: Response, next: NextFunction) {
    try {
      const npcs = await npcService.getNpcsByMap(req.params.mapId as string);
      res.json({ success: true, data: npcs });
    } catch (err) {
      next(err);
    }
  },

  async getNpc(req: Request, res: Response, next: NextFunction) {
    try {
      const npc = await npcService.getNpc(req.params.id as string);
      if (!npc) {
        res.status(404).json({ success: false, code: 'NPC_NOT_FOUND', message: 'NPC not found' });
        return;
      }
      res.json({ success: true, data: npc });
    } catch (err) {
      next(err);
    }
  },

  async createNpc(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createNpcSchema.parse(req.body);
      const npc = await npcService.createNpc(input);
      res.status(201).json({ success: true, data: npc });
    } catch (err) {
      next(err);
    }
  },

  // Dialogues
  async getNpcDialogues(req: Request, res: Response, next: NextFunction) {
    try {
      const dialogues = await npcService.getNpcDialogues(req.params.npcId as string);
      res.json({ success: true, data: dialogues });
    } catch (err) {
      next(err);
    }
  },

  async getDialogue(req: Request, res: Response, next: NextFunction) {
    try {
      const dialogue = await npcService.getDialogue(req.params.id as string);
      if (!dialogue) {
        res.status(404).json({ success: false, code: 'DIALOGUE_NOT_FOUND', message: 'Dialogue not found' });
        return;
      }
      res.json({ success: true, data: dialogue });
    } catch (err) {
      next(err);
    }
  },

  async createDialogue(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createDialogueSchema.parse(req.body);
      const dialogue = await npcService.createDialogue(input);
      res.status(201).json({ success: true, data: dialogue });
    } catch (err) {
      next(err);
    }
  },
};
