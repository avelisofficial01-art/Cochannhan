import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { db } from './database/connection.js';
import { worldMaps, mapPortals, mapSpawns, monsterTemplates, npcs, quests, players, accounts, playerQuests, storyFlags } from './database/schema/index.js';
import { eq, or, and } from 'drizzle-orm';
import authRouter from './auth/auth.route.js';
import playerRouter from './player/player.route.js';
import { playerRepository } from './player/player.repository.js';
import worldRouter from './world/world.route.js';
import npcRouter from './npc/npc.route.js';
import questRouter from './quest/quest.route.js';
import { questService } from './quest/quest.service.js';
import inventoryRouter from './inventory/inventory.route.js';
import monsterRouter from './monster/monster.route.js';
import combatRouter from './combat/combat.route.js';
import guRouter from './gu/gu.route.js';
import equipmentRouter from './equipment/equipment.route.js';
import craftRouter from './craft/craft.route.js';
import storyRouter from './story/story.controller.js';
import cultivationRouter from './cultivation/cultivation.controller.js';
import saveRouter from './save/save.controller.js';
import constitutionRouter from './constitution/constitution.route.js';
import shopRouter from './shop/shop.route.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';
import { config } from './config/index.js';
import jwt from 'jsonwebtoken';
import * as combatService from './combat/combat.service.js';
import { eventBus } from './utils/event-bus.js';

const app = express();
const httpServer = createServer(app);

// Socket.IO
const io = new SocketIOServer(httpServer, {
  cors: { origin: config.corsOrigins, credentials: true },
  pingInterval: 25000,
  pingTimeout: 60000,
});

