import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as monsterController from './monster.controller.js';

const router = Router();

router.get('/map/:mapId', authenticate, monsterController.getMonstersByMap);
router.get('/', authenticate, monsterController.getAllMonsters);
router.get('/:id', authenticate, monsterController.getMonster);
router.post('/', authenticate, monsterController.createMonster);

export default router;
