import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
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

// Authenticated: player Gu management
router.get('/player', authenticate, getPlayerGuList);
router.post('/equip', authenticate, equipGu);
router.post('/unequip', authenticate, unequipGu);
router.post('/enhance', authenticate, enhanceGu);
router.get('/synergies', authenticate, getSynergies);

export default router;
