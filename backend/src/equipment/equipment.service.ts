import * as equipmentRepo from './equipment.repository.js';

// ── Equipment Templates ──

export async function getAllTemplates(): Promise<Record<string, unknown>[]> {
  return equipmentRepo.getAllTemplates();
}

export async function getTemplateById(id: string): Promise<Record<string, unknown> | null> {
  return equipmentRepo.getTemplateById(id);
}

// ── Player Equipment ──

export async function getPlayerEquipment(playerId: string): Promise<Record<string, unknown>[]> {
  return equipmentRepo.getPlayerEquipment(playerId);
}

export async function giveEquipment(playerId: string, equipmentId: string): Promise<Record<string, unknown> | null> {
  return equipmentRepo.giveEquipment(playerId, equipmentId);
}

export async function equipEquipment(playerId: string, playerEquipId: string, slotIndex: number): Promise<Record<string, unknown>> {
  // Get the equipment details
  const playerEquip = await equipmentRepo.getPlayerEquipById(playerEquipId);
  if (!playerEquip) {
    throw new Error('Equipment not found');
  }

  const equipData = playerEquip as { playerId: string; slotIndex: number | null; isEquipped: string };
  if (equipData.playerId !== playerId) {
    throw new Error('Equipment does not belong to this player');
  }
  if (equipData.isEquipped === 'true') {
    throw new Error('Equipment is already equipped');
  }

  // Check if slot is occupied
  const occupied = await equipmentRepo.getEquippedInSlot(playerId, slotIndex);
  if (occupied) {
    // Unequip current item in this slot
    const occData = occupied as { id: string };
    await equipmentRepo.unequipPlayerEquipment(occData.id);
  }

  await equipmentRepo.equipPlayerEquipment(playerEquipId, slotIndex);

  const updated = await equipmentRepo.getPlayerEquipById(playerEquipId);
  return updated ?? {};
}

export async function unequipEquipment(playerId: string, playerEquipId: string): Promise<Record<string, unknown>> {
  const playerEquip = await equipmentRepo.getPlayerEquipById(playerEquipId);
  if (!playerEquip) {
    throw new Error('Equipment not found');
  }

  const equipData = playerEquip as { playerId: string; isEquipped: string };
  if (equipData.playerId !== playerId) {
    throw new Error('Equipment does not belong to this player');
  }
  if (equipData.isEquipped !== 'true') {
    throw new Error('Equipment is not equipped');
  }

  await equipmentRepo.unequipPlayerEquipment(playerEquipId);

  const updated = await equipmentRepo.getPlayerEquipById(playerEquipId);
  return updated ?? {};
}

export async function enhanceEquipment(playerId: string, playerEquipId: string): Promise<Record<string, unknown>> {
  const playerEquip = await equipmentRepo.getPlayerEquipById(playerEquipId);
  if (!playerEquip) {
    throw new Error('Equipment not found');
  }

  const equipData = playerEquip as { playerId: string; enhancement: number };
  if (equipData.playerId !== playerId) {
    throw new Error('Equipment does not belong to this player');
  }

  const currentEnhancement = equipData.enhancement;
  const maxEnhance = 20;

  if (currentEnhancement >= maxEnhance) {
    throw new Error(`Equipment is already at max enhancement (+${maxEnhance})`);
  }

  const newEnhancement = currentEnhancement + 1;
  await equipmentRepo.enhancePlayerEquipment(playerEquipId, newEnhancement);

  const updated = await equipmentRepo.getPlayerEquipById(playerEquipId);
  return updated ?? {};
}
