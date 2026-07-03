import { db } from '../database/connection.js';
import {
  questTemplates,
  playerQuests,
  storyFlags,
} from '../database/schema/index.js';
import { eq, and } from 'drizzle-orm';
import type { CreateQuestInput } from './quest.schema.js';

export const questRepository = {
  async findAll() {
    return db.select().from(questTemplates);
  },

  async findById(id: string) {
    const rows = await db
      .select()
      .from(questTemplates)
      .where(eq(questTemplates.id, id))
      .limit(1);
    return rows[0] ?? null;
  },

  async create(input: CreateQuestInput) {
    const rows = await db.insert(questTemplates).values({
      name: input.name,
      type: input.type,
      description: input.description,
      npc_giver_id: input.npcGiverId ?? null,
      prerequisites: input.prerequisites ?? null,
      objectives: input.objectives,
      rewards: input.rewards ?? null,
      flag_required: input.flagRequired ?? null,
      flag_complete: input.flagComplete ?? null,
      is_repeatable: input.isRepeatable,
      min_realm: input.minRealm,
    }).returning();
    return rows[0];
  },

  // Player Quests
  async findPlayerQuests(playerId: string) {
    return db
      .select()
      .from(playerQuests)
      .where(eq(playerQuests.player_id, playerId));
  },

  async findPlayerQuest(playerId: string, questId: string) {
    const rows = await db
      .select()
      .from(playerQuests)
      .where(
        and(
          eq(playerQuests.player_id, playerId),
          eq(playerQuests.quest_id, questId),
        ),
      )
      .limit(1);
    return rows[0] ?? null;
  },

  async acceptQuest(playerId: string, questId: string) {
    const rows = await db
      .insert(playerQuests)
      .values({
        player_id: playerId,
        quest_id: questId,
        status: 'active',
        objectives_progress: '[]',
      })
      .returning();
    return rows[0];
  },

  async updateQuestProgress(id: string, progress: string) {
    const rows = await db
      .update(playerQuests)
      .set({
        objectives_progress: progress,
        updated_at: new Date(),
      })
      .where(eq(playerQuests.id, id))
      .returning();
    return rows[0];
  },

  async completeQuest(id: string) {
    const rows = await db
      .update(playerQuests)
      .set({
        status: 'completed',
        completed_at: new Date(),
        updated_at: new Date(),
      })
      .where(eq(playerQuests.id, id))
      .returning();
    return rows[0];
  },

  // Story Flags
  async getStoryFlags(playerId: string) {
    return db
      .select()
      .from(storyFlags)
      .where(eq(storyFlags.player_id, playerId));
  },

  async getStoryFlag(playerId: string, key: string) {
    const rows = await db
      .select()
      .from(storyFlags)
      .where(
        and(
          eq(storyFlags.player_id, playerId),
          eq(storyFlags.flag_key, key),
        ),
      )
      .limit(1);
    return rows[0] ?? null;
  },

  async setStoryFlag(playerId: string, key: string, value: string = 'true') {
    const existing = await this.getStoryFlag(playerId, key);
    if (existing) {
      const rows = await db
        .update(storyFlags)
        .set({ flag_value: value, set_at: new Date() })
        .where(eq(storyFlags.id, existing.id))
        .returning();
      return rows[0];
    }
    const rows = await db
      .insert(storyFlags)
      .values({ player_id: playerId, flag_key: key, flag_value: value })
      .returning();
    return rows[0];
  },
};
