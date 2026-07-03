import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
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

// Protected
router.get('/player', authenticate, getPlayerEquipment);
router.post('/give', authenticate, giveEquipment);
router.post('/equip', authenticate, equipEquipment);
router.post('/unequip', authenticate, unequipEquipment);
router.post('/enhance', authenticate, enhanceEquipment);

export default router;
