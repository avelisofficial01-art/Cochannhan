/**
 * Seed Admin Account — tạo tài khoản admin mạnh để test game.
 *
 * Chạy: npx tsx src/scripts/seed-admin.ts
 * Login: admin@game.local / admin123
 */

import bcrypt from 'bcryptjs';
import { and, eq } from 'drizzle-orm';
import { db } from '../database/connection.js';
import {
  accounts,
  playerQuests,
  players,
  quests,
  storyFlags,
} from '../database/schema/index.js';

const ADMIN_EMAIL = 'admin@game.local';
const ADMIN_USERNAME = 'Admin';
const ADMIN_PASSWORD = 'admin123';

function buildProgress(objectives: unknown): unknown[] {
  if (!Array.isArray(objectives)) return [];

  return objectives.map((objective, index) => {
    const row = objective as { count?: number; targetCount?: number };
    return {
      index,
      current: 0,
      target: row.count ?? row.targetCount ?? 1,
    };
  });
}

async function seedAdmin(): Promise<void> {
  console.log('🔧 [Seed Admin] Starting...\n');

  const [existingAccount] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.email, ADMIN_EMAIL));

  const accountId = existingAccount?.id ?? await (async () => {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const [account] = await db
      .insert(accounts)
      .values({
        email: ADMIN_EMAIL,
        username: ADMIN_USERNAME,
        password_hash: passwordHash,
        status: 'active',
      })
      .returning({ id: accounts.id });

    console.log(`✅ Account created: ${ADMIN_EMAIL} (id: ${account.id})`);
    return account.id;
  })();

  const [existingPlayer] = await db
    .select()
    .from(players)
    .where(eq(players.account_id, accountId));

  const playerId = existingPlayer?.id ?? await (async () => {
    const [player] = await db
      .insert(players)
      .values({
        account_id: accountId,
        name: 'Admin',
        realm: 9,
        hp: 10000,
        mana: 5000,
        exp: 999999,
        gold: 999999,
        spirit_stone: 999999,
        current_map: 'bac_nguyen_village',
        current_x: 500,
        current_y: 400,
      })
      .returning({ id: players.id });

    console.log(`✅ Player created: Admin (realm=9, id: ${player.id})`);
    return player.id;
  })();

  if (existingPlayer) {
    await db
      .update(players)
      .set({
        realm: 9,
        hp: 10000,
        mana: 5000,
        exp: 999999,
        gold: 999999,
        spirit_stone: 999999,
        current_map: 'bac_nguyen_village',
        current_x: 500,
        current_y: 400,
      })
      .where(eq(players.id, existingPlayer.id));
    console.log(`⬆️  Player updated to max stats: ${existingPlayer.name}`);
  }

  const flagsToSet = [
    'talked_village_chief',
    'killed_3_wild_beasts',
    'entered_rung_tuyet',
    'defeated_wolf_king',
  ];

  for (const flagKey of flagsToSet) {
    const [existingFlag] = await db
      .select()
      .from(storyFlags)
      .where(and(eq(storyFlags.flag_key, flagKey), eq(storyFlags.player_id, playerId)));

    if (!existingFlag) {
      await db.insert(storyFlags).values({
        player_id: playerId,
        flag_key: flagKey,
        flag_value: 'true',
      });
    }
  }

  const allQuests = await db.select().from(quests);
  let acceptedCount = 0;

  for (const quest of allQuests) {
    const [existingPlayerQuest] = await db
      .select()
      .from(playerQuests)
      .where(and(eq(playerQuests.player_id, playerId), eq(playerQuests.quest_id, quest.id)));

    if (!existingPlayerQuest) {
      await db.insert(playerQuests).values({
        player_id: playerId,
        quest_id: quest.id,
        status: 'active',
        progress: buildProgress(quest.objectives),
      });
      acceptedCount++;
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎮  ADMIN ACCOUNT READY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   Email:    ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log(`   Player:   Admin (realm 9)`);
  console.log(`   Quests:   ${acceptedCount} newly accepted`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  process.exit(0);
}

seedAdmin().catch((err: unknown) => {
  console.error('❌ [Seed Admin] Failed:', err);
  process.exit(1);
});
