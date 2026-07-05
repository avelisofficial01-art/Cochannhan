import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { config } from '../config/index.js';
import { authRepository } from './auth.repository.js';
import type { AccountRow } from './auth.repository.js';
import {
  players,
} from '../database/schema/index.js';
import { db } from '../database/connection.js';

const SALT_ROUNDS = 12;

function generateAccessToken(account: AccountRow): string {
  return jwt.sign(
    { accountId: account.id, username: account.username },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn as unknown as jwt.SignOptions['expiresIn'] },
  );
}

function generateRefreshToken(): string {
  return jwt.sign({ type: 'refresh' }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn as unknown as jwt.SignOptions['expiresIn'],
  });
}

function parseExpiresIn(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return value * (multipliers[unit] ?? 1000);
}

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface TokenPair {
  token: string;
  refreshToken: string;
}

export async function register(input: RegisterInput): Promise<void> {
  const existingEmail = await authRepository.findByEmail(input.email);
  if (existingEmail) {
    throw { code: 'EMAIL_EXISTS', message: 'Email already registered.', status: 409 };
  }

  const existingUsername = await authRepository.findByUsername(input.username);
  if (existingUsername) {
    throw { code: 'VALIDATION_ERROR', message: 'Username already taken.', status: 409 };
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  await authRepository.create({
    email: input.email,
    username: input.username,
    password_hash: passwordHash,
    status: 'active',
  });
}

export async function login(input: LoginInput): Promise<{ tokens: TokenPair; player: unknown | null }> {
  const account = await authRepository.findByEmail(input.email);
  if (!account) {
    throw { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.', status: 401 };
  }

  const valid = await bcrypt.compare(input.password, account.password_hash);
  if (!valid) {
    throw { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.', status: 401 };
  }

  const token = generateAccessToken(account);
  const refreshToken = generateRefreshToken();
  const expiresInMs = parseExpiresIn(config.jwt.refreshExpiresIn);

  await authRepository.createSession({
    account_id: account.id,
    refresh_token: refreshToken,
    expired_at: new Date(Date.now() + expiresInMs),
  });

  const [player] = await db
    .select({ id: players.id, name: players.name, realm: players.realm, daoId: players.dao_id })
    .from(players)
    .where(eq(players.account_id, account.id));

  let resolvedPlayer = player;
  if (!resolvedPlayer) {
    const { createPlayer } = await import('../player/player.service.js');
    const newPlayer = await createPlayer(account.id, { name: account.username });
    resolvedPlayer = {
      id: newPlayer.id,
      name: newPlayer.name,
      realm: newPlayer.realm,
      daoId: newPlayer.daoId,
    };
  }

  return {
    tokens: { token, refreshToken },
    player: resolvedPlayer,
  };
}

export async function refresh(refreshToken: string): Promise<TokenPair> {
  const session = await authRepository.findSessionByRefreshToken(refreshToken);
  if (!session) {
    throw { code: 'INVALID_TOKEN', message: 'Refresh token not found.', status: 401 };
  }

  if (new Date() > session.expired_at) {
    await authRepository.deleteSession(session.id);
    throw { code: 'INVALID_TOKEN', message: 'Refresh token expired.', status: 401 };
  }

  const account = await authRepository.findById(session.account_id);
  if (!account) {
    throw { code: 'INVALID_TOKEN', message: 'Account not found.', status: 401 };
  }

  await authRepository.deleteSession(session.id);

  const token = generateAccessToken(account);
  const newRefreshToken = generateRefreshToken();
  const expiresInMs = parseExpiresIn(config.jwt.refreshExpiresIn);

  await authRepository.createSession({
    account_id: account.id,
    refresh_token: newRefreshToken,
    expired_at: new Date(Date.now() + expiresInMs),
  });

  return { token, refreshToken: newRefreshToken };
}

export async function logout(accountId: string): Promise<void> {
  await authRepository.deleteAllSessionsForAccount(accountId);
}

export const authService = {
  register,
  login,
  refresh,
  logout,
};
