import { Router } from 'express';
import { shopController } from './shop.controller.js';
import { authenticate, resolvePlayer } from '../middleware/auth.js';

const router = Router();

// Apply auth to all shop routes
router.use(authenticate, resolvePlayer);

router.get('/:npcId', shopController.getShop);
router.post('/buy', shopController.buyItem);
router.post('/sell', shopController.sellItem);

export default router;
