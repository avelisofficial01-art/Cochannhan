import { npcRepository } from './npc.repository.js';
import type { NpcInfo, DialogueNode, DialogueChoice } from '@co-dao/shared';
import type { CreateNpcInput, CreateDialogueInput } from './npc.schema.js';

interface NpcRow {
  id: string;
  name: string;
  sprite: string;
  faction: string;
  occupation: string;
  map_id: string;
  x: number;
  y: number;
  affection_min: number;
  affection_max: number;
  has_shop: string;
  schedule: string | null;
}

function mapNpc(row: NpcRow): NpcInfo {
  return {
    id: row.id,
    name: row.name,
    sprite: row.sprite,
    faction: row.faction,
    occupation: row.occupation,
    mapId: row.map_id,
    x: row.x,
    y: row.y,
    affectionMin: row.affection_min,
    affectionMax: row.affection_max,
    hasShop: row.has_shop,
    schedule: row.schedule,
  };
}

function mapDialogue(row: Record<string, unknown>): DialogueNode {
  let choices: DialogueChoice[] | null = null;
  if (row.choices && typeof row.choices === 'string') {
    try {
      choices = JSON.parse(row.choices as string);
    } catch {
      choices = null;
    }
  }
  return {
    id: row.id as string,
    npcId: row.npc_id as string,
    orderIndex: row.order_index as number,
    text: row.text as string,
    speaker: row.speaker as string,
    choices,
    conditionFlag: (row.condition_flag as string) || null,
    conditionAffectionMin: (row.condition_affection_min as number) ?? null,
    setFlag: (row.set_flag as string) || null,
    nextDialogueId: (row.next_dialogue_id as string) || null,
  };
}

export const npcService = {
  async getAllNpcs(): Promise<NpcInfo[]> {
    const rows = await npcRepository.findAll();
    return rows.map(mapNpc);
  },

  async getNpcsByMap(mapId: string): Promise<NpcInfo[]> {
    const rows = await npcRepository.findByMap(mapId);
    return rows.map(mapNpc);
  },

  async getNpc(id: string): Promise<NpcInfo | null> {
    const row = await npcRepository.findById(id);
    return row ? mapNpc(row) : null;
  },

  async createNpc(input: CreateNpcInput): Promise<NpcInfo> {
    const row = await npcRepository.create(input);
    return mapNpc(row);
  },

  // Dialogues
  async getNpcDialogues(npcId: string): Promise<DialogueNode[]> {
    const rows = await npcRepository.findDialogues(npcId);
    return rows.map(mapDialogue);
  },

  async getDialogue(id: string): Promise<DialogueNode | null> {
    const row = await npcRepository.findDialogueById(id);
    return row ? mapDialogue(row) : null;
  },

  async createDialogue(input: CreateDialogueInput): Promise<DialogueNode> {
    const row = await npcRepository.createDialogue(input);
    return mapDialogue(row);
  },
};
