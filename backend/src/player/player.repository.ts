import { eq } from 'drizzle-orm';
import { db } from '../database/connection.js';
import { players, playerStats } from '../database/schema/index.js';

export type PlayerRow = typeof players.$inferSelect;
export type PlayerInsert = typeof players.$inferInsert;
export type PlayerStatsRow = typeof playerStats.$inferSelect;
export type PlayerStatsInsert = typeof playerStats.$inferInsert;

// ─── Player ──────────────────────────────────────────────────

async function findByAccountId(accountId: string): Promise<PlayerRow | undefined> {
  const [row] = await db
    .select()
    .from(players)
    .where(eq(players.account_id, accountId));
  return row;
}

async function findById(id: string): Promise<PlayerRow | undefined> {
  const [row] = await db
    .select()
    .from(players)
    .where(eq(players.id, id));
  return row;
}

async function create(data: PlayerInsert): Promise<PlayerRow> {
  const [row] = await db.insert(players).values(data).returning();
  return row;
}

async function update(id: string, data: Partial<PlayerInsert>): Promise<PlayerRow> {
  const [row] = await db
    .update(players)
    .set(data)
    .where(eq(players.id, id))
    .returning();
  return row;
}

async function updatePosition(
  id: string,
  mapId: string,
  x: number,
  y: number,
): Promise<void> {
  await db
    .update(players)
    .set({ current_map: mapId, current_x: x, current_y: y })
    .where(eq(players.id, id));
}

// ─── Player Stats ────────────────────────────────────────────

async function findStatsByPlayerId(
  playerId: string,
): Promise<PlayerStatsRow | undefined> {
  const [row] = await db
    .select()
    .from(playerStats)
    .where(eq(playerStats.player_id, playerId));
  return row;
}

async function createStats(data: PlayerStatsInsert): Promise<PlayerStatsRow> {
  const [row] = await db.insert(playerStats).values(data).returning();
  return row;
}

export const playerRepository = {
  findByAccountId,
  findById,
  create,
  update,
  updatePosition,
  findStatsByPlayerId,
  createStats,
};
