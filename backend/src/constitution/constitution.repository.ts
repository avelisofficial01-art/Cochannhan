import { db } from '../database/connection.js';
import * as schema from '../database/schema/index.js';
import { eq } from 'drizzle-orm';

export async function getAllConstitutions() {
  return db.select().from(schema.bodyConstitutions).orderBy(schema.bodyConstitutions.id);
}

export async function getConstitutionById(id: number) {
  const [row] = await db
    .select()
    .from(schema.bodyConstitutions)
    .where(eq(schema.bodyConstitutions.id, id))
    .limit(1);
  return row ?? null;
}

export async function getPlayerConstitution(playerId: string) {
  const [player] = await db
    .select({ constitution_id: schema.players.constitution_id })
    .from(schema.players)
    .where(eq(schema.players.id, playerId))
    .limit(1);
  if (!player || player.constitution_id === null) return null;

  const [constitution] = await db
    .select()
    .from(schema.bodyConstitutions)
    .where(eq(schema.bodyConstitutions.id, player.constitution_id))
    .limit(1);
  return constitution ?? null;
}

export async function setPlayerConstitution(playerId: string, constitutionId: number) {
  await db
    .update(schema.players)
    .set({ constitution_id: constitutionId })
    .where(eq(schema.players.id, playerId));
}
