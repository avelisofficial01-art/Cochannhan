import { Router } from 'express';
import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import * as storyService from './story.service.js';

const router = Router();

// GET /api/story/flags
router.get('/flags', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const playerId = req.playerId ?? '';
    const flags = await storyService.getFlags(playerId);
    res.json({ success: true, data: flags });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to get story flags' });
  }
});

// GET /api/story/flags/:key
router.get('/flags/:key', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const playerId = req.playerId ?? '';
    const flag = await storyService.getFlag(playerId, String(req.params.key));
    res.json({ success: true, data: flag });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to get flag' });
  }
});

// POST /api/story/flags
router.post('/flags', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const playerId = req.playerId ?? '';
    const { flagKey, flagValue } = req.body as { flagKey: string; flagValue: string };
    if (!flagKey) {
      res.status(400).json({ success: false, message: 'flagKey is required' });
      return;
    }
    const flag = await storyService.setFlag(playerId, flagKey, flagValue ?? 'true');
    res.json({ success: true, data: flag });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to set flag' });
  }
});

export default router;
