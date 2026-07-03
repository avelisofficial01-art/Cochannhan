import * as craftRepo from './craft.repository.js';
import { inventoryRepository } from '../inventory/inventory.repository.js';
import * as equipmentRepo from '../equipment/equipment.repository.js';
import { playerRepository } from '../player/player.repository.js';

// ── Recipes ──

export async function getAllRecipes(): Promise<Record<string, unknown>[]> {
  return craftRepo.getAllRecipes();
}

export async function getRecipeWithMaterials(id: string): Promise<Record<string, unknown> | null> {
  return craftRepo.getRecipeWithMaterials(id);
}

// ── Crafting ──

export async function craftItem(
  playerId: string,
  recipeId: string,
): Promise<Record<string, unknown>> {
  // Get full recipe with materials
  const recipe = await craftRepo.getRecipeWithMaterials(recipeId);
  if (!recipe) {
    throw new Error('Recipe not found');
  }

  const recipeData = recipe as {
    id: string;
    name: string;
    resultType: string;
    resultId: string;
    resultQuantity: number;
    requiredGold: number;
    successRate: number;
    minRealm: number;
    materials: Array<{ itemId: string; quantity: number }>;
  };

  // Check realm requirement
  const player = await playerRepository.findById(playerId);
  if (!player) {
    throw new Error('Player not found');
  }
  if (player.realm < recipeData.minRealm) {
    throw new Error(`Requires realm ${recipeData.minRealm} (current: ${player.realm})`);
  }

  // Check gold
  if (player.gold < recipeData.requiredGold) {
    throw new Error(`Not enough gold. Required: ${recipeData.requiredGold}, have: ${player.gold}`);
  }

  // Check materials (playerInventory rows: { id, item_id, quantity, slot })
  const inventory = await inventoryRepository.getInventory(playerId);
  for (const mat of recipeData.materials) {
    const playerItem = inventory.find(
      (item) => item.item_id === mat.itemId,
    );
    if (!playerItem || playerItem.quantity < mat.quantity) {
      throw new Error(`Not enough materials: ${mat.itemId}`);
    }
  }

  // Deduct gold
  const newGold = player.gold - recipeData.requiredGold;
  await playerRepository.update(playerId, { gold: newGold });

  // Deduct materials
  for (const mat of recipeData.materials) {
    await inventoryRepository.removeItem(playerId, mat.itemId, mat.quantity);
  }

  // Roll for success
  const roll = Math.random() * 100;
  const success = roll <= recipeData.successRate;

  if (!success) {
    await craftRepo.logCraft(playerId, recipeId, false);
    return {
      success: false,
      recipeId,
      resultType: recipeData.resultType,
      resultId: recipeData.resultId,
      resultQuantity: 0,
    };
  }

  // Give result
  if (recipeData.resultType === 'equipment') {
    await equipmentRepo.giveEquipment(playerId, recipeData.resultId);
  } else {
    // Items and Gu — add to inventory at slot 0 (auto-placed)
    await inventoryRepository.addItem(playerId, recipeData.resultId, recipeData.resultQuantity, 0);
  }

  await craftRepo.logCraft(playerId, recipeId, true);

  return {
    success: true,
    recipeId,
    resultType: recipeData.resultType,
    resultId: recipeData.resultId,
    resultQuantity: recipeData.resultQuantity,
  };
}
