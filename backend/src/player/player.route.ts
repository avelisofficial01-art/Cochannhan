import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as playerController from './player.controller.js';

const router = Router();

router.get('/profile', authenticate, playerController.getProfile);
router.get('/stats', authenticate, playerController.getStats);
router.post('/create', authenticate, playerController.createPlayer);

export default router;
