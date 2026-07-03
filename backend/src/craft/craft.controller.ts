import { Request, Response } from 'express';
import * as craftService from './craft.service.js';
import { success, error } from '../utils/response.js';

interface AuthenticatedRequest extends Request {
  playerId?: string;
}

// ── Recipes ──

export async function getAllRecipes(_req: Request, res: Response): Promise<void> {
  try {
    const recipes = await craftService.getAllRecipes();
    success(res, recipes);
  } catch {
    error(res, 'INTERNAL_ERROR', 'Failed to fetch craft recipes', 500);
  }
}

export async function getRecipeById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const recipe = await craftService.getRecipeWithMaterials(id);
    if (!recipe) {
      error(res, 'NOT_FOUND', 'Recipe not found', 404);
      return;
    }
    success(res, recipe);
  } catch {
    error(res, 'INTERNAL_ERROR', 'Failed to fetch recipe', 500);
  }
}

// ── Craft ──

export async function craftItem(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const playerId = req.playerId ?? null;
    if (!playerId) {
      error(res, 'UNAUTHORIZED', 'Player not authenticated', 401);
      return;
    }
    const { recipeId } = req.body as { recipeId: string };
    if (!recipeId) {
      error(res, 'VALIDATION', 'recipeId is required', 400);
      return;
    }
    const result = await craftService.craftItem(playerId, recipeId);
    success(res, result);
  } catch (err) {
    error(res, 'VALIDATION', (err as Error).message ?? 'Failed to craft', 400);
  }
}
