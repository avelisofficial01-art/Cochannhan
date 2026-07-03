import { questRepository } from './quest.repository.js';
import type {
  QuestInfo,
  QuestObjective,
  QuestReward,
  QuestPrerequisite,
  PlayerQuest,
  ObjectiveProgress,
  StoryFlag,
} from '@co-dao/shared';
import type { CreateQuestInput } from './quest.schema.js';

interface QuestRow {
  id: string;
  name: string;
  type: string;
  description: string;
  npc_giver_id: string | null;
  prerequisites: string | null;
  objectives: string;
  rewards: string | null;
  flag_required: string | null;
  flag_complete: string | null;
  is_repeatable: string;
  min_realm: number;
}

interface PlayerQuestRow {
  id: string;
  player_id: string;
  quest_id: string;
  status: string;
  objectives_progress: string;
  accepted_at: Date;
  completed_at: Date | null;
}

interface StoryFlagRow {
  id: string;
  player_id: string;
  flag_key: string;
  flag_value: string;
  set_at: Date;
}

function parseJson<T>(str: string | null): T | null {
  if (!str) return null;
  try {
    return JSON.parse(str) as T;
  } catch {
    return null;
  }
}

function mapQuest(row: QuestRow): QuestInfo {
  return {
    id: row.id,
    name: row.name,
    type: row.type as QuestInfo['type'],
    description: row.description,
    npcGiverId: row.npc_giver_id,
    prerequisites: parseJson<QuestPrerequisite[]>(row.prerequisites),
    objectives: parseJson<QuestObjective[]>(row.objectives) ?? [],
    rewards: parseJson<QuestReward[]>(row.rewards),
    flagRequired: row.flag_required,
    flagComplete: row.flag_complete,
    isRepeatable: row.is_repeatable,
    minRealm: row.min_realm,
  };
}

function mapPlayerQuest(row: PlayerQuestRow): PlayerQuest {
  return {
    id: row.id,
    playerId: row.player_id,
    questId: row.quest_id,
    status: row.status as PlayerQuest['status'],
    objectivesProgress: parseJson<ObjectiveProgress[]>(row.objectives_progress) ?? [],
    acceptedAt: row.accepted_at.toISOString(),
    completedAt: row.completed_at?.toISOString() ?? null,
  };
}

function mapStoryFlag(row: StoryFlagRow): StoryFlag {
  return { key: row.flag_key, value: row.flag_value };
}

export const questService = {
  async getAllQuests(): Promise<QuestInfo[]> {
    const rows = await questRepository.findAll();
    return rows.map(mapQuest);
  },

  async getQuest(id: string): Promise<QuestInfo | null> {
    const row = await questRepository.findById(id);
    return row ? mapQuest(row as unknown as QuestRow) : null;
  },

  async createQuest(input: CreateQuestInput): Promise<QuestInfo> {
    const row = await questRepository.create(input);
    return mapQuest(row as unknown as QuestRow);
  },

  async acceptQuest(
    playerId: string,
    questId: string,
  ): Promise<PlayerQuest> {
    const existing = await questRepository.findPlayerQuest(playerId, questId);
    if (existing) {
      throw new Error('Quest already accepted');
    }
    const row = await questRepository.acceptQuest(playerId, questId);
    return mapPlayerQuest(row as unknown as PlayerQuestRow);
  },

  async getPlayerQuests(playerId: string): Promise<PlayerQuest[]> {
    const rows = await questRepository.findPlayerQuests(playerId);
    return rows.map((r) => mapPlayerQuest(r as unknown as PlayerQuestRow));
  },

  async updateQuestProgress(
    playerId: string,
    questId: string,
    objectiveIndex: number,
    amount: number,
  ): Promise<PlayerQuest> {
    const pq = await questRepository.findPlayerQuest(playerId, questId);
    if (!pq || pq.status !== 'active') {
      throw new Error('Quest not active');
    }

    const progress = parseJson<ObjectiveProgress[]>(pq.objectives_progress) ?? [];
    if (objectiveIndex >= progress.length) {
      // Initialize progress for this objective
      progress[objectiveIndex] = { index: objectiveIndex, current: 0, target: 1 };
    }
    progress[objectiveIndex].current += amount;

    const row = await questRepository.updateQuestProgress(
      pq.id,
      JSON.stringify(progress),
    );

    // Check if all objectives are complete
    const quest = await questRepository.findById(questId);
    if (quest) {
      const objectives = parseJson<QuestObjective[]>(quest.objectives) ?? [];
      const allDone = objectives.every(
        (obj, i) => progress[i] && progress[i].current >= obj.count,
      );
      if (allDone) {
        const completed = await questRepository.completeQuest(pq.id);
        // Set story flag if defined
        if (quest.flag_complete) {
          await questRepository.setStoryFlag(playerId, quest.flag_complete);
        }
        return mapPlayerQuest(completed as unknown as PlayerQuestRow);
      }
    }

    return mapPlayerQuest(row as unknown as PlayerQuestRow);
  },

  // Story Flags
  async getStoryFlags(playerId: string): Promise<StoryFlag[]> {
    const rows = await questRepository.getStoryFlags(playerId);
    return rows.map((r) => mapStoryFlag(r as unknown as StoryFlagRow));
  },

  async setStoryFlag(
    playerId: string,
    key: string,
    value?: string,
  ): Promise<StoryFlag> {
    const row = await questRepository.setStoryFlag(playerId, key, value);
    return mapStoryFlag(row as unknown as StoryFlagRow);
  },

  async checkStoryFlag(
    playerId: string,
    key: string,
  ): Promise<boolean> {
    const row = await questRepository.getStoryFlag(playerId, key);
    return row !== null && row.flag_value === 'true';
  },
};
