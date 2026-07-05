import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getAllRecipes,
  getRecipeById,
  craftItem,
} from './craft.controller.js';

const router = Router();

// Public
router.get('/recipes', getAllRecipes);
router.get('/recipes/:id', getRecipeById);

// Protected
router.post('/craft', authenticate, craftItem);

export default router;
