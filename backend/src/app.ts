import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import authRouter from './auth/auth.route.js';
import playerRouter from './player/player.route.js';
import worldRouter from './world/world.route.js';
import npcRouter from './npc/npc.route.js';
import questRouter from './quest/quest.route.js';
import inventoryRouter from './inventory/inventory.route.js';
import monsterRouter from './monster/monster.route.js';
import combatRouter from './combat/combat.route.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';
import { config } from './config/index.js';

const app = express();
const httpServer = createServer(app);

// Socket.IO
const io = new SocketIOServer(httpServer, {
  cors: { origin: config.corsOrigins, credentials: true },
  pingInterval: 5000,
  pingTimeout: 15000,
});

// Security
app.use(helmet());
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

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    data: { status: 'ok', timestamp: new Date().toISOString() },
  });
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

// ─── Socket.IO: Player Movement ──────────────────────────────

interface PlayerPosition {
  accountId: string;
  playerId: string;
  name: string;
  mapId: string;
  x: number;
  y: number;
}

const playerPositions = new Map<string, PlayerPosition>();

io.on('connection', (socket) => {
  // Authentication: expect JWT token in handshake auth
  const token = socket.handshake.auth?.token as string | undefined;
  if (!token) {
    socket.disconnect(true);
    return;
  }

  // Token will be verified by the auth middleware; for now store the raw info
  const accountId = socket.handshake.auth?.accountId as string | undefined;
  if (!accountId) {
    socket.disconnect(true);
    return;
  }

  socket.join(`account:${accountId}`);

  // Player move
  socket.on('player:move', (data: { mapId: string; x: number; y: number }) => {
    const pos: PlayerPosition = {
      accountId,
      playerId: socket.handshake.auth.playerId as string ?? '',
      name: socket.handshake.auth.playerName as string ?? 'Unknown',
      mapId: data.mapId,
      x: data.x,
      y: data.y,
    };

    playerPositions.set(accountId, pos);

    // Broadcast to all players in the same map
    socket.to(`map:${data.mapId}`).emit('player:update', pos);
    socket.emit('player:update', pos);
  });

  // Join map room
  socket.on('map:join', (mapId: string) => {
    socket.join(`map:${mapId}`);

    // Send current players in map
    const playersInMap: PlayerPosition[] = [];
    playerPositions.forEach((pos) => {
      if (pos.mapId === mapId) {
        playersInMap.push(pos);
      }
    });
    socket.emit('map:players', playersInMap);
  });

  // Leave map room
  socket.on('map:leave', (mapId: string) => {
    socket.leave(`map:${mapId}`);
  });

  socket.on('disconnect', () => {
    playerPositions.delete(accountId);
  });

  // ── Combat: Player Attack ──────────────────────────────
  socket.on('player:attack', (data: { targetInstanceId: string }) => {
    const playerId = socket.handshake.auth.playerId as string;
    if (!playerId || !data.targetInstanceId) return;

    // Verify token
    if (!token) return;

    // Attack logic handled by combat service
    // For real-time, emit to map room for rendering
    socket.to(`map:${socket.handshake.auth.currentMap as string ?? 'bac_nguyen_village'}`).emit('combat:attack', {
      attackerId: playerId,
      targetInstanceId: data.targetInstanceId,
    });
  });
});

export { app, config, httpServer, io };
