import { z } from 'zod';

export const questTypeSchema = z.enum([
  'main', 'side', 'hidden', 'daily', 'legendary', 'faction',
]);

export const acceptQuestSchema = z.object({
  questId: z.string().min(1),
});

export const updateQuestProgressSchema = z.object({
  objectiveIndex: z.number().int().min(0),
  amount: z.number().int().min(1),
});

export const createQuestSchema = z.object({
  name: z.string().min(1).max(200),
  type: questTypeSchema.default('side'),
  description: z.string().min(1),
  npcGiverId: z.string().uuid().nullable().optional(),
  prerequisites: z.string().nullable().optional(),
  objectives: z.string().min(1), // JSON string
  rewards: z.string().nullable().optional(), // JSON string
  flagRequired: z.string().max(100).nullable().optional(),
  flagComplete: z.string().max(100).nullable().optional(),
  isRepeatable: z.enum(['true', 'false']).default('false'),
  minRealm: z.number().int().default(1),
});

export type CreateQuestInput = z.infer<typeof createQuestSchema>;
