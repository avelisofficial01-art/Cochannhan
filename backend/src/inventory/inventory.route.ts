import { Router } from 'express';
import { inventoryController } from './inventory.controller.js';
import { authenticate, resolvePlayer } from '../middleware/auth.js';

const router = Router();

// Item templates
router.get('/items', inventoryController.getAllItems);
router.get('/items/:id', inventoryController.getItem);
router.post('/items', authenticate, inventoryController.createItem);

// Player inventory (require auth + resolve player)
router.get('/', authenticate, resolvePlayer, inventoryController.getInventory);
router.post('/add', authenticate, resolvePlayer, inventoryController.addItem);
router.post('/move', authenticate, resolvePlayer, inventoryController.moveItem);
router.post('/remove', authenticate, resolvePlayer, inventoryController.removeItem);
router.post('/sort', authenticate, resolvePlayer, inventoryController.sortInventory);

export default router;
