import { eq } from 'drizzle-orm';
import { db } from '../database/connection.js';
import { accounts, accountSessions } from '../database/schema/index.js';

export type AccountRow = typeof accounts.$inferSelect;
export type AccountInsert = typeof accounts.$inferInsert;
export type SessionRow = typeof accountSessions.$inferSelect;
export type SessionInsert = typeof accountSessions.$inferInsert;

async function findByEmail(email: string): Promise<AccountRow | undefined> {
  const [row] = await db.select().from(accounts).where(eq(accounts.email, email));
  return row;
}

async function findByUsername(username: string): Promise<AccountRow | undefined> {
  const [row] = await db.select().from(accounts).where(eq(accounts.username, username));
  return row;
}

async function findById(id: string): Promise<AccountRow | undefined> {
  const [row] = await db.select().from(accounts).where(eq(accounts.id, id));
  return row;
}

async function create(data: AccountInsert): Promise<AccountRow> {
  const [row] = await db.insert(accounts).values(data).returning();
  return row;
}

async function createSession(data: SessionInsert): Promise<SessionRow> {
  const [row] = await db.insert(accountSessions).values(data).returning();
  return row;
}

async function findSessionByRefreshToken(token: string): Promise<SessionRow | undefined> {
  const [row] = await db
    .select()
    .from(accountSessions)
    .where(eq(accountSessions.refresh_token, token));
  return row;
}

async function deleteSession(id: string): Promise<void> {
  await db.delete(accountSessions).where(eq(accountSessions.id, id));
}

async function deleteAllSessionsForAccount(accountId: string): Promise<void> {
  await db.delete(accountSessions).where(eq(accountSessions.account_id, accountId));
}

export const authRepository = {
  findByEmail,
  findByUsername,
  findById,
  create,
  createSession,
  findSessionByRefreshToken,
  deleteSession,
  deleteAllSessionsForAccount,
};
