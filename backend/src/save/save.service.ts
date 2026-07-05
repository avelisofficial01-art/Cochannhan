import * as saveRepo from './save.repository.js';
import * as storyRepo from '../story/story.repository.js';
import * as equipmentRepo from '../equipment/equipment.repository.js';
import { inventoryRepository } from '../inventory/inventory.repository.js';
import * as cultivationRepo from '../cultivation/cultivation.repository.js';
import { playerRepository } from '../player/player.repository.js';
import type { PlayerSave } from '@co-dao/shared';

export async function getSaves(playerId: string): Promise<PlayerSave[]> {
  return saveRepo.getSaves(playerId);
}

export async function createSave(
  playerId: string,
  saveName: string,
  isAuto: boolean,
): Promise<PlayerSave> {
  // Gather all player data
  const player = await playerRepository.findById(playerId);
  const flags = await storyRepo.getPlayerFlags(playerId);
  const inventory = await inventoryRepository.getInventory(playerId);
  const equipment = await equipmentRepo.getPlayerEquipment(playerId);
  const cultivation = await cultivationRepo.getPlayerCultivation(playerId);

  const saveData: Record<string, unknown> = {
    player: player ?? null,
    flags,
    inventory,
    equipment,
    cultivation,
  };

  return saveRepo.createSave(playerId, saveName, isAuto, saveData);
}

export async function loadSave(saveId: string): Promise<Record<string, unknown> | null> {
  const save = await saveRepo.getSave(saveId);
  if (!save) return null;
  return save.saveData;
}

export async function deleteSave(saveId: string): Promise<void> {
  await saveRepo.deleteSave(saveId);
}
