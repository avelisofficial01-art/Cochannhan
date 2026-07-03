import { Router } from 'express';
import { authenticate, resolvePlayer } from '../middleware/auth.js';
import * as combatController from './combat.controller.js';

const router = Router();

router.post('/attack', authenticate, resolvePlayer, combatController.attack);
router.get('/monsters/:mapId', authenticate, combatController.getMonstersOnMap);
router.post('/spawn', authenticate, combatController.spawnMonsters);

export default router;
