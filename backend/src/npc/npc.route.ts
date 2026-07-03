import { Router } from 'express';
import { npcController } from './npc.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', npcController.getAllNpcs);
router.get('/map/:mapId', npcController.getNpcsByMap);
router.get('/:id', npcController.getNpc);
router.post('/', authenticate, npcController.createNpc);

// Dialogues
router.get('/:npcId/dialogues', npcController.getNpcDialogues);
router.get('/dialogues/:id', npcController.getDialogue);
router.post('/dialogues', authenticate, npcController.createDialogue);

export default router;
