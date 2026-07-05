import * as storyRepo from './story.repository.js';
import type { StoryFlag } from '@co-dao/shared';

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
  return storyRepo.setFlag(playerId, flagKey, flagValue);
}

export async function hasFlag(playerId: string, flagKey: string): Promise<boolean> {
  const flag = await storyRepo.getFlag(playerId, flagKey);
  return flag !== null && flag.flagValue === 'true';
}
