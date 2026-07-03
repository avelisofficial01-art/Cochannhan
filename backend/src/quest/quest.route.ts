import { Router } from 'express';
import { questController } from './quest.controller.js';
import { authenticate, resolvePlayer } from '../middleware/auth.js';

const router = Router();

router.get('/', questController.getAllQuests);
router.get('/:id', questController.getQuest);
router.post('/', authenticate, questController.createQuest);

// Player quests (require auth + resolve player)
router.get('/player/active', authenticate, resolvePlayer, questController.getPlayerQuests);
router.post('/accept', authenticate, resolvePlayer, questController.acceptQuest);
router.post('/:questId/progress', authenticate, resolvePlayer, questController.updateQuestProgress);

// Story flags
router.get('/flags/list', authenticate, resolvePlayer, questController.getStoryFlags);
router.post('/flags/set', authenticate, resolvePlayer, questController.setStoryFlag);

export default router;
