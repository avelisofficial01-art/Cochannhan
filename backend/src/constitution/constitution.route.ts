import { Router } from 'express';
import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { authenticate, resolvePlayer } from '../middleware/auth.js';
import * as constitutionService from './constitution.service.js';

const router = Router();

// GET /api/constitution — list all 10 Thập Tuyệt Thể (public, no auth needed)
router.get('/', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const constitutions = await constitutionService.listConstitutions();
    res.json({ success: true, data: constitutions });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ success: false, message });
  }
});

// GET /api/constitution/me — get current player's constitution
router.get('/me', authenticate, resolvePlayer, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const playerId = req.playerId;
    if (!playerId) {
      res.status(401).json({ success: false, message: 'Player not resolved' });
      return;
    }
    const constitution = await constitutionService.getPlayerConstitution(playerId);
    res.json({ success: true, data: constitution });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ success: false, message });
  }
});

// POST /api/constitution/choose — choose constitution at character creation
router.post('/choose', authenticate, resolvePlayer, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const playerId = req.playerId;
    if (!playerId) {
      res.status(401).json({ success: false, message: 'Player not resolved' });
      return;
    }
    const { constitutionId } = req.body as { constitutionId: number };
    if (!constitutionId || typeof constitutionId !== 'number') {
      res.status(400).json({ success: false, message: 'constitutionId is required' });
      return;
    }
    const result = await constitutionService.chooseConstitution(playerId, constitutionId);
    res.json({ success: true, data: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const status = message === 'Constitution already chosen' ? 409 : 400;
    res.status(status).json({ success: false, message });
  }
});

export default router;
