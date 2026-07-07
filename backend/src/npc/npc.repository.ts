import { db } from '../database/connection.js';
import { dialogues, npcs } from '../database/schema/index.js';
import { eq } from 'drizzle-orm';
import type { CreateNpcInput, CreateDialogueInput } from './npc.schema.js';

type NpcSelect = typeof npcs.$inferSelect;
type DialogueSelect = typeof dialogues.$inferSelect;

function mapNpcRow(row: NpcSelect) {
  return {
    id: row.id,
    name: row.name,
    sprite: row.sprite ?? 'npc_1',
    faction: row.role,
    occupation: row.role,
    map_id: row.map_id,
    x: row.x,
    y: row.y,
    affection_min: 0,
    affection_max: 100,
    has_shop: row.shop_id ? 'true' : 'false',
    schedule: null,
  };
}

function mapDialogueRow(row: DialogueSelect, npcId = '') {
  return {
    id: row.id,
    npc_id: npcId,
    order_index: 0,
    text: row.text,
    speaker: row.speaker,
    choices: JSON.stringify(row.choices ?? []),
    condition_flag: null,
    condition_affection_min: null,
    set_flag: row.flag_key,
    next_dialogue_id: row.next_dialogue_id,
  };
}

export const npcRepository = {
  async findAll() {
    const rows = await db.select().from(npcs);
    return rows.map(mapNpcRow);
  },

  async findByMap(mapId: string) {
    const rows = await db.select().from(npcs).where(eq(npcs.map_id, mapId));
    return rows.map(mapNpcRow);
  },

  async findById(id: string) {
    const rows = await db.select().from(npcs).where(eq(npcs.id, id)).limit(1);
    return rows[0] ? mapNpcRow(rows[0]) : null;
  },

  async create(input: CreateNpcInput) {
    const rows = await db
      .insert(npcs)
      .values({
        name: input.name,
        sprite: input.sprite,
        role: input.occupation ?? input.faction,
        map_id: input.mapId,
        x: input.x,
        y: input.y,
      })
      .returning();
    return mapNpcRow(rows[0]);
  },

  async findDialogues(npcId: string) {
    const npcRows = await db.select().from(npcs).where(eq(npcs.id, npcId)).limit(1);
    const dialogueId = npcRows[0]?.dialogue_id;
    if (!dialogueId) return [];

    const rows = await db.select().from(dialogues).where(eq(dialogues.id, dialogueId));
    return rows.map((row) => mapDialogueRow(row, npcId));
  },

  async findDialogueById(id: string) {
    const rows = await db.select().from(dialogues).where(eq(dialogues.id, id)).limit(1);
    return rows[0] ? mapDialogueRow(rows[0]) : null;
  },

  async findDialogueByCondition(npcId: string, _flags: string[]) {
    return this.findDialogues(npcId);
  },

  async createDialogue(input: CreateDialogueInput) {
    const id = input.nextDialogueId ?? crypto.randomUUID();
    const rows = await db
      .insert(dialogues)
      .values({
        id,
        speaker: input.speaker,
        text: input.text,
        choices: input.choices ?? [],
        flag_key: input.setFlag ?? null,
        next_dialogue_id: input.nextDialogueId ?? null,
      })
      .returning();
    return mapDialogueRow(rows[0], input.npcId);
  },
};
