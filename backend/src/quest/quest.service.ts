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
    
    // --- Database Self-Healing / Flag Sync ---
    try {
      const existingQuests = await questRepository.findPlayerQuests(playerId);
      const flags = await questService.getStoryFlags(playerId);
      const flagKeys = new Set(flags.map(f => f.key));

      // 1. If any quest is completed, ensure its flag_complete is set in the storyFlags table
      for (const pq of existingQuests) {
        if (pq.status === 'completed') {
          const quest = await questService.getQuest(pq.quest_id);
          if (quest && quest.flagComplete && !flagKeys.has(quest.flagComplete)) {
            console.log(`[QuestService] Self-healing: Syncing missing complete flag "${quest.flagComplete}" for quest "${quest.name}"`);
            await questRepository.setStoryFlag(playerId, quest.flagComplete, 'true');
            flagKeys.add(quest.flagComplete);
          }
        }
      }

      // 2. Auto-accept any quest whose flag_required is present in player's storyFlags
      const allTemplates = await questService.getAllQuests();
      const existingQuestIds = new Set(existingQuests.map(q => q.quest_id));
      let acceptedAny = false;

      for (const tmpl of allTemplates) {
        if (!existingQuestIds.has(tmpl.id)) {
          if (tmpl.flagRequired && flagKeys.has(tmpl.flagRequired)) {
            console.log(`[QuestService] Self-healing: Auto-accepting quest "${tmpl.name}" because flag "${tmpl.flagRequired}" is active.`);
            await questRepository.acceptQuest(playerId, tmpl.id);
            acceptedAny = true;
          }
        }
      }

      // 3. If the player has absolutely 0 quests, auto-accept the initial "Tỉnh Giấc Mộng" quest
      if (existingQuests.length === 0 && !acceptedAny) {
        const awakenQuest = allTemplates.find(q => q.name === 'Tỉnh Giấc Mộng');
        if (awakenQuest) {
          console.log(`[QuestService] Self-healing: Auto-accepting initial quest "Tỉnh Giấc Mộng"`);
          await questRepository.acceptQuest(playerId, awakenQuest.id);
        }
      }
    } catch (err) {
      console.error('[QuestService] Self-healing failed:', err);
    }

    const rows = await questRepository.findPlayerQuests(playerId);
    console.log(`[QuestService] Found existing quests (after self-healing): ${rows.length}`);
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

        const updatedPlayer = await playerRepository.update(playerId, {
          gold: player.gold + goldReward,
          spirit_stone: player.spirit_stone + spiritStoneReward,
          exp: player.exp + expReward,
        });
        const profile = {
          id: updatedPlayer.id,
          name: updatedPlayer.name,
          realm: updatedPlayer.realm,
          daoId: updatedPlayer.dao_id,
          gold: updatedPlayer.gold ?? 0,
          spiritStone: updatedPlayer.spirit_stone ?? 0,
          exp: updatedPlayer.exp ?? 0,
        };
        eventBus.emit('player:profile:updated', { playerId, profile });
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

    // Sync realm level breakthrough for Chapter transitions
    if (key === 'ch1_complete') {
      const player = await playerRepository.findById(playerId);
      if (player && player.realm < 2) {
        await playerRepository.update(playerId, { realm: 2 });
        try {
          const { updateRealm } = await import('../cultivation/cultivation.repository.js');
          await updateRealm(playerId, 2);
        } catch (err) {
          console.error('[QuestService] Failed to sync cultivation realm to 2:', err);
        }
        console.log(`[QuestService] Player ${player.name} advanced to Nhị Chuyển (Realm 2) on ch1_complete`);
      }
    } else if (key === 'ch2_complete') {
      const player = await playerRepository.findById(playerId);
      if (player && player.realm < 3) {
        await playerRepository.update(playerId, { realm: 3 });
        try {
          const { updateRealm } = await import('../cultivation/cultivation.repository.js');
          await updateRealm(playerId, 3);
        } catch (err) {
          console.error('[QuestService] Failed to sync cultivation realm to 3:', err);
        }
        console.log(`[QuestService] Player ${player.name} advanced to Tam Chuyển (Realm 3) on ch2_complete`);
      }
    }

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
            } else if (targetName === 'Lão Độc Sư' && (key === 'ch2_intro_done' || key === 'ch2_sent_to_boss' || key === 'ch2_arrived')) {
              shouldComplete = true;
            } else if (targetName === 'Vạn Độc Cổ Vương' && (key === 'ch2_boss_confronted' || key === 'ch2_complete')) {
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

    // --- Auto-accept next quests unlocked by this flag ---
    await questService.autoAcceptQuestsByFlag(playerId, key);

    // Always emit update to ensure client state matches
    void questService.emitQuestUpdate(playerId);

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
        .from(schema.quests)
        .where(eq(schema.quests.flag_required, flagKey));

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
