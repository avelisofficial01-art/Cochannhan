import { Router } from 'express';
import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import * as saveService from './save.service.js';

const router = Router();

// GET /api/save
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const playerId = req.playerId ?? '';
    const saves = await saveService.getSaves(playerId);
    res.json({ success: true, data: saves });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to get saves' });
  }
});

// POST /api/save
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const playerId = req.playerId ?? '';
    const { saveName } = req.body as { saveName?: string };
    const save = await saveService.createSave(playerId, saveName ?? 'Manual Save', false);
    res.json({ success: true, data: save });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to create save' });
  }
});

// GET /api/save/:id
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const saveId = String(req.params.id);
    const data = await saveService.loadSave(saveId);
    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to load save' });
  }
});

// DELETE /api/save/:id
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const saveId = String(req.params.id);
    await saveService.deleteSave(saveId);
    res.json({ success: true, message: 'Save deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete save' });
  }
});

export default router;
