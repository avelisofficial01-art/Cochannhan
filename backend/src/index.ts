import { httpServer, config } from './app.js';
import { db } from './database/connection.js';
import { getRedisClient } from './database/redis.js';

async function main(): Promise<void> {
  console.log(`[Server] Starting in ${config.nodeEnv} mode...`);

  // Verify database connection
  try {
    await db.execute('SELECT 1');
    console.log('[Server] PostgreSQL connected successfully.');
  } catch (err) {
    console.error('[Server] PostgreSQL connection failed:', err);
    process.exit(1);
  }

  // Verify Redis connection
  try {
    const redis = await getRedisClient();
    await redis.ping();
    console.log('[Server] Redis connected successfully.');
  } catch {
    console.warn('[Server] Redis not available — continuing without cache.');
  }

  httpServer.listen(config.port, () => {
    console.log(`[Server] Listening on http://localhost:${config.port}`);
    console.log(`[Server] Health check: http://localhost:${config.port}/api/health`);
    console.log('[Server] Socket.IO ready for real-time gameplay.');
  });
}

main().catch((err) => {
  console.error('[Server] Fatal error:', err);
  process.exit(1);
});
