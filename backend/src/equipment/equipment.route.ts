import { Router } from 'express';
import { authenticate, resolvePlayer } from '../middleware/auth.js';
import {
  getAllTemplates,
  getTemplateById,
  getPlayerEquipment,
  giveEquipment,
  equipEquipment,
  unequipEquipment,
  enhanceEquipment,
} from './equipment.controller.js';

const router = Router();

// Public
router.get('/templates', getAllTemplates);
router.get('/templates/:id', getTemplateById);

// Protected — resolvePlayer populates req.playerId
router.get('/player', authenticate, resolvePlayer, getPlayerEquipment);
router.post('/give', authenticate, resolvePlayer, giveEquipment);
router.post('/equip', authenticate, resolvePlayer, equipEquipment);
router.post('/unequip', authenticate, resolvePlayer, unequipEquipment);
router.post('/enhance', authenticate, resolvePlayer, enhanceEquipment);

export default router;
