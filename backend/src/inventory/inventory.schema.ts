import { z } from 'zod';

export const addItemSchema = z.object({
  itemId: z.string().uuid(),
  quantity: z.number().int().min(1),
  slot: z.number().int().min(0).optional(),
});

export const moveItemSchema = z.object({
  fromSlot: z.number().int().min(0),
  toSlot: z.number().int().min(0),
});

export const sortInventorySchema = z.object({
  sortBy: z.enum(['name', 'type', 'quantity']),
});

export const createItemSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.enum(['equipment', 'consumable', 'material', 'quest_item', 'gu']),
  description: z.string().nullable().optional(),
  stackable: z.enum(['true', 'false']).default('false'),
  maxStack: z.number().int().default(1),
  sellPrice: z.number().int().default(0),
  sprite: z.string().max(255).nullable().optional(),
});

export type AddItemInput = z.infer<typeof addItemSchema>;
export type MoveItemInput = z.infer<typeof moveItemSchema>;
export type CreateItemInput = z.infer<typeof createItemSchema>;
