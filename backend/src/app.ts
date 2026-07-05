import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { db } from './database/connection.js';
import { worldMaps, mapPortals, mapSpawns, monsterTemplates, npcTemplates, questTemplates, players } from './database/schema/index.js';
import { eq, or } from 'drizzle-orm';
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
  pingInterval: 5000,
  pingTimeout: 15000,
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

// Body parsing
app.use(express.json({ limit: '1mb' }));

// Rate limiting (basic in-memory for dev)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
app.use('/api/auth/login', (req, res, next) => {
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
app.use('/api/cultivation', cultivationRouter);
app.use('/api/save', saveRouter);

// Health check
app.get('/api/health', async (_req, res) => {
  try {
    const [mapsCount, npcsCount, monstersCount, questsCount] = await Promise.all([
      db.select().from(worldMaps).then(r => r.length),
      db.select().from(npcTemplates).then(r => r.length),
      db.select().from(monsterTemplates).then(r => r.length),
      db.select().from(questTemplates).then(r => r.length),
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

// Serve frontend static files in production
if (config.nodeEnv === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const frontendDist = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDist));
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

    // Leave old map room and notify others
    if (currentMapId && currentMapId !== targetMapId) {
      socket.leave(`map:${currentMapId}`);
      socket.to(`map:${currentMapId}`).emit('player:left', { accountId });
    }

    socket.join(`map:${targetMapId}`);
    currentMapId = targetMapId;

    // Update position in cache
    const pos = playerPositions.get(accountId);
    if (pos) {
      pos.mapId = targetMapId;
      if (targetX !== undefined && targetY !== undefined) {
        pos.x = targetX;
        pos.y = targetY;
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
        socket.emit('map:init', {
          id: map.id,
          name: map.name,
          region: map.region,
          width: map.width,
          height: map.height,
          background: map.background,
        });

        // Trigger reach map objectives update
        if (playerId) {
          void questService.handleReachMap(playerId, map.id, map.name);
        }

        // Fetch NPCs
        const npcs = await db.select().from(npcTemplates).where(eq(npcTemplates.map_id, map.id));
        socket.emit('map:npcs', npcs.map(n => ({
          id: n.id,
          name: n.name,
          sprite: n.sprite,
          x: n.x,
          y: n.y,
          hasShop: n.has_shop === 'true',
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
              portal_name: p.portal_name,
              to_map_id: targetMap.id,
              to_map_name: targetMap.name,
            });
          }
        }
        socket.emit('map:portals', portalsWithTarget);

        // Initialize map monsters once if not done yet
        if (!initializedMaps.has(map.id)) {
          const spawns = await db.select().from(mapSpawns).where(eq(mapSpawns.map_id, map.id));
          for (const spawn of spawns) {
            if (spawn.spawn_type === 'monster' || spawn.spawn_type === 'boss') {
              const [tmpl] = await db.select().from(monsterTemplates).where(eq(monsterTemplates.name, spawn.spawn_ref)).limit(1);
              if (tmpl) {
                const camelTemplate = {
                  id: tmpl.id,
                  name: tmpl.name,
                  realm: tmpl.realm,
                  hp: tmpl.hp,
                  atk: tmpl.atk,
                  def: tmpl.def,
                  speed: tmpl.speed,
                  element: tmpl.element as 'physical' | 'fire' | 'water' | 'lightning' | 'wind' | 'earth' | 'wood' | 'ice' | 'poison' | 'blood' | 'soul' | 'space' | 'time' | 'light' | 'dark',
                  sprite: tmpl.sprite,
                  dropTable: tmpl.drop_table ? JSON.parse(tmpl.drop_table) : null,
                  mapId: map.id,
                  respawnTime: tmpl.respawn_time,
                };
                combatService.spawnMonster(camelTemplate, spawn.x, spawn.y);
              }
            }
          }
          initializedMaps.add(map.id);
        }

        const activeMonsters = combatService.getMonstersOnMap(map.id);

        // Emit monsters list to joiner
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

        console.log(`[Socket] 📤 Emitted map:init + ${npcs.length} NPCs + ${portalsWithTarget.length} portals + ${activeMonsters.length} monsters`);
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

  // ── Combat: Player Attack (server-authoritative) ─────────
  socket.on('player:attack', async (data: { targetInstanceId: string }) => {
    if (!playerId || !data.targetInstanceId) return;

    // Execute server-authoritative combat
    const result = await combatService.executePlayerAttack(playerId, data.targetInstanceId);
    if (!result) return;

    // Emit damage to attacker
    socket.emit('combat:result', {
      damage: result.damage,
      isCritical: result.isCritical,
      targetX: 0, // will be filled from monster position by client
      targetY: 0,
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
            const moveStep = monsterSpeed / 20; // units to move in 50ms tick
            const angle = Math.atan2(dy, dx);
            monster.x += Math.cos(angle) * moveStep;
            monster.y += Math.sin(angle) * moveStep;

            // Broadcast monster movement update to all players on map
            io.to(`map:${mapId}`).emit('monster:move', {
              instanceId: monster.instanceId,
              x: monster.x,
              y: monster.y,
            });
          }
        }
      }
    }
  } catch (err) {
    console.error('[Game Loop] Error updating AI:', err);
  }
}, 50);

export { app, config, httpServer, io };
