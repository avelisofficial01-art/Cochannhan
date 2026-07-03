import { create } from 'zustand';

interface PlayerPosition {
  accountId: string;
  playerId: string;
  name: string;
  mapId: string;
  x: number;
  y: number;
}

export interface MonsterSprite {
  instanceId: string;
  templateId: string;
  name: string;
  currentHp: number;
  maxHp: number;
  x: number;
  y: number;
  sprite: string;
}

export interface CombatResult {
  damage: number;
  isCritical: boolean;
  targetX: number;
  targetY: number;
}

interface GameState {
  currentMapId: string;
  playerX: number;
  playerY: number;
  players: Map<string, PlayerPosition>;
  isConnected: boolean;
  monsters: MonsterSprite[];
  combatResult: CombatResult | null;

  setPosition: (x: number, y: number) => void;
  setMap: (mapId: string) => void;
  updatePlayer: (pos: PlayerPosition) => void;
  setPlayers: (players: PlayerPosition[]) => void;
  setConnected: (connected: boolean) => void;
  setMonsters: (monsters: MonsterSprite[]) => void;
  setCombatResult: (result: CombatResult | null) => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentMapId: 'bac_nguyen_village',
  playerX: 0,
  playerY: 0,
  players: new Map(),
  isConnected: false,
  monsters: [],
  combatResult: null,

  setPosition: (x, y): void => set({ playerX: x, playerY: y }),
  setMap: (mapId): void => set({ currentMapId: mapId }),
  updatePlayer: (pos): void =>
    set((state) => {
      const next = new Map(state.players);
      next.set(pos.accountId, pos);
      return { players: next };
    }),
  setPlayers: (playerList): { players: Map<string, PlayerPosition> } => {
    const next = new Map<string, PlayerPosition>();
    for (const p of playerList) {
      next.set(p.accountId, p);
    }
    return { players: next };
  },
  setConnected: (connected): void => set({ isConnected: connected }),
  setMonsters: (monsters): void => set({ monsters }),
  setCombatResult: (result): void => set({ combatResult: result }),
}));
