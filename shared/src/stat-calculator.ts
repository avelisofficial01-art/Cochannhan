/**
 * Stat Calculator Engine
 * Tính chỉ số cuối cùng từ: Base + Realm bonus + Permanent bonuses
 *
 * Sprint 1: chỉ tính Base + Permanent bonuses (chưa có Equipment, Gu, Buff)
 * Các sprint sau sẽ mở rộng thêm Equipment + Gu + Passive + Buff + Story Bonus
 */

import type { PlayerStatsResponse } from '@co-dao/shared';

export interface StatInput {
  realm: number;
  baseHp: number;
  baseMana: number;
  hpBonus: number;
  atkBonus: number;
  defBonus: number;
  critBonus: number;
  moveSpeed: number;
  daoId: string | null;
}

// Realm multiplier: mỗi Chuyển tăng 20% chỉ số nền
function getRealmMultiplier(realm: number): number {
  return 1 + (realm - 1) * 0.2;
}

export function calculatePlayerStats(input: StatInput): PlayerStatsResponse {
  const realmMult = getRealmMultiplier(input.realm);

  // Base stats from player table, scaled by realm
  const baseHp = Math.round(input.baseHp * realmMult);
  const baseMana = Math.round(input.baseMana * realmMult);

  // Attack/Defense derived from realm (formula will be refined in later sprints)
  const baseAtk = Math.round(input.realm * 10 * realmMult);
  const baseDef = Math.round(input.realm * 5 * realmMult);

  // Final stats = Base + Permanent bonuses
  return {
    hp: baseHp + input.hpBonus,
    mana: baseMana,
    atk: baseAtk + input.atkBonus,
    def: baseDef + input.defBonus,
    crit: 5 + input.critBonus, // base 5% crit chance
    critDamage: 150, // base 150% crit damage (from config)
    moveSpeed: input.moveSpeed,
    realm: input.realm,
    daoId: input.daoId,
  };
}
