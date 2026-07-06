import { questRepository } from './quest.repository.js';
import { eventBus } from '../utils/event-bus.js';
import { db } from '../database/connection.js';
import * as schema from '../database/schema/index.js';
import { playerRepository } from '../player/player.repository.js';
import { inventoryService } from '../inventory/inventory.service.js';
import { eq } from 'drizzle-orm';
import type {
  QuestInfo,
  QuestObjective,
  QuestReward,
  QuestPrerequisite,
  PlayerQuest,
  ObjectiveProgress,
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

interface QuestStoryFlag {
  key: string;
  value: string;
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

function mapStoryFlag(row: StoryFlagRow): QuestStoryFlag {
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
      return mapPlayerQuest(existing as unknown as PlayerQuestRow);
    }
    const row = await questRepository.acceptQuest(playerId, questId);
    const result = mapPlayerQuest(row as unknown as PlayerQuestRow);
    void questService.emitQuestUpdate(playerId);
    return result;
  },

  async getPlayerQuests(playerId: string): Promise<PlayerQuest[]> {
    console.log(`[QuestService] getPlayerQuests for playerId: ${playerId}`);
    const rows = await questRepository.findPlayerQuests(playerId);
    console.log(`[QuestService] Found existing quests: ${rows.length}`);
    if (rows.length === 0) {
      console.log(`[QuestService] No quests found for player. Querying 'Tỉnh Giấc Mộng' template...`);
      const [awakenQuest] = await db
        .select()
        .from(schema.questTemplates)
        .where(eq(schema.questTemplates.name, 'Tỉnh Giấc Mộng'))
        .limit(1);
      if (awakenQuest) {
        console.log(`[QuestService] Found template 'Tỉnh Giấc Mộng' with ID: ${awakenQuest.id}. Auto-accepting...`);
        const newPq = await questRepository.acceptQuest(playerId, awakenQuest.id);
        if (newPq) {
          console.log(`[QuestService] Auto-accepted 'Tỉnh Giấc Mộng' successfully. PlayerQuest ID: ${newPq.id}`);
          return [mapPlayerQuest(newPq as unknown as PlayerQuestRow)];
        } else {
          console.error(`[QuestService] Failed to auto-accept 'Tỉnh Giấc Mộng' (acceptQuest returned null)`);
        }
      } else {
        console.error(`[QuestService] Quest template 'Tỉnh Giấc Mộng' NOT found in questTemplates table!`);
      }
    }
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

    const result = mapPlayerQuest(row as unknown as PlayerQuestRow);
    void questService.emitQuestUpdate(playerId);
    return result;
  },

  async completeQuest(
    playerId: string,
    questId: string,
  ): Promise<PlayerQuest> {
    const pq = await questRepository.findPlayerQuest(playerId, questId);
    if (!pq || pq.status !== 'active') {
      throw new Error('Quest not active or not found');
    }

    const quest = await questRepository.findById(questId);
    if (!quest) {
      throw new Error('Quest template not found');
    }

    const objectives = parseJson<QuestObjective[]>(quest.objectives) ?? [];
    const progress = parseJson<ObjectiveProgress[]>(pq.objectives_progress) ?? [];

    const allDone = objectives.every(
      (obj, i) => progress[i] && progress[i].current >= obj.count,
    );

    if (!allDone) {
      throw new Error('Quest objectives not completed');
    }

    // Grant rewards
    if (quest.rewards) {
      const rewards = parseJson<QuestReward[]>(quest.rewards) ?? [];
      const player = await playerRepository.findById(playerId);
      if (player) {
        let goldReward = 0;
        let spiritStoneReward = 0;
        let expReward = 0;

        for (const r of rewards) {
          if (r.type === 'gold') {
            goldReward += r.amount;
          } else if (r.type === 'spirit_stone') {
            spiritStoneReward += r.amount;
          } else if (r.type === 'exp') {
            expReward += r.amount;
          } else if (r.type === 'item') {
            const itemRef = (r as { item_ref?: string }).item_ref || r.itemId;
            if (itemRef) {
              const items = await db
                .select()
                .from(schema.itemTemplates)
                .where(eq(schema.itemTemplates.name, itemRef))
                .limit(1);
              if (items.length > 0) {
                try {
                  await inventoryService.addItem(playerId, {
                    itemId: items[0].id,
                    quantity: r.amount,
                  });
                } catch (itemErr) {
                  console.error('[Quest Reward] Failed to add item reward:', itemErr);
                }
              }
            }
          }
        }

        await playerRepository.update(playerId, {
          gold: player.gold + goldReward,
          spirit_stone: player.spirit_stone + spiritStoneReward,
          exp: player.exp + expReward,
        });
      }
    }

    const completed = await questRepository.completeQuest(pq.id);

    // Set story flag if defined
    if (quest.flag_complete) {
      await questRepository.setStoryFlag(playerId, quest.flag_complete);

      // Auto-accept next quests unlocked by this flag
      await questService.autoAcceptQuestsByFlag(playerId, quest.flag_complete);
    }

    const result = mapPlayerQuest(completed as unknown as PlayerQuestRow);
    void questService.emitQuestUpdate(playerId);
    return result;
  },

  async emitQuestUpdate(playerId: string): Promise<void> {
    try {
      const activeQuests = await questService.getPlayerQuests(playerId);
      eventBus.emit('quest:updated', { playerId, activeQuests });
    } catch (err) {
      console.error('[Quest] Failed to emit quest update:', err);
    }
  },

  async handleMonsterKill(playerId: string, monsterName: string): Promise<void> {
    const activeQuests = await questService.getPlayerQuests(playerId);
    for (const pq of activeQuests) {
      if (pq.status !== 'active') continue;
      const quest = await questService.getQuest(pq.questId);
      if (!quest) continue;
      const objectives = quest.objectives;
      for (let i = 0; i < objectives.length; i++) {
        const obj = objectives[i];
        if (obj.type === 'kill' && obj.target === monsterName) {
          const progress = pq.objectivesProgress?.[i] || { current: 0 };
          if (progress.current < obj.count) {
            await questService.updateQuestProgress(playerId, pq.questId, i, 1);
          }
        }
      }
    }
  },

  // Story Flags
  async getStoryFlags(playerId: string): Promise<QuestStoryFlag[]> {
    const rows = await questRepository.getStoryFlags(playerId);
    return rows.map((r) => mapStoryFlag(r as unknown as StoryFlagRow));
  },

  async setStoryFlag(
    playerId: string,
    key: string,
    value?: string,
  ): Promise<QuestStoryFlag> {
    const row = await questRepository.setStoryFlag(playerId, key, value);

    // --- Auto-advance talk objectives when flag is set ---
    try {
      const activeQuests = await questService.getPlayerQuests(playerId);
      for (const pq of activeQuests) {
        if (pq.status !== 'active') continue;
        const quest = await questService.getQuest(pq.questId);
        if (!quest) continue;

        const objectives = quest.objectives;
        for (let i = 0; i < objectives.length; i++) {
          const obj = objectives[i];
          if (obj.type === 'talk') {
            const targetName = obj.target;
            let shouldComplete = false;

            if (targetName === 'Trưởng làng' && (key === 'ch1_intro_done' || key === 'ch1_sent_to_elder')) {
              shouldComplete = true;
            } else if (targetName === 'Trưởng lão' && (key === 'ch1_sent_to_blacksmith' || key === 'ch1_sent_to_forest' || key === 'ch1_prophecy_heard')) {
              shouldComplete = true;
            } else if (targetName === 'Thợ rèn' && (key === 'ch1_sent_to_blacksmith' || key === 'ch1_got_weapon')) {
              shouldComplete = true;
            } else if (targetName === 'Bia Đá Cổ' && key === 'ch1_stele_read') {
              shouldComplete = true;
            } else if (targetName === 'Bạch Lang Vương' && key === 'ch1_complete') {
              shouldComplete = true;
            }

            if (shouldComplete) {
              const progress = pq.objectivesProgress?.[i] || { current: 0 };
              if (progress.current < obj.count) {
                await questService.updateQuestProgress(playerId, pq.questId, i, 1);
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('[Quest Story Flag] Failed to auto-advance talk objective:', err);
    }

    return mapStoryFlag(row as unknown as StoryFlagRow);
  },

  async handleReachMap(playerId: string, mapId: string, mapName: string): Promise<void> {
    try {
      const activeQuests = await questService.getPlayerQuests(playerId);
      for (const pq of activeQuests) {
        if (pq.status !== 'active') continue;
        const quest = await questService.getQuest(pq.questId);
        if (!quest) continue;

        const objectives = quest.objectives;
        for (let i = 0; i < objectives.length; i++) {
          const obj = objectives[i];
          if (obj.type === 'reach' && (obj.target === mapId || obj.target === mapName || obj.target === 'dinh_bangphong')) {
            const progress = pq.objectivesProgress?.[i] || { current: 0 };
          if (progress.current < obj.count) {
            await questService.updateQuestProgress(playerId, pq.questId, i, 1);
            }
          }
        }
      }
    } catch (err) {
      console.error('[Quest Reach Map] Failed to auto-advance reach objective:', err);
    }
  },

  async checkStoryFlag(
    playerId: string,
    key: string,
  ): Promise<boolean> {
    const row = await questRepository.getStoryFlag(playerId, key);
    return row !== null && row.flag_value === 'true';
  },

  async autoAcceptQuestsByFlag(playerId: string, flagKey: string): Promise<void> {
    try {
      const quests = await db
        .select()
        .from(schema.questTemplates)
        .where(eq(schema.questTemplates.flag_required, flagKey));

      let acceptedAny = false;
      for (const quest of quests) {
        const existing = await questRepository.findPlayerQuest(playerId, quest.id);
        if (!existing) {
          await questRepository.acceptQuest(playerId, quest.id);
          acceptedAny = true;
        }
      }
      if (acceptedAny) {
        void questService.emitQuestUpdate(playerId);
      }
    } catch (err) {
      console.error('[Quest Auto-Accept] Failed to auto-accept quests by flag:', err);
    }
  },
};
