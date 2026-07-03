import { z } from 'zod';

export const createPlayerSchema = z.object({
  name: z
    .string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(50, 'Tên không được quá 50 ký tự')
    .regex(
      /^[a-zA-Z0-9_\p{L}]+$/u,
      'Tên chỉ được chứa chữ cái, số và dấu gạch dưới',
    ),
});

export type CreatePlayerInput = z.infer<typeof createPlayerSchema>;
