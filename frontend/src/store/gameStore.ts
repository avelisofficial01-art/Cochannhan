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
  damageType?: string;
  targetDefeated?: boolean;
  drops?: Array<{ itemName: string; quantity: number }>;
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
  skills?: Array<{
    skillId: string;
    name: string;
    type: string;
    description: string;
    cooldown: number;
    damageMultiplier: number;
  }>;
}

export interface ProfileState {
  id: string;
  name: string;
  realm: number;
  daoId: string | null;
  gold?: number;
  spiritStone?: number;
  exp?: number;
}

export interface StatsState {
  hp: number;
  mana: number;
  atk: number;
  def: number;
  crit: number;
  critDamage: number;
  moveSpeed: number;
  realm: number;
  daoId: string | null;
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
  isEquipmentPanelOpen: boolean;
  isCharacterPanelOpen: boolean;
  isCraftPanelOpen: boolean;
  equipmentList: Array<{ id: string; name: string; type: string; slot: string; tier: string; baseHp: number; baseAtk: number; baseDef: number; baseCrit: number; requiredLevel: number; description: string; icon: string }>;
  equippedItems: Record<string, string | null>;
  recipeList: Array<{ id: string; name: string; resultType: string; resultName: string; requiredGold: number; successRate: number; materials: Array<{ itemName: string; quantity: number }> }>;
  
  // NPC Dialogue & Quests
  activeNpc: { id: string; name: string; sprite: string; hasShop: boolean } | null;
  activeDialogue: { id: string; text: string; speaker: string; choices: Array<{ text: string; next_dialogue_ref: string; next_dialogue_id?: string }> | null; set_flag?: string } | null;
  isDialogueOpen: boolean;
  activeQuests: unknown[];
  inventorySlots: Array<{ id: string; itemId: string; itemName: string; quantity: number; slot: number; itemType: string }>;
  profile: ProfileState | null;
  stats: StatsState | null;
  isShopOpen: boolean;
  activeShopNpc: { id: string; name: string } | null;
  toggleShop: (open: boolean, npc?: { id: string; name: string }) => void;
  characterPanelTab: 'stats' | 'gu' | 'equip' | 'quest' | 'inventory';

  setEquipmentList: (list: GameState['equipmentList']) => void;
  setEquippedItems: (items: Record<string, string | null>) => void;
  setRecipeList: (list: GameState['recipeList']) => void;
  toggleEquipmentPanel: () => void;
  toggleCharacterPanel: () => void;
  toggleCraftPanel: () => void;

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

  // NPC Dialogue actions
  openDialogue: (npc: { id: string; name: string; sprite: string; hasShop: boolean }) => void;
  closeDialogue: () => void;
  setActiveDialogue: (dialogue: { id: string; text: string; speaker: string; choices: Array<{ text: string; next_dialogue_ref: string; next_dialogue_id?: string }> | null; set_flag?: string }) => void;
  setActiveQuests: (quests: unknown[]) => void;
  setProfile: (profile: ProfileState | null) => void;
  setStats: (stats: StatsState | null) => void;
  setInventorySlots: (slots: Array<{ id: string; itemId: string; itemName: string; quantity: number; slot: number; itemType: string }>) => void;
  setCharacterPanelTab: (tab: 'stats' | 'gu' | 'equip' | 'quest' | 'inventory') => void;
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
  isEquipmentPanelOpen: false,
  isCharacterPanelOpen: false,
  isCraftPanelOpen: false,
  equipmentList: [],
  equippedItems: {},
  recipeList: [],

  activeNpc: null,
  activeDialogue: null,
  isDialogueOpen: false,
  activeQuests: [],
  inventorySlots: [],
  profile: null,
  stats: null,
  isShopOpen: false,
  activeShopNpc: null,
  characterPanelTab: 'stats',

  setPosition: (x, y): void => set({ playerX: x, playerY: y }),
  setMap: (mapId): void => set({ currentMapId: mapId }),
  updatePlayer: (pos): void =>
    set((state) => {
      const next = new Map(state.players);
      next.set(pos.accountId, pos);
      return { players: next };
    }),
  setPlayers: (playerList): void => {
    const next = new Map<string, PlayerPosition>();
    for (const p of playerList) {
      next.set(p.accountId, p);
    }
    set({ players: next });
  },
  setConnected: (connected): void => set({ isConnected: connected }),
  setMonsters: (monsters): void => set({ monsters }),
  setCombatResult: (result): void => set({ combatResult: result }),
  setPlayerGuList: (guList): void => set({ playerGuList: guList }),
  setGuSynergies: (synergies): void => set({ guSynergies: synergies }),
  toggleGuPanel: (): void => set((state) => ({ isGuPanelOpen: !state.isGuPanelOpen })),
  setEquipmentList: (list): void => set({ equipmentList: list }),
  setEquippedItems: (items): void => set({ equippedItems: items }),
  setRecipeList: (list): void => set({ recipeList: list }),
  toggleEquipmentPanel: (): void => set((state) => ({ isEquipmentPanelOpen: !state.isEquipmentPanelOpen })),
  toggleCharacterPanel: (): void => set((state) => ({ isCharacterPanelOpen: !state.isCharacterPanelOpen })),
  toggleCraftPanel: (): void => set((state) => ({ isCraftPanelOpen: !state.isCraftPanelOpen })),

  openDialogue: (npc): void => set({ activeNpc: npc, isDialogueOpen: true, activeDialogue: null }),
  closeDialogue: (): void => set({ activeNpc: null, isDialogueOpen: false, activeDialogue: null }),
  setActiveDialogue: (dialogue): void => set({ activeDialogue: dialogue }),
  setActiveQuests: (quests): void => set({ activeQuests: quests }),
  setInventorySlots: (slots): void => set({ inventorySlots: slots }),
  setProfile: (profile): void => set({ profile }),
  setStats: (stats): void => set({ stats }),
  setCharacterPanelTab: (tab): void => set({ characterPanelTab: tab }),
  toggleShop: (open, npc): void => set({ isShopOpen: open, activeShopNpc: npc || null }),
}));
