/**
 * Seed Admin Account — tạo tài khoản admin full sức mạnh để test game.
 *
 * Chạy: npx tsx src/scripts/seed-admin.ts
 * Login: admin@game.local / admin123
 *
 * Stats admin (realm 9 - Đại Thừa):
 *   HP: ~26,000 | Mana: ~13,000 | ATK: ~734 | DEF: ~617 | CRIT: 100%
 *   Gold: 999,999 | Spirit Stone: 999,999 | Move Speed: 600
 */

import bcrypt from 'bcryptjs';
import { eq, and } from 'drizzle-orm';
import { db } from '../database/connection.js';
import {
  accounts,
  players,
  playerStats,
  storyFlags,
  questTemplates,
  playerQuests,
} from '../database/schema/index.js';

const ADMIN_EMAIL = 'admin@game.local';
const ADMIN_USERNAME = 'Admin';
const ADMIN_PASSWORD = 'admin123';

async function seedAdmin() {
  console.log('🔧 [Seed Admin] Starting...\n');

  // ── 1. Check if admin account already exists ──
  const [existingAccount] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.email, ADMIN_EMAIL));

  if (existingAccount) {
    console.log(`⚠️  Admin account already exists: ${existingAccount.email} (id: ${existingAccount.id})`);
    console.log('   Skipping account creation.\n');
  }

  const accountId = existingAccount?.id ?? (async () => {
    // ── 2. Create account ──
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const [acc] = await db
      .insert(accounts)
      .values({
        email: ADMIN_EMAIL,
        username: ADMIN_USERNAME,
        password_hash: passwordHash,
        status: 'active',
      })
      .returning({ id: accounts.id });
    console.log(`✅ Account created: ${ADMIN_EMAIL} (id: ${acc.id})`);
    return acc.id;
  })();

  // ── 3. Check if player already exists ──
  const [existingPlayer] = await db
    .select()
    .from(players)
    .where(eq(players.account_id, accountId));

  let playerId: string;

  if (existingPlayer) {
    // Update existing player to max stats
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

    console.log(`⬆️  Player updated to max stats: ${existingPlayer.name} (realm=9)`);

    // Upsert player stats
    const [existingStats] = await db
      .select()
      .from(playerStats)
      .where(eq(playerStats.player_id, existingPlayer.id));

    if (existingStats) {
      await db
        .update(playerStats)
        .set({
          hp_bonus: 0,
          atk_bonus: 500,
          def_bonus: 500,
          crit_bonus: 95,
          move_speed: 600,
        })
        .where(eq(playerStats.id, existingStats.id));
    } else {
      await db.insert(playerStats).values({
        player_id: existingPlayer.id,
        hp_bonus: 0,
        atk_bonus: 500,
        def_bonus: 500,
        crit_bonus: 95,
        move_speed: 600,
      });
    }
    console.log('✅ Player stats set to max bonuses');

    playerId = existingPlayer.id;
  } else {
    // Create new player
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

    // Create player stats
    await db.insert(playerStats).values({
      player_id: player.id,
      hp_bonus: 0,
      atk_bonus: 500,
      def_bonus: 500,
      crit_bonus: 95,
      move_speed: 600,
    });
    console.log('✅ Player stats created with max bonuses');

    playerId = player.id;
  }

  // ── 4. Set all story flags (unlock everything) ──
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
      .where(and(
        eq(storyFlags.flag_key, flagKey),
        eq(storyFlags.player_id, playerId)
      ));

    if (!existingFlag) {
      await db.insert(storyFlags).values({
        player_id: playerId,
        flag_key: flagKey,
        flag_value: 'true',
      });
    }
  }
  console.log(`✅ Story flags set: ${flagsToSet.join(', ')}`);

  // ── 5. Auto-accept all available quests ──
  const allQuestTemplates = await db.select().from(questTemplates);
  console.log(`\n📋 Found ${allQuestTemplates.length} quest templates`);

  let acceptedCount = 0;
  for (const qt of allQuestTemplates) {
    // Check if player already has this quest
    const [existingPq] = await db
      .select()
      .from(playerQuests)
      .where(and(
        eq(playerQuests.player_id, playerId),
        eq(playerQuests.quest_id, qt.id)
      ));

    if (!existingPq) {
      const objectives = JSON.parse(qt.objectives as string) as { type: string; target: string; count: number }[];
      const objectivesProgress = objectives.map((obj, idx) => ({
        index: idx,
        current: 0,
        target: obj.count,
      }));

      await db.insert(playerQuests).values({
        player_id: playerId,
        quest_id: qt.id,
        status: 'active',
        objectives_progress: JSON.stringify(objectivesProgress),
      });
      acceptedCount++;
    }
  }
  console.log(`✅ Auto-accepted ${acceptedCount} new quest${acceptedCount !== 1 ? 's' : ''}`);

  // ── 6. Summary ──
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎮  ADMIN ACCOUNT READY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   Email:    ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log(`   Player:   Admin (realm 9 - Đại Thừa)`);
  console.log(`   Gold:     999,999`);
  console.log(`   Stone:    999,999`);
  console.log(`   ATK:      ~734 (one-shot mọi quái)`);
  console.log(`   DEF:      ~617 (gần như bất tử)`);
  console.log(`   CRIT:     100%`);
  console.log(`   Quests:   ${acceptedCount} active`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error('❌ [Seed Admin] Failed:', err);
  process.exit(1);
});
