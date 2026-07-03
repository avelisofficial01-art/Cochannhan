import { Request, Response } from 'express';
import * as equipmentService from './equipment.service.js';
import { success, error } from '../utils/response.js';

interface AuthenticatedRequest extends Request {
  playerId?: string;
}

// ── Equipment Templates ──

export async function getAllTemplates(_req: Request, res: Response): Promise<void> {
  try {
    const templates = await equipmentService.getAllTemplates();
    success(res, templates);
  } catch {
    error(res, 'INTERNAL_ERROR', 'Failed to fetch equipment templates', 500);
  }
}

export async function getTemplateById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const template = await equipmentService.getTemplateById(id);
    if (!template) {
      error(res, 'NOT_FOUND', 'Equipment template not found', 404);
      return;
    }
    success(res, template);
  } catch {
    error(res, 'INTERNAL_ERROR', 'Failed to fetch equipment template', 500);
  }
}

// ── Player Equipment ──

export async function getPlayerEquipment(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const playerId = req.playerId ?? null;
    if (!playerId) {
      error(res, 'UNAUTHORIZED', 'Player not authenticated', 401);
      return;
    }
    const equipment = await equipmentService.getPlayerEquipment(playerId);
    success(res, equipment);
  } catch {
    error(res, 'INTERNAL_ERROR', 'Failed to fetch player equipment', 500);
  }
}

export async function giveEquipment(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const playerId = req.playerId ?? null;
    if (!playerId) {
      error(res, 'UNAUTHORIZED', 'Player not authenticated', 401);
      return;
    }
    const { equipmentId } = req.body as { equipmentId: string };
    if (!equipmentId) {
      error(res, 'VALIDATION', 'equipmentId is required', 400);
      return;
    }
    const result = await equipmentService.giveEquipment(playerId, equipmentId);
    success(res, result);
  } catch (err) {
    error(res, 'INTERNAL_ERROR', (err as Error).message ?? 'Failed to give equipment', 500);
  }
}

// ── Equip / Unequip ──

export async function equipEquipment(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const playerId = req.playerId ?? null;
    if (!playerId) {
      error(res, 'UNAUTHORIZED', 'Player not authenticated', 401);
      return;
    }
    const { playerEquipmentId, slotIndex } = req.body as {
      playerEquipmentId: string;
      slotIndex: number;
    };
    if (!playerEquipmentId || slotIndex === undefined) {
      error(res, 'VALIDATION', 'playerEquipmentId and slotIndex are required', 400);
      return;
    }
    const result = await equipmentService.equipEquipment(playerId, playerEquipmentId, slotIndex);
    success(res, result);
  } catch (err) {
    error(res, 'VALIDATION', (err as Error).message ?? 'Failed to equip', 400);
  }
}

export async function unequipEquipment(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const playerId = req.playerId ?? null;
    if (!playerId) {
      error(res, 'UNAUTHORIZED', 'Player not authenticated', 401);
      return;
    }
    const { playerEquipmentId } = req.body as { playerEquipmentId: string };
    if (!playerEquipmentId) {
      error(res, 'VALIDATION', 'playerEquipmentId is required', 400);
      return;
    }
    const result = await equipmentService.unequipEquipment(playerId, playerEquipmentId);
    success(res, result);
  } catch (err) {
    error(res, 'VALIDATION', (err as Error).message ?? 'Failed to unequip', 400);
  }
}

// ── Enhancement ──

export async function enhanceEquipment(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const playerId = req.playerId ?? null;
    if (!playerId) {
      error(res, 'UNAUTHORIZED', 'Player not authenticated', 401);
      return;
    }
    const { playerEquipmentId } = req.body as { playerEquipmentId: string };
    if (!playerEquipmentId) {
      error(res, 'VALIDATION', 'playerEquipmentId is required', 400);
      return;
    }
    const result = await equipmentService.enhanceEquipment(playerId, playerEquipmentId);
    success(res, result);
  } catch (err) {
    error(res, 'VALIDATION', (err as Error).message ?? 'Failed to enhance', 400);
  }
}
