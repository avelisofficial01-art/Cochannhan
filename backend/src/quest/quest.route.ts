import { Router } from 'express';
import { questController } from './quest.controller.js';
import { authenticate, resolvePlayer } from '../middleware/auth.js';

const router = Router();

router.get('/', questController.getAllQuests);
router.post('/', authenticate, questController.createQuest);

// Player quests — MUST be before /:id to avoid Express matching 'player' as :id
router.get('/player/active', authenticate, resolvePlayer, questController.getPlayerQuests);
router.post('/accept', authenticate, resolvePlayer, questController.acceptQuest);
router.post('/complete', authenticate, resolvePlayer, questController.completeQuest);
router.post('/progress', authenticate, resolvePlayer, questController.updateQuestProgress);

// Story flags — MUST be before /:id
router.get('/flags/list', authenticate, resolvePlayer, questController.getStoryFlags);
router.post('/flags/set', authenticate, resolvePlayer, questController.setStoryFlag);

// Wildcard /:id MUST come LAST
router.get('/:id', questController.getQuest);
router.post('/:questId/progress', authenticate, resolvePlayer, questController.updateQuestProgress);

export default router;
