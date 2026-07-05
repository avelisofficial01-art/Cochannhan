import { db } from '../database/connection.js';
import {
  npcTemplates,
  npcDialogues,
} from '../database/schema/index.js';
import { eq, and, asc } from 'drizzle-orm';
import type { CreateNpcInput, CreateDialogueInput } from './npc.schema.js';

export const npcRepository = {
  async findAll() {
    return db.select().from(npcTemplates);
  },

  async findByMap(mapId: string) {
    return db.select().from(npcTemplates).where(eq(npcTemplates.map_id, mapId));
  },

  async findById(id: string) {
    const rows = await db
      .select()
      .from(npcTemplates)
      .where(eq(npcTemplates.id, id))
      .limit(1);
    return rows[0] ?? null;
  },

  async create(input: CreateNpcInput) {
    const rows = await db.insert(npcTemplates).values({
      name: input.name,
      sprite: input.sprite,
      faction: input.faction,
      occupation: input.occupation,
      map_id: input.mapId,
      x: input.x,
      y: input.y,
      affection_min: input.affectionMin,
      affection_max: input.affectionMax,
      has_shop: input.hasShop,
      schedule: input.schedule ?? null,
    }).returning();
    return rows[0];
  },

  // Dialogues
  async findDialogues(npcId: string) {
    return db
      .select()
      .from(npcDialogues)
      .where(eq(npcDialogues.npc_id, npcId))
      .orderBy(asc(npcDialogues.order_index));
  },

  async findDialogueById(id: string) {
    const rows = await db
      .select()
      .from(npcDialogues)
      .where(eq(npcDialogues.id, id))
      .limit(1);
    return rows[0] ?? null;
  },

  async findDialogueByCondition(
    npcId: string,
    _flags: string[],
  ) {
    return db
      .select()
      .from(npcDialogues)
      .where(
        and(
          eq(npcDialogues.npc_id, npcId),
          eq(npcDialogues.condition_flag, ''),
        ),
      )
      .orderBy(asc(npcDialogues.order_index));
  },

  async createDialogue(input: CreateDialogueInput) {
    const rows = await db.insert(npcDialogues).values({
      npc_id: input.npcId,
      order_index: input.orderIndex,
      text: input.text,
      speaker: input.speaker,
      choices: input.choices ? JSON.stringify(input.choices) : null,
      condition_flag: input.conditionFlag ?? null,
      condition_affection_min: input.conditionAffectionMin ?? null,
      set_flag: input.setFlag ?? null,
      next_dialogue_id: input.nextDialogueId ?? null,
    }).returning();
    return rows[0];
  },
};
