import * as storyRepo from './story.repository.js';
import type { StoryFlag } from '@co-dao/shared';
import { questService } from '../quest/quest.service.js';

export async function getFlags(playerId: string): Promise<StoryFlag[]> {
  return storyRepo.getPlayerFlags(playerId);
}

export async function getFlag(playerId: string, flagKey: string): Promise<StoryFlag | null> {
  return storyRepo.getFlag(playerId, flagKey);
}

export async function setFlag(
  playerId: string,
  flagKey: string,
  flagValue: string,
): Promise<StoryFlag> {
  await questService.setStoryFlag(playerId, flagKey, flagValue);
  const flag = await storyRepo.getFlag(playerId, flagKey);
  if (!flag) {
    throw new Error('Flag not found after set');
  }
  return flag;
}

export async function hasFlag(playerId: string, flagKey: string): Promise<boolean> {
  const flag = await storyRepo.getFlag(playerId, flagKey);
  return flag !== null && flag.flagValue === 'true';
}
