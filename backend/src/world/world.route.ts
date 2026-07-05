import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as worldController from './world.controller.js';

const router = Router();

router.get('/maps', authenticate, worldController.getMaps);
router.get('/maps/:mapId', authenticate, worldController.getMapById);
router.get('/maps/:mapId/portals', authenticate, worldController.getPortals);

export default router;
