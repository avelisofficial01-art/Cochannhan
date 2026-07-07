import { playerRepository } from './player.repository.js';
import type { PlayerRow } from './player.repository.js';
import type { CreatePlayerInput } from './player.schema.js';
import type { PlayerProfile, PlayerStatsResponse } from '@co-dao/shared';
import { ERROR_CODES } from '@co-dao/shared';
import { calculatePlayerStats } from '@co-dao/shared';
import { getPlayerGuList } from '../gu/gu.service.js';

function toProfile(row: {
  id: string;
  name: string;
  realm: number;
  dao_id: string | null;
  gold?: number;
  spirit_stone?: number;
  exp?: number;
}): PlayerProfile {
  return {
    id: row.id,
    name: row.name,
    realm: row.realm,
    daoId: row.dao_id,
    gold: row.gold ?? 0,
    spiritStone: row.spirit_stone ?? 0,
    exp: row.exp ?? 0,
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

  // Load and sum equipped Gu stats
  let guHp = 0;
  let guAtk = 0;
  let guDef = 0;
  let guCrit = 0;
  let guMoveSpeed = 0;

  try {
    const guList = await getPlayerGuList(player.id);
    const equipped = guList.filter((g) => String(g.isEquipped) === 'true');
    for (const gu of equipped) {
      if (gu.stats) {
        const mult = 1 + (gu.enhancement ?? 0) * 0.1; // +10% per enhancement level
        guHp += Math.round((gu.stats.hp ?? 0) * mult);
        guAtk += Math.round((gu.stats.atk ?? 0) * mult);
        guDef += Math.round((gu.stats.def ?? 0) * mult);
        guCrit += Math.round((gu.stats.crit ?? 0) * mult);
        guMoveSpeed += Math.round((gu.stats.moveSpeed ?? 0) * mult);
      }
    }
  } catch {
    // ignore
  }

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
    guHp,
    guAtk,
    guDef,
    guCrit,
    guMoveSpeed,
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
