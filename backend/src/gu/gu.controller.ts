import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { success, error } from '../utils/response.js';
import * as guService from './gu.service.js';
import { z } from 'zod';
import { config } from '../config/index.js';

// ── Zod schemas ──
const equipSchema = z.object({
  playerGuId: z.string().uuid(),
  slotIndex: z.number().int().min(0),
});

const enhanceSchema = z.object({
  playerGuId: z.string().uuid(),
});

// ── Templates ──
export async function getAllTemplates(_req: Request, res: Response): Promise<void> {
  try {
    const templates = await guService.getAllTemplates();
    success(res, templates);
  } catch {
    error(res, 'INTERNAL_ERROR', 'Failed to fetch Gu templates', 500);
  }
}

export async function getTemplateById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const template = await guService.getTemplateById(id);
    if (!template) {
      error(res, 'GU_NOT_FOUND', 'Gu template not found', 404);
      return;
    }
    success(res, template);
  } catch {
    error(res, 'INTERNAL_ERROR', 'Failed to fetch Gu template', 500);
  }
}

// ── Player Gu ──
export async function getPlayerGuList(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const playerId = req.playerId ?? null;
    if (!playerId) {
      error(res, 'UNAUTHORIZED', 'Player not authenticated', 401);
      return;
    }
    const guList = await guService.getPlayerGuList(playerId);
    success(res, guList);
  } catch {
    error(res, 'INTERNAL_ERROR', 'Failed to fetch player Gu list', 500);
  }
}

// ── Equip / Unequip ──
export async function equipGu(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const playerId = req.playerId ?? null;
    if (!playerId) {
      error(res, 'UNAUTHORIZED', 'Player not authenticated', 401);
      return;
    }

    const parsed = equipSchema.safeParse(req.body);
    if (!parsed.success) {
      error(res, 'VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Invalid input', 400);
      return;
    }

    const maxSlots = config.game.defaultMaxGuSlots;
    const result = await guService.equipGu(playerId, parsed.data.playerGuId, parsed.data.slotIndex, maxSlots);

    if (!result.success) {
      error(res, result.code ?? 'EQUIP_FAILED', result.message ?? 'Failed to equip', 400);
      return;
    }

    success(res, { message: 'Cổ Trùng đã được trang bị' });
  } catch {
    error(res, 'INTERNAL_ERROR', 'Failed to equip Gu', 500);
  }
}

export async function unequipGu(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const playerId = req.playerId ?? null;
    if (!playerId) {
      error(res, 'UNAUTHORIZED', 'Player not authenticated', 401);
      return;
    }

    const parsed = equipSchema.safeParse(req.body);
    if (!parsed.success) {
      error(res, 'VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Invalid input', 400);
      return;
    }

    const result = await guService.unequipGu(playerId, parsed.data.playerGuId);

    if (!result.success) {
      error(res, result.code ?? 'UNEQUIP_FAILED', result.message ?? 'Failed to unequip', 400);
      return;
    }

    success(res, { message: 'Cổ Trùng đã được tháo' });
  } catch {
    error(res, 'INTERNAL_ERROR', 'Failed to unequip Gu', 500);
  }
}

// ── Enhance ──
export async function enhanceGu(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const playerId = req.playerId ?? null;
    if (!playerId) {
      error(res, 'UNAUTHORIZED', 'Player not authenticated', 401);
      return;
    }

    const parsed = enhanceSchema.safeParse(req.body);
    if (!parsed.success) {
      error(res, 'VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Invalid input', 400);
      return;
    }

    const result = await guService.enhanceGu(playerId, parsed.data.playerGuId);

    if (!result.success) {
      error(res, result.code ?? 'ENHANCE_FAILED', result.message ?? 'Failed to enhance', 400);
      return;
    }

    success(res, {
      message: `Cường hóa thành công +${result.newEnhancement}`,
      newEnhancement: result.newEnhancement,
    });
  } catch {
    error(res, 'INTERNAL_ERROR', 'Failed to enhance Gu', 500);
  }
}

// ── Synergies ──
export async function getSynergies(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const playerId = req.playerId ?? null;
    if (!playerId) {
      error(res, 'UNAUTHORIZED', 'Player not authenticated', 401);
      return;
    }
    const synergies = await guService.getEquippedSynergies(playerId);
    success(res, synergies);
  } catch {
    error(res, 'INTERNAL_ERROR', 'Failed to fetch synergies', 500);
  }
}
