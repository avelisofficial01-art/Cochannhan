import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authService } from './auth.service.js';
import { success, error } from '../utils/response.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import type { RegisterRequest, LoginResponse } from '@co-dao/shared';

const registerSchema = z.object({
  email: z.string().email('Invalid email format.'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters.')
    .max(50, 'Username must be at most 50 characters.'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters.'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format.'),
  password: z.string().min(1, 'Password is required.'),
});

export async function registerHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      error(res, 'VALIDATION_ERROR', parsed.error.errors[0].message, 400);
      return;
    }

    const input: RegisterRequest = parsed.data;
    await authService.register(input);
    success(res, null, 201);
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err && 'status' in err) {
      const { code, message, status } = err as { code: string; message: string; status: number };
      error(res, code, message, status);
      return;
    }
    next(err);
  }
}

export async function loginHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      error(res, 'VALIDATION_ERROR', parsed.error.errors[0].message, 400);
      return;
    }

    const result = await authService.login(parsed.data);
    const body: LoginResponse = {
      token: result.tokens.token,
      refreshToken: result.tokens.refreshToken,
      player: result.player as LoginResponse['player'],
    };
    success(res, body);
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err && 'status' in err) {
      const { code, message, status } = err as { code: string; message: string; status: number };
      error(res, code, message, status);
      return;
    }
    next(err);
  }
}

export async function refreshHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { refreshToken } = req.body as { refreshToken?: string };
    if (!refreshToken) {
      error(res, 'VALIDATION_ERROR', 'Refresh token is required.', 400);
      return;
    }

    const tokens = await authService.refresh(refreshToken);
    success(res, tokens);
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err && 'status' in err) {
      const { code, message, status } = err as { code: string; message: string; status: number };
      error(res, code, message, status);
      return;
    }
    next(err);
  }
}

export async function logoutHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const accountId: string | undefined = req.account?.accountId;
    if (!accountId) {
      error(res, 'Unauthorized', 'Access token is required.', 401);
      return;
    }
    await authService.logout(accountId);
    success(res, null);
  } catch (err) {
    next(err);
  }
}
