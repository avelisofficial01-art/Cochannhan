import { Router } from 'express';
import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import * as cultivationService from './cultivation.service.js';

const router = Router();

// GET /api/cultivation/realms
router.get('/realms', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const realms = await cultivationService.getRealms();
    res.json({ success: true, data: realms });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to get realms' });
  }
});

// GET /api/cultivation/player
router.get('/player', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const playerId = req.playerId ?? '';
    const cult = await cultivationService.getPlayerCultivation(playerId);
    res.json({ success: true, data: cult });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to get cultivation' });
  }
});

// POST /api/cultivation/breakthrough
router.post('/breakthrough', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const playerId = req.playerId ?? '';
    const result = await cultivationService.breakthrough(playerId);
    res.json({ success: true, data: result });
  } catch {
    res.status(500).json({ success: false, message: 'Breakthrough failed' });
  }
});

export default router;
