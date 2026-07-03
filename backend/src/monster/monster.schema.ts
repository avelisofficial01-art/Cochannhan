import { z } from 'zod';

export const createMonsterSchema = z.object({
  name: z.string().min(1).max(200),
  realm: z.number().int().min(1).max(9).default(1),
  hp: z.number().int().min(1).default(50),
  atk: z.number().int().min(1).default(10),
  def: z.number().int().min(0).default(5),
  speed: z.number().int().min(1).default(200),
  element: z.string().min(1).max(30).default('physical'),
  sprite: z.string().min(1).max(255).default('monster_1'),
  dropTable: z
    .array(
      z.object({
        itemId: z.string().uuid(),
        chance: z.number().min(0).max(100),
        quantityMin: z.number().int().min(1),
        quantityMax: z.number().int().min(1),
      }),
    )
    .optional(),
  mapId: z.string().uuid(),
  respawnTime: z.number().int().min(5).max(3600).default(30),
});

export type CreateMonsterInput = z.infer<typeof createMonsterSchema>;
