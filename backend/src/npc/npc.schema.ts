import { z } from 'zod';

export const npcDialogueChoiceSchema = z.object({
  text: z.string().min(1),
  nextDialogueId: z.string().uuid().nullable(),
});

export const createNpcSchema = z.object({
  name: z.string().min(1).max(100),
  sprite: z.string().min(1).max(255).default('char_2'),
  faction: z.string().min(1).max(50).default('neutral'),
  occupation: z.string().min(1).max(50),
  mapId: z.string().uuid(),
  x: z.number().int().default(0),
  y: z.number().int().default(0),
  affectionMin: z.number().int().default(-100),
  affectionMax: z.number().int().default(100),
  hasShop: z.enum(['true', 'false']).default('false'),
  schedule: z.string().nullable().optional(),
});

export const createDialogueSchema = z.object({
  npcId: z.string().uuid(),
  orderIndex: z.number().int().default(0),
  text: z.string().min(1),
  speaker: z.string().min(1).default('npc'),
  choices: z.array(npcDialogueChoiceSchema).nullable().optional(),
  conditionFlag: z.string().max(100).nullable().optional(),
  conditionAffectionMin: z.number().int().nullable().optional(),
  setFlag: z.string().max(100).nullable().optional(),
  nextDialogueId: z.string().uuid().nullable().optional(),
});

export type CreateNpcInput = z.infer<typeof createNpcSchema>;
export type CreateDialogueInput = z.infer<typeof createDialogueSchema>;
