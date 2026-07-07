import { db } from '../database/connection.js';
import { playerQuests, quests, storyFlags } from '../database/schema/index.js';
import { eq, and } from 'drizzle-orm';
import type { CreateQuestInput } from './quest.schema.js';

type QuestSelect = typeof quests.$inferSelect;
type PlayerQuestSelect = typeof playerQuests.$inferSelect;

function toLegacyQuest(row: QuestSelect) {
  return {
    id: row.id,
    name: row.title,
    type: row.type,
    description: row.description,
    npc_giver_id: null,
    prerequisites: null,
    objectives: JSON.stringify(row.objectives ?? []),
    rewards: JSON.stringify(row.rewards ?? null),
    flag_required: row.flag_required,
    flag_complete: null,
    is_repeatable: row.is_repeatable ? 'true' : 'false',
    min_realm: row.min_realm,
  };
}

function toLegacyPlayerQuest(row: PlayerQuestSelect) {
  return {
    id: row.id,
    player_id: row.player_id,
    quest_id: row.quest_id,
    status: row.status,
    objectives_progress: JSON.stringify(row.progress ?? []),
    accepted_at: row.accepted_at,
    completed_at: row.completed_at,
  };
}

function buildInitialProgress(objectives: unknown): unknown[] {
  if (!Array.isArray(objectives)) return [];

  return objectives.map((objective, index) => {
    const record = objective as { count?: number; target?: number };
    return {
      index,
      current: 0,
      target: record.count ?? record.target ?? 1,
    };
  });
}

export const questRepository = {
  async findAll() {
    const rows = await db.select().from(quests);
    return rows.map(toLegacyQuest);
  },

  async findById(id: string) {
    const rows = await db.select().from(quests).where(eq(quests.id, id)).limit(1);
    return rows[0] ? toLegacyQuest(rows[0]) : null;
  },

  async create(input: CreateQuestInput) {
    const rows = await db
      .insert(quests)
      .values({
        title: input.name,
        type: input.type,
        description: input.description,
        objectives: input.objectives,
        rewards: input.rewards ?? {},
        flag_required: input.flagRequired ?? null,
        is_repeatable: input.isRepeatable === 'true',
        min_realm: input.minRealm,
      })
      .returning();
    return toLegacyQuest(rows[0]);
  },

  async findPlayerQuests(playerId: string) {
    const rows = await db.select().from(playerQuests).where(eq(playerQuests.player_id, playerId));
    return rows.map(toLegacyPlayerQuest);
  },

  async findPlayerQuest(playerId: string, questId: string) {
    const rows = await db
      .select()
      .from(playerQuests)
      .where(and(eq(playerQuests.player_id, playerId), eq(playerQuests.quest_id, questId)))
      .limit(1);
    return rows[0] ? toLegacyPlayerQuest(rows[0]) : null;
  },

  async acceptQuest(playerId: string, questId: string) {
    const [quest] = await db.select().from(quests).where(eq(quests.id, questId)).limit(1);
    const progress = buildInitialProgress(quest?.objectives);

    const rows = await db
      .insert(playerQuests)
      .values({
        player_id: playerId,
        quest_id: questId,
        status: 'active',
        progress,
      })
      .returning();
    return toLegacyPlayerQuest(rows[0]);
  },

  async updateQuestProgress(id: string, progress: string) {
    const rows = await db
      .update(playerQuests)
      .set({ progress: JSON.parse(progress) as unknown })
      .where(eq(playerQuests.id, id))
      .returning();
    return rows[0] ? toLegacyPlayerQuest(rows[0]) : null;
  },

  async completeQuest(id: string) {
    const rows = await db
      .update(playerQuests)
      .set({ status: 'completed', completed_at: new Date() })
      .where(eq(playerQuests.id, id))
      .returning();
    return rows[0] ? toLegacyPlayerQuest(rows[0]) : null;
  },

  async getStoryFlags(playerId: string) {
    return db.select().from(storyFlags).where(eq(storyFlags.player_id, playerId));
  },

  async getStoryFlag(playerId: string, key: string) {
    const rows = await db
      .select()
      .from(storyFlags)
      .where(and(eq(storyFlags.player_id, playerId), eq(storyFlags.flag_key, key)))
      .limit(1);
    return rows[0] ?? null;
  },

  async setStoryFlag(playerId: string, key: string, value = 'true') {
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
