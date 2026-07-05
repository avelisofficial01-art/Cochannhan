import * as cultivationRepo from './cultivation.repository.js';
import { playerRepository } from '../player/player.repository.js';
import type { BreakthroughResult, CultivationRealm, PlayerCultivation } from '@co-dao/shared';

export async function getRealms(): Promise<CultivationRealm[]> {
  return cultivationRepo.getAllRealms();
}

export async function getRealm(level: number): Promise<CultivationRealm | null> {
  return cultivationRepo.getRealmByLevel(level);
}

export async function getPlayerCultivation(playerId: string): Promise<PlayerCultivation | null> {
  return cultivationRepo.getPlayerCultivation(playerId);
}

export async function breakthrough(playerId: string): Promise<BreakthroughResult> {
  let cult = await cultivationRepo.getPlayerCultivation(playerId);
  if (!cult) {
    cult = await cultivationRepo.initPlayerCultivation(playerId);
  }

  const currentRealm = await cultivationRepo.getRealmByLevel(cult.realmLevel);
  if (!currentRealm) {
    return { success: false, fromLevel: cult.realmLevel, toLevel: cult.realmLevel, message: 'Invalid current realm' };
  }

  // Check if breakthrough is needed
  if (currentRealm.requiredBreakthrough !== 'true') {
    return { success: false, fromLevel: cult.realmLevel, toLevel: cult.realmLevel, message: 'No breakthrough required at this realm' };
  }

  // Check max level (9 Chuyển)
  if (cult.realmLevel >= 9) {
    return { success: false, fromLevel: 9, toLevel: 9, message: 'Already at max realm (9 Chuyển)' };
  }

  // Check gold
  const player = await playerRepository.findById(playerId);
  if (!player) {
    return { success: false, fromLevel: cult.realmLevel, toLevel: cult.realmLevel, message: 'Player not found' };
  }
  if (Number(player.gold) < currentRealm.breakthroughGold) {
    return {
      success: false,
      fromLevel: cult.realmLevel,
      toLevel: cult.realmLevel,
      message: `Need ${currentRealm.breakthroughGold} gold for breakthrough`,
    };
  }

  // Deduct gold (gold is integer)
  await playerRepository.update(playerId, {
    gold: Number(player.gold) - currentRealm.breakthroughGold,
  });

  // Advance to next realm
  const newLevel = cult.realmLevel + 1;
  await cultivationRepo.updateRealm(playerId, newLevel);
  await cultivationRepo.incrementBreakthroughCount(playerId);

  return {
    success: true,
    fromLevel: cult.realmLevel,
    toLevel: newLevel,
    message: `Đột phá thành công! Đạt ${newLevel} Chuyển`,
  };
}