// Security
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'img-src': ["'self'", 'data:', 'blob:'],
        'connect-src': ["'self'", 'ws:', 'wss:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);
app.use(cors({ origin: config.corsOrigins, credentials: true }));
app.use(compression());

// Body parsing
app.use(express.json({ limit: '1mb' }));

// Rate limiting (basic in-memory for dev)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
app.use('/api/auth/login', (req, res, next) => {
  if (config.nodeEnv === 'development') {
    next();
    return;
  }
  const ip = req.ip ?? 'unknown';
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (entry && now < entry.resetTime) {
    if (entry.count >= 5) {
      res.status(429).json({
        success: false,
        code: 'RATE_LIMITED',
        message: 'Too many login attempts. Please try again later.',
      });
      return;
    }
    entry.count++;
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 });
  }

  next();
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/player', playerRouter);
app.use('/api/world', worldRouter);
app.use('/api/npc', npcRouter);
app.use('/api/quest', questRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/monster', monsterRouter);
app.use('/api/combat', combatRouter);
app.use('/api/gu', guRouter);
app.use('/api/equipment', equipmentRouter);
app.use('/api/craft', craftRouter);
app.use('/api/story', storyRouter);
app.use('/api/shop', shopRouter);
app.use('/api/cultivation', cultivationRouter);
app.use('/api/save', saveRouter);
app.use('/api/constitution', constitutionRouter);

// Health check
app.get('/api/health', async (_req, res) => {
  try {
    const [mapsCount, npcsCount, monstersCount, questsCount] = await Promise.all([
      db.select().from(worldMaps).then(r => r.length),
      db.select().from(npcs).then(r => r.length),
      db.select().from(monsterTemplates).then(r => r.length),
      db.select().from(quests).then(r => r.length),
    ]).catch(() => [0, 0, 0, 0]);

    res.json({
      success: true,
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: {
          maps: mapsCount,
          npcs: npcsCount,
          monsters: monstersCount,
          quests: questsCount,
        }
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

// Admin seed endpoint (dev/test only)
app.post('/api/admin/seed', async (_req, res) => {
  try {
    const bcrypt = await import('bcryptjs');
    const ADMIN_EMAIL = 'admin@game.local';
    const ADMIN_USERNAME = 'Admin';
    const ADMIN_PASSWORD = 'admin123';

    // Check existing account
    const [existingAccount] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.email, ADMIN_EMAIL));

    const accountId = existingAccount?.id ?? (await (async () => {
      const passwordHash = await bcrypt.default.hash(ADMIN_PASSWORD, 12);
      const [acc] = await db.insert(accounts).values({
        email: ADMIN_EMAIL,
        username: ADMIN_USERNAME,
        password_hash: passwordHash,
        status: 'active',
      }).returning({ id: accounts.id });
      return acc.id;
    })());

    // Check existing player
    const [existingPlayer] = await db
      .select()
      .from(players)
      .where(eq(players.account_id, accountId));

    let playerId: string;

    if (existingPlayer) {
      await db.update(players).set({
        realm: 9, hp: 10000, mana: 5000, exp: 999999,
        gold: 999999, spirit_stone: 999999,
        current_map: 'bac_nguyen_village', current_x: 500, current_y: 400,
      }).where(eq(players.id, existingPlayer.id));

      playerId = existingPlayer.id;
    } else {
      const [player] = await db.insert(players).values({
        account_id: accountId, name: 'Admin', realm: 9, hp: 10000, mana: 5000,
        exp: 999999, gold: 999999, spirit_stone: 999999,
        current_map: 'bac_nguyen_village', current_x: 500, current_y: 400,
      }).returning({ id: players.id });

      playerId = player.id;
    }

    // Set story flags
    const flagsToSet = ['talked_village_chief', 'killed_3_wild_beasts', 'entered_rung_tuyet', 'defeated_wolf_king'];
    for (const flagKey of flagsToSet) {
      const [existingFlag] = await db.select().from(storyFlags)
        .where(and(
          eq(storyFlags.flag_key, flagKey),
          eq(storyFlags.player_id, playerId)
        ));
      if (!existingFlag) {
        await db.insert(storyFlags).values({ player_id: playerId, flag_key: flagKey, flag_value: 'true' });
      }
    }

    // Auto-accept all quests
    const allQuests = await db.select().from(quests);
    let acceptedCount = 0;
    for (const qt of allQuests) {
      const [existingPq] = await db.select().from(playerQuests)
        .where(and(
          eq(playerQuests.player_id, playerId),
          eq(playerQuests.quest_id, qt.id)
        ));
      if (!existingPq) {
        await db.insert(playerQuests).values({
          player_id: playerId, quest_id: qt.id, status: 'active',
          progress: {},
        });
        acceptedCount++;
      }
    }

    res.json({
      success: true,
      data: {
        message: 'Admin account ready!',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        realm: 9,
        gold: 999999,
        spiritStone: 999999,
        atk: '~734 (one-shot everything)',
        def: '~617',
        crit: '100%',
        questsAccepted: acceptedCount,
        flagsSet: flagsToSet,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

// Serve frontend static files in production
if (config.nodeEnv === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const frontendDist = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDist, {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
      const relativePath = path.relative(frontendDist, filePath);
      const isAsset = relativePath.startsWith('assets' + path.sep) ||
                      relativePath.startsWith('audio' + path.sep) ||
                      relativePath.startsWith('maps' + path.sep) ||
                      relativePath.startsWith('characters' + path.sep) ||
                      relativePath.startsWith('ui' + path.sep) ||
                      relativePath.startsWith('monsters' + path.sep) ||
                      relativePath.startsWith('bosses' + path.sep) ||
                      relativePath.startsWith('equipment' + path.sep) ||
                      relativePath.startsWith('skillbooks' + path.sep);

      if (isAsset) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      }
    }
  }));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// ─── Socket.IO: Player Movement & Combat ────────────────────

interface PlayerPosition {
  accountId: string;
  playerId: string;
  name: string;
  mapId: string;
  x: number;
  y: number;
}

const playerPositions = new Map<string, PlayerPosition>();
const initializedMaps = new Set<string>();

// Register monster change callback to broadcast updated monsters to map room on respawn
combatService.registerMonsterChangeCallback((mapId) => {
  const activeMonsters = combatService.getMonstersOnMap(mapId);
  io.to(`map:${mapId}`).emit('monster:spawn', activeMonsters.map(inst => ({
    instanceId: inst.instanceId,
    templateId: inst.templateId,
    name: inst.template.name,
    currentHp: inst.currentHp,
    maxHp: inst.template.hp,
    x: inst.x,
    y: inst.y,
    sprite: inst.template.sprite,
  })));
});

// Listen to quest:updated event and broadcast to player socket room
eventBus.on('quest:updated', ({ playerId, activeQuests }) => {
  io.to(`player:${playerId}`).emit('quest:updated', activeQuests);
});

// Listen to player:profile:updated and player:stats:updated events
eventBus.on('player:profile:updated', ({ playerId, profile }) => {
  io.to(`player:${playerId}`).emit('player:profile', profile);
});

eventBus.on('player:stats:updated', ({ playerId, stats }) => {
  io.to(`player:${playerId}`).emit('player:stats', stats);
});

io.on('connection', async (socket) => {
  // Authentication: verify JWT token from handshake auth
  const token = socket.handshake.auth?.token as string | undefined;
  if (!token) {
    socket.disconnect(true);
    return;
  }

  let accountId: string;
  try {
    const payload = jwt.verify(token, config.jwt.secret) as { accountId: string };
    accountId = payload.accountId;
  } catch {
    socket.disconnect(true);
    return;
  }

  if (!accountId) {
    socket.disconnect(true);
    return;
  }

  let playerId = socket.handshake.auth?.playerId as string | undefined;
  let playerName = socket.handshake.auth?.playerName as string | undefined;

  // Resolve player from DB using verified accountId
  try {
    const [dbPlayer] = await db
      .select()
      .from(players)
      .where(eq(players.account_id, accountId))
      .limit(1);
    if (dbPlayer) {
      playerId = dbPlayer.id;
      playerName = dbPlayer.name;
    } else {
      // Auto-create player if not exists
      const { createPlayer } = await import('./player/player.service.js');
      const payload = jwt.verify(token, config.jwt.secret) as { accountId: string; username: string };
      const newPlayer = await createPlayer(accountId, { name: payload.username || 'Unknown' });
      playerId = newPlayer.id;
      playerName = newPlayer.name;
    }
  } catch (err) {
    console.error('[Socket] Failed to resolve/create player from DB:', err);
  }

  // Join player-specific room for real-time updates (e.g. quests)
  if (playerId) {
    socket.join(`player:${playerId}`);
  }

  let currentMapId = 'bac_nguyen_village';

  socket.join(`account:${accountId}`);
  console.log(`[Socket] ✅ Client connected — account="${accountId}", player="${playerName || 'unknown'}"`);

  // Player move
  socket.on('player:move', (data: { mapId: string; x: number; y: number }) => {
    const pos: PlayerPosition = {
      accountId,
      playerId: playerId ?? '',
      name: playerName ?? 'Unknown',
      mapId: data.mapId,
      x: data.x,
      y: data.y,
    };

    playerPositions.set(accountId, pos);
    currentMapId = data.mapId;

    // Broadcast to all players in the same map
    socket.to(`map:${data.mapId}`).emit('player:update', pos);
  });

  // Join map room
  socket.on('map:join', async (input: string | { mapId: string; x?: number; y?: number }) => {
    const targetMapId = typeof input === 'string' ? input : input.mapId;
    const targetX = typeof input === 'string' ? undefined : input.x;
    const targetY = typeof input === 'string' ? undefined : input.y;

    console.log(`[Socket] 🔍 map:join request — targetMapId="${targetMapId}", player="${playerId || accountId}"`);

    // ACK ngay lập tức để client biết handler đang chạy
    socket.emit('map:join:ack', { received: true, targetMapId });

    // Realm gate check for Southern Border (Nam Cương requires Realm >= 3)
    try {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const isUuid = uuidRegex.test(targetMapId);

      let [checkMap] = await db
        .select()
        .from(worldMaps)
        .where(
          isUuid
            ? or(eq(worldMaps.id, targetMapId), eq(worldMaps.name, targetMapId))
            : eq(worldMaps.name, targetMapId)
        )
        .limit(1);

      if (!checkMap && (targetMapId === 'bac_nguyen_village' || targetMapId === 'lang_cothao')) {
        [checkMap] = await db
          .select()
          .from(worldMaps)
          .where(eq(worldMaps.name, 'Làng Cổ Thảo'))
          .limit(1);
      }

      if (checkMap && checkMap.region === 'nam_cuong') {
        let playerRealm = 1;
        if (playerId) {
          const [playerRow] = await db
            .select()
            .from(players)
            .where(eq(players.id, playerId))
            .limit(1);
          if (playerRow) {
            playerRealm = playerRow.realm;
          }
        }
        if (playerRealm < 3) {
          console.warn(`[Socket] 🚫 Player "${playerName || playerId}" blocked from map "${checkMap.name}" due to realm gate (realm=${playerRealm})`);
          socket.emit('error', { message: 'Tu vi chưa đủ Tam Chuyển, không thể tiến vào Nam Cương!' });
          return;
        }
      }
    } catch (err) {
      console.error('[Socket] Realm gate check failed:', err);
    }

    // Leave old map room and notify others
    if (currentMapId && currentMapId !== targetMapId) {
      socket.leave(`map:${currentMapId}`);
      socket.to(`map:${currentMapId}`).emit('player:left', { accountId });
    }

    socket.join(`map:${targetMapId}`);
    currentMapId = targetMapId;

    // Update position in cache
    let pos = playerPositions.get(accountId);
    if (!pos) {
      pos = {
        accountId,
        playerId: playerId ?? '',
        name: playerName ?? 'Unknown',
        mapId: targetMapId,
        x: targetX ?? 400,
        y: targetY ?? 300,
      };
      playerPositions.set(accountId, pos);
    } else {
      pos.mapId = targetMapId;
      if (targetX !== undefined && targetY !== undefined) {
        pos.x = targetX;
        pos.y = targetY;
      }
    }

    // Fallback sync from DB if x/y are missing
    if (targetX === undefined || targetY === undefined) {
      if (playerId) {
        const [playerRow] = await db
          .select()
          .from(players)
          .where(eq(players.id, playerId))
          .limit(1);
        if (playerRow) {
          pos.x = playerRow.current_x;
          pos.y = playerRow.current_y;
        }
      }
    }

    // Send current players in map
    const playersInMap: PlayerPosition[] = [];
    playerPositions.forEach((p) => {
      if (p.mapId === targetMapId) {
        playersInMap.push(p);
      }
    });
    socket.emit('map:players', playersInMap);

    // Sync map metadata, npcs, portals, and monsters
    try {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const isUuid = uuidRegex.test(targetMapId);

      let [map] = await db
        .select()
        .from(worldMaps)
        .where(
          isUuid
            ? or(eq(worldMaps.id, targetMapId), eq(worldMaps.name, targetMapId))
            : eq(worldMaps.name, targetMapId)
        )
        .limit(1);

      if (!map && (targetMapId === 'bac_nguyen_village' || targetMapId === 'lang_cothao')) {
        [map] = await db
          .select()
          .from(worldMaps)
          .where(eq(worldMaps.name, 'Làng Cổ Thảo'))
          .limit(1);
      }

      if (!map) {
        const firstMaps = await db.select().from(worldMaps).limit(1);
        map = firstMaps[0];
      }

      if (map) {
        console.log(`[Socket] ✅ Map found: "${map.name}" (id=${map.id}, region=${map.region})`);

        // Emit map metadata
        const safeSpawnX = (pos?.x !== undefined && pos?.x !== null && !isNaN(pos.x)) ? pos.x : 400;
        const safeSpawnY = (pos?.y !== undefined && pos?.y !== null && !isNaN(pos.y)) ? pos.y : 300;
        socket.emit('map:init', {
          id: map.id,
          name: map.name,
          region: map.region,
          width: map.width,
          height: map.height,
          background: map.background,
          spawnX: safeSpawnX,
          spawnY: safeSpawnY,
        });

        // Trigger reach map objectives update
        if (playerId) {
          void questService.handleReachMap(playerId, map.id, map.name);
        }

        // Fetch NPCs
        const npcList = await db.select().from(npcs).where(eq(npcs.map_id, map.id));
        socket.emit('map:npcs', npcList.map(n => ({
          id: n.id,
          name: n.name,
          sprite: n.sprite ?? n.role,
          x: n.x,
          y: n.y,
          hasShop: n.shop_id !== null,
          dialogueId: n.dialogue_id ?? null,
        })));

        // Fetch Portals
        const portals = await db.select().from(mapPortals).where(eq(mapPortals.from_map_id, map.id));
        const portalsWithTarget = [];
        for (const p of portals) {
          const [targetMap] = await db.select().from(worldMaps).where(eq(worldMaps.id, p.to_map_id)).limit(1);
          if (targetMap) {
            portalsWithTarget.push({
              id: p.id,
              from_x: p.from_x,
              from_y: p.from_y,
              to_x: p.to_x,
              to_y: p.to_y,
              portal_name: p.label ?? '',
              to_map_id: targetMap.id,
              to_map_name: targetMap.name,
            });
          }
        }
        socket.emit('map:portals', portalsWithTarget);

    // Initialize map monsters once if not done yet
    if (!initializedMaps.has(map.id)) {
      const spawns = await db.select().from(mapSpawns).where(eq(mapSpawns.map_id, map.id));
      console.log(`[Map:Join] 🔍 Found ${spawns.length} spawn records for map "${map.name}" (id=${map.id})`);
          for (const spawn of spawns) {
            const [tmpl] = await db.select().from(monsterTemplates).where(eq(monsterTemplates.id, spawn.monster_id)).limit(1);
            if (tmpl) {
              console.log(`[Map:Join] 🐾 Spawning "${tmpl.name}" at (${spawn.spawn_x},${spawn.spawn_y})`);
              const camelTemplate = {
                id: tmpl.id,
                name: tmpl.name,
                realm: tmpl.realm,
                hp: tmpl.hp,
                atk: tmpl.atk,
                def: tmpl.def,
                speed: tmpl.spd,
                element: 'physical' as const,
                sprite: tmpl.ai_type,
                dropTable: Array.isArray(tmpl.drop_table) ? (tmpl.drop_table as import('@co-dao/shared').DropEntry[]) : null,
                mapId: map.id,
                respawnTime: tmpl.respawn_time,
              };
              combatService.spawnMonster(camelTemplate, spawn.spawn_x, spawn.spawn_y);
            } else {
              console.warn(`[Map:Join] ⚠️ Monster NOT FOUND for monster_id="${spawn.monster_id}"`);
            }
          }
          initializedMaps.add(map.id);
        }

        const activeMonsters = combatService.getMonstersOnMap(map.id);

        // Emit monsters list to joiner
    console.log(`[Map:Join] 📊 Emitting monster:spawn — ${activeMonsters.length} active monsters for map "${map.name}"`);
    socket.emit('monster:spawn', activeMonsters.map(inst => ({
      instanceId: inst.instanceId,
          templateId: inst.templateId,
          name: inst.template.name,
          currentHp: inst.currentHp,
          maxHp: inst.template.hp,
          x: inst.x,
          y: inst.y,
          sprite: inst.template.sprite,
        })));

        console.log(`[Socket] 📤 Emitted map:init + ${npcList.length} NPCs + ${portalsWithTarget.length} portals + ${activeMonsters.length} monsters`);
      } else {
        console.warn(`[Socket] ⚠️ No map found for "${targetMapId}" — falling back to first map`);
        // Try one more time with first map
        const firstMaps = await db.select().from(worldMaps).limit(1);
        if (firstMaps.length > 0) {
          console.log(`[Socket] 🔄 Re-joining with first map: "${firstMaps[0].name}"`);
          socket.emit('map:join', { mapId: firstMaps[0].name });
        } else {
          console.error('[Socket] ❌ No maps in database at all — game world is empty!');
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[Socket] Map join sync failed:', msg);
      socket.emit('error', { message: `Map join failed: ${msg}` });
    }
  });

  // Leave map room
  socket.on('map:leave', (mapId: string) => {
    socket.leave(`map:${mapId}`);
  });

  socket.on('disconnect', () => {
    playerPositions.delete(accountId);
    // Broadcast player left to current map room
    socket.to(`map:${currentMapId}`).emit('player:left', { accountId });
  });

  socket.on('player:attack', async (data: { targetInstanceId: string; skillId?: string }) => {
    if (!playerId || !data.targetInstanceId) return;

    // Execute server-authoritative combat
    const result = await combatService.executePlayerAttack(playerId, data.targetInstanceId, data.skillId);
    if (!result) return;

    // Emit damage to attacker
    socket.emit('combat:result', {
      damage: result.damage,
      isCritical: result.isCritical,
      targetId: data.targetInstanceId,
      targetX: 0, // will be filled from monster position by client
      targetY: 0,
      damageType: result.damageType,
      targetDefeated: result.targetDefeated,
      drops: result.drops,
    });

    // If monster defeated, emit death to all players in map
    if (result.targetDefeated) {
      io.to(`map:${currentMapId}`).emit('monster:dead', {
        instanceId: data.targetInstanceId,
      });
    } else {
      // Emit HP update to all players
      io.to(`map:${currentMapId}`).emit('monster:update', {
        instanceId: data.targetInstanceId,
        currentHp: result.targetHpRemaining,
        maxHp: result.targetMaxHp,
      });
    }
  });
});

// ── Server Game Loop (20 ticks/sec) ──────────────────────────
let currentTick = 0;

setInterval(async () => {
  currentTick++;

  // 1. Tick status effects on all monsters
  try {
    const tickResults = combatService.tickAllMonsters(currentTick);
    for (const result of tickResults) {
      const monster = combatService.getMonsterInstance(result.instanceId);
      if (!monster) continue;

      const mapId = monster.template.mapId;
      if (result.defeated) {
        io.to(`map:${mapId}`).emit('monster:dead', {
          instanceId: result.instanceId,
        });
      } else if (result.damageTaken > 0) {
        io.to(`map:${mapId}`).emit('monster:update', {
          instanceId: result.instanceId,
          currentHp: monster.currentHp,
          maxHp: monster.template.hp,
        });
      }
    }
  } catch (err) {
    console.error('[Game Loop] Error ticking monsters:', err);
  }

  // 2. Monster AI (Targeting, Chasing, Attacks)
  try {
    // Group active players by map
    const playersByMap = new Map<string, Array<{ playerId: string; x: number; y: number; accountId: string }>>();
    playerPositions.forEach((pos) => {
      if (!pos.mapId) return;
      let mapPlayers = playersByMap.get(pos.mapId);
      if (!mapPlayers) {
        mapPlayers = [];
        playersByMap.set(pos.mapId, mapPlayers);
      }
      mapPlayers.push({
        playerId: pos.playerId,
        x: pos.x,
        y: pos.y,
        accountId: pos.accountId,
      });
    });

    // Run AI update for each map with players
    for (const [mapId, playersOnMap] of playersByMap.entries()) {
      const monsters = combatService.getMonstersOnMap(mapId);
      if (monsters.length === 0) continue;

      for (const monster of monsters) {
        if (monster.currentHp <= 0) continue;

        let targetPlayer = monster.targetId ? playersOnMap.find((p) => p.playerId === monster.targetId) : null;

        // If target is invalid (disconnected, left map, or too far), reset target
        if (targetPlayer) {
          const dx = targetPlayer.x - monster.x;
          const dy = targetPlayer.y - monster.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 400) {
            monster.targetId = null;
            targetPlayer = null;
          }
        }

        // If no target, scan for nearest player within aggro range (200px)
        if (!targetPlayer) {
          let closestPlayer = null;
          let minDist = Infinity;
          for (const p of playersOnMap) {
            const dx = p.x - monster.x;
            const dy = p.y - monster.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) {
              minDist = dist;
              closestPlayer = p;
            }
          }
          if (closestPlayer && minDist <= 200) {
            monster.targetId = closestPlayer.playerId;
            targetPlayer = closestPlayer;
          }
        }

        // If monster has a target player
        if (targetPlayer) {
          const dx = targetPlayer.x - monster.x;
          const dy = targetPlayer.y - monster.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Attack range is 50px
          if (dist <= 50) {
            const result = combatService.executeMonsterAttack(monster.instanceId, targetPlayer.playerId, currentTick);
            if (result) {
              // Deduct player HP
              const playerRow = await playerRepository.findById(targetPlayer.playerId);
              if (playerRow) {
                const newHp = Math.max(0, playerRow.hp - result.damage);
                await playerRepository.update(targetPlayer.playerId, { hp: newHp });

                // Sync damage to player
                io.to(`player:${targetPlayer.playerId}`).emit('player:damaged', {
                  damage: result.damage,
                  currentHp: newHp,
                  maxHp: 100, // standard baseline max HP
                });

                // Emit damage floating indicators to all players on the map
                io.to(`map:${mapId}`).emit('combat:result', {
                  damage: result.damage,
                  isCritical: result.isCritical,
                  targetX: targetPlayer.x,
                  targetY: targetPlayer.y,
                  isPlayerTarget: true, // indicates target is player, not monster
                });

                // Handle Player Death
                if (newHp <= 0) {
                  console.log(`[Game Loop] Player ${playerRow.name} died! Respawning at Làng Cổ Thảo.`);
                  await playerRepository.update(targetPlayer.playerId, {
                    hp: 100,
                    current_map: 'bac_nguyen_village',
                    current_x: 400,
                    current_y: 300,
                  });

                  // Update server cache to prevent ghost attacks
                  const cachedPos = playerPositions.get(targetPlayer.accountId);
                  if (cachedPos) {
                    cachedPos.mapId = 'bac_nguyen_village';
                    cachedPos.x = 400;
                    cachedPos.y = 300;
                  }

                  // Trigger respawn teleport on client
                  io.to(`player:${targetPlayer.playerId}`).emit('player:respawn', {
                    mapId: 'bac_nguyen_village',
                    x: 400,
                    y: 300,
                  });
                }
              }
            }
          } else {
            // Chase target player
            const monsterSpeed = monster.template.speed ?? 100;
            // Slower speed: multiply by 0.5
            const moveStep = (monsterSpeed * 0.5) / 20; // units to move in 50ms tick
            const angle = Math.atan2(dy, dx);

            let nextX = monster.x + Math.cos(angle) * moveStep;
            let nextY = monster.y + Math.sin(angle) * moveStep;

            // Separation logic to prevent overlapping with other monsters
            const minDistanceBetweenMonsters = 30; // 30px separation
            for (const other of monsters) {
              if (other.instanceId === monster.instanceId || other.currentHp <= 0) continue;
              const ox = nextX - other.x;
              const oy = nextY - other.y;
              const oDist = Math.sqrt(ox * ox + oy * oy);
              if (oDist < minDistanceBetweenMonsters) {
                // Apply a gentle push force away
                const pushForce = (minDistanceBetweenMonsters - oDist) * 0.3;
                const pushAngle = oDist > 0.1 ? Math.atan2(oy, ox) : Math.random() * Math.PI * 2;
                nextX += Math.cos(pushAngle) * pushForce;
                nextY += Math.sin(pushAngle) * pushForce;
              }
            }

            // Avoidance to prevent standing directly on top of the player
            const minPlayerDistance = 25; // Keep at least 25px away from player
            const playerDx = targetPlayer.x - nextX;
            const playerDy = targetPlayer.y - nextY;
            const playerDist = Math.sqrt(playerDx * playerDx + playerDy * playerDy);
            if (playerDist < minPlayerDistance) {
              const pushBackAngle = Math.atan2(playerDy, playerDx) + Math.PI;
              const pushBackForce = minPlayerDistance - playerDist;
              nextX += Math.cos(pushBackAngle) * pushBackForce;
              nextY += Math.sin(pushBackAngle) * pushBackForce;
            }

            monster.x = nextX;
            monster.y = nextY;

            // Broadcast monster movement update to all players on map (throttled to 10Hz)
            if (currentTick % 2 === 0) {
              io.to(`map:${mapId}`).emit('monster:move', {
                instanceId: monster.instanceId,
                x: monster.x,
                y: monster.y,
              });
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('[Game Loop] Error updating AI:', err);
  }
}, 50);

export { app, config, httpServer, io };
