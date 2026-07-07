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
  guHp?: number;
  guAtk?: number;
  guDef?: number;
  guCrit?: number;
  guMoveSpeed?: number;
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

  // Attack/Defense derived from realm
  const baseAtk = Math.round(input.realm * 10 * realmMult);
  const baseDef = Math.round(input.realm * 5 * realmMult);

  // Final stats = Base + Permanent bonuses + Gu bonuses
  return {
    hp: baseHp + input.hpBonus + (input.guHp ?? 0),
    mana: baseMana,
    atk: baseAtk + input.atkBonus + (input.guAtk ?? 0),
    def: baseDef + input.defBonus + (input.guDef ?? 0),
    crit: 5 + input.critBonus + (input.guCrit ?? 0), // base 5% crit chance
    critDamage: 150, // base 150% crit damage (from config)
    moveSpeed: input.moveSpeed + (input.guMoveSpeed ?? 0),
    realm: input.realm,
    daoId: input.daoId,
  };
}
