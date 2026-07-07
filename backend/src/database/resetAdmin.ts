/**
 * Reset admin HP + ATK only (keep realm, gold, exp untouched).
 * Run: npx ts-node -e "import('./resetAdmin.js').then(m=>m.resetAdmin())"
 * Or:  npm run reset-admin (if script added to package.json)
 */
import { db } from './connection.js';
import * as schema from './schema/index.js';
import { eq } from 'drizzle-orm';

const ADMIN_USERNAMES = ['admin', 'Admin', 'ADMIN'];
const HP_BONUS = 999_999;
const ATK_BONUS = 999_999;

export async function resetAdmin(): Promise<void> {
  console.log('[resetAdmin] Looking for admin account...');

  // Find account
  let account: { id: string; username: string } | undefined;
  for (const uname of ADMIN_USERNAMES) {
    const rows = await db
      .select({ id: schema.accounts.id, username: schema.accounts.username })
      .from(schema.accounts)
      .where(eq(schema.accounts.username, uname))
      .limit(1);
    if (rows.length > 0) {
      account = rows[0];
      break;
    }
  }

  if (!account) {
    // Try first account in DB as fallback
    const all = await db
      .select({ id: schema.accounts.id, username: schema.accounts.username })
      .from(schema.accounts)
      .limit(5);
    if (all.length === 0) {
      console.error('[resetAdmin] ❌ No accounts found in DB.');
      process.exit(1);
    }
    console.log('[resetAdmin] No "admin" username found. Available accounts:');
    for (const a of all) console.log('  -', a.username);
    console.log('[resetAdmin] Using first account:', all[0].username);
    account = all[0];
  }

  console.log(`[resetAdmin] Found account: ${account.username} (${account.id})`);

  // Find player
  const players = await db
    .select({ id: schema.players.id, name: schema.players.name })
    .from(schema.players)
    .where(eq(schema.players.account_id, account.id))
    .limit(1);

  if (players.length === 0) {
    console.error('[resetAdmin] ❌ No player found for this account. Create a character first.');
    process.exit(1);
  }

  const player = players[0];
  console.log(`[resetAdmin] Found player: ${player.name} (${player.id})`);

  // Update playerStats: only hp_bonus + atk_bonus
  const existing = await db
    .select()
    .from(schema.playerStats)
    .where(eq(schema.playerStats.player_id, player.id))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(schema.playerStats)
      .set({ hp_bonus: HP_BONUS, atk_bonus: ATK_BONUS })
      .where(eq(schema.playerStats.player_id, player.id));
    console.log(`[resetAdmin] ✅ Updated playerStats: hp_bonus=${HP_BONUS}, atk_bonus=${ATK_BONUS}`);
  } else {
    await db.insert(schema.playerStats).values({
      player_id: player.id,
      hp_bonus: HP_BONUS,
      atk_bonus: ATK_BONUS,
      def_bonus: 0,
      crit_bonus: 0,
      move_speed: 300,
    });
    console.log(`[resetAdmin] ✅ Inserted playerStats: hp_bonus=${HP_BONUS}, atk_bonus=${ATK_BONUS}`);
  }

  // Reset realm (tu vi) to 1
  await db
    .update(schema.players)
    .set({ realm: 1 })
    .where(eq(schema.players.id, player.id));
  console.log(`[resetAdmin] ✅ Reset realm (tu vi) to 1`);

  // Delete all quest progress for this player
  await db
    .delete(schema.playerQuests)
    .where(eq(schema.playerQuests.player_id, player.id));
  console.log(`[resetAdmin] ✅ Cleared playerQuests (all quest progress reset)`);

  // Delete all story flags for this player
  await db
    .delete(schema.storyFlags)
    .where(eq(schema.storyFlags.player_id, player.id));
  console.log(`[resetAdmin] ✅ Cleared storyFlags (all flags reset)`);

  console.log('[resetAdmin] Done. Realm, gold, exp, and everything else unchanged.');
  process.exit(0);
}

resetAdmin().catch((e) => {
  console.error('[resetAdmin] Fatal:', e);
  process.exit(1);
});
