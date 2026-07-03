// Boss AI — Phase-based combat behavior (Sprint 6)

export interface BossPhase {
  name: string;
  hpThreshold: number; // % HP to activate this phase
  atkMultiplier: number;
  defMultiplier: number;
  speedMultiplier: number;
}

export interface BossConfig {
  bossId: string;
  name: string;
  storyFlagRequired?: string; // story flag to allow spawning
  storyFlagOnDefeat: string; // story flag set when defeated
  phases: BossPhase[];
}

// ─── Boss Configs ────────────────────────────────────────────

export const bossConfigs: Record<string, BossConfig> = {
  boss_wolf_king: {
    bossId: 'boss_wolf_king',
    name: 'Bạch Lang Vương',
    storyFlagRequired: 'boss_wolf_king_unlocked',
    storyFlagOnDefeat: 'boss_wolf_king_defeated',
    phases: [
      { name: 'Phase 1 — Hung Hãn', hpThreshold: 70, atkMultiplier: 1.0, defMultiplier: 1.0, speedMultiplier: 1.0 },
      { name: 'Phase 2 — Điên Cuồng', hpThreshold: 40, atkMultiplier: 1.3, defMultiplier: 0.9, speedMultiplier: 1.2 },
      { name: 'Phase 3 — Tử Chiến', hpThreshold: 0, atkMultiplier: 1.6, defMultiplier: 0.7, speedMultiplier: 1.5 },
    ],
  },
};

// ─── Boss Phase Logic ────────────────────────────────────────

export interface BossInstanceState {
  bossConfig: BossConfig;
  currentPhaseIndex: number;
  currentPhase: BossPhase;
  phaseChanged: boolean; // true when phase just transitioned (for notifications)
}

export function initBossState(bossId: string, maxHp: number): BossInstanceState | null {
  const config = bossConfigs[bossId];
  if (!config) return null;

  const phase = getPhaseForHp(config, maxHp, maxHp);
  return {
    bossConfig: config,
    currentPhaseIndex: config.phases.indexOf(phase),
    currentPhase: phase,
    phaseChanged: false,
  };
}

function getPhaseForHp(config: BossConfig, currentHp: number, maxHp: number): BossPhase {
  const hpPercent = (currentHp / maxHp) * 100;
  // Phases sorted by hpThreshold descending
  const sorted = [...config.phases].sort((a, b) => b.hpThreshold - a.hpThreshold);
  for (const phase of sorted) {
    if (hpPercent >= phase.hpThreshold) return phase;
  }
  return sorted[0]; // lowest threshold phase (Phase 3)
}

export function checkBossPhase(state: BossInstanceState, currentHp: number, maxHp: number): boolean {
  const newPhase = getPhaseForHp(state.bossConfig, currentHp, maxHp);
  if (newPhase !== state.currentPhase) {
    state.currentPhase = newPhase;
    state.currentPhaseIndex = state.bossConfig.phases.indexOf(newPhase);
    state.phaseChanged = true;
    return true;
  }
  state.phaseChanged = false;
  return false;
}

export function getBossAtkMultiplier(state: BossInstanceState): number {
  return state.currentPhase.atkMultiplier;
}

export function getBossDefMultiplier(state: BossInstanceState): number {
  return state.currentPhase.defMultiplier;
}

// ─── Boss Spawn Check ────────────────────────────────────────

export function getBossConfig(bossName: string): BossConfig | undefined {
  return Object.values(bossConfigs).find((c) => c.name === bossName);
}

export function getBossStoryFlagOnDefeat(bossName: string): string | undefined {
  return getBossConfig(bossName)?.storyFlagOnDefeat;
}
