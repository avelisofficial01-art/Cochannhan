import { Router } from 'express';
import { authenticate, resolvePlayer } from '../middleware/auth.js';
import {
  getAllTemplates,
  getTemplateById,
  getPlayerGuList,
  equipGu,
  unequipGu,
  enhanceGu,
  getSynergies,
} from './gu.controller.js';

const router = Router();

// Public: browse all Gu templates
router.get('/templates', getAllTemplates);
router.get('/templates/:id', getTemplateById);

// Authenticated: player Gu management — resolvePlayer populates req.playerId
router.get('/player', authenticate, resolvePlayer, getPlayerGuList);
router.post('/equip', authenticate, resolvePlayer, equipGu);
router.post('/unequip', authenticate, resolvePlayer, unequipGu);
router.post('/enhance', authenticate, resolvePlayer, enhanceGu);
router.get('/synergies', authenticate, resolvePlayer, getSynergies);

export default router;
