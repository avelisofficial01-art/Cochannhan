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

export interface PlayerGuState {
  id: string;
  guTemplateId: string;
  name: string;
  element: string;
  rank: number;
  level: number;
  enhancement: number;
  mastery: number;
  bondLevel: number;
  isEquipped: boolean;
  slotIndex: number | null;
  sprite: string | null;
}

interface GameState {
  currentMapId: string;
  playerX: number;
  playerY: number;
  players: Map<string, PlayerPosition>;
  isConnected: boolean;
  monsters: MonsterSprite[];
  combatResult: CombatResult | null;
  playerGuList: PlayerGuState[];
  guSynergies: string[];
  isGuPanelOpen: boolean;

  setPosition: (x: number, y: number) => void;
  setMap: (mapId: string) => void;
  updatePlayer: (pos: PlayerPosition) => void;
  setPlayers: (players: PlayerPosition[]) => void;
  setConnected: (connected: boolean) => void;
  setMonsters: (monsters: MonsterSprite[]) => void;
  setCombatResult: (result: CombatResult | null) => void;
  setPlayerGuList: (guList: PlayerGuState[]) => void;
  setGuSynergies: (synergies: string[]) => void;
  toggleGuPanel: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentMapId: 'bac_nguyen_village',
  playerX: 0,
  playerY: 0,
  players: new Map(),
  isConnected: false,
  monsters: [],
  combatResult: null,
  playerGuList: [],
  guSynergies: [],
  isGuPanelOpen: false,

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
  setPlayerGuList: (guList): void => set({ playerGuList: guList }),
  setGuSynergies: (synergies): void => set({ guSynergies: synergies }),
  toggleGuPanel: (): void => set((state) => ({ isGuPanelOpen: !state.isGuPanelOpen })),
}));
