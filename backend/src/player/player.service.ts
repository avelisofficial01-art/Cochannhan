import { playerRepository } from './player.repository.js';
import type { PlayerRow } from './player.repository.js';
import type { CreatePlayerInput } from './player.schema.js';
import type { PlayerProfile, PlayerStatsResponse } from '@co-dao/shared';
import { ERROR_CODES } from '@co-dao/shared';
import { calculatePlayerStats } from '@co-dao/shared';

function toProfile(row: {
  id: string;
  name: string;
  realm: number;
  dao_id: string | null;
}): PlayerProfile {
  return {
    id: row.id,
    name: row.name,
    realm: row.realm,
    daoId: row.dao_id,
  };
}

export async function getProfile(accountId: string): Promise<PlayerProfile | null> {
  const player = await playerRepository.findByAccountId(accountId);
  if (!player) return null;
  return toProfile(player);
}

export async function getStats(accountId: string): Promise<PlayerStatsResponse | null> {
  const player = await playerRepository.findByAccountId(accountId);
  if (!player) return null;

  const stats = await playerRepository.findStatsByPlayerId(player.id);

  return calculatePlayerStats({
    realm: player.realm,
    baseHp: player.hp,
    baseMana: player.mana,
    hpBonus: stats?.hp_bonus ?? 0,
    atkBonus: stats?.atk_bonus ?? 0,
    defBonus: stats?.def_bonus ?? 0,
    critBonus: stats?.crit_bonus ?? 0,
    moveSpeed: stats?.move_speed ?? 300,
    daoId: player.dao_id,
  });
}

export async function createPlayer(
  accountId: string,
  input: CreatePlayerInput,
): Promise<PlayerProfile> {
  const existing = await playerRepository.findByAccountId(accountId);
  if (existing) {
    return toProfile(existing);
  }

  const player = await playerRepository.create({
    account_id: accountId,
    name: input.name,
    realm: 1,
    hp: 100,
    mana: 50,
    gold: 0,
    spirit_stone: 0,
    current_map: 'bac_nguyen_village',
    current_x: 0,
    current_y: 0,
  });

  await playerRepository.createStats({
    player_id: player.id,
    hp_bonus: 0,
    atk_bonus: 0,
    def_bonus: 0,
    crit_bonus: 0,
    move_speed: 300,
  });

  return toProfile(player);
}

export async function getPlayerById(playerId: string): Promise<PlayerRow | null> {
  const player = await playerRepository.findById(playerId);
  return player ?? null;
}

export async function getPlayerStats(
  playerId: string,
): Promise<{ hpBonus: number; atkBonus: number; defBonus: number; critBonus: number; moveSpeed: number } | null> {
  const stats = await playerRepository.findStatsByPlayerId(playerId);
  if (!stats) return null;
  return {
    hpBonus: stats.hp_bonus,
    atkBonus: stats.atk_bonus,
    defBonus: stats.def_bonus,
    critBonus: stats.crit_bonus,
    moveSpeed: stats.move_speed,
  };
}

export const playerService = {
  getProfile,
  getStats,
  createPlayer,
  getPlayerById,
  getPlayerStats,
};

export { ERROR_CODES };
