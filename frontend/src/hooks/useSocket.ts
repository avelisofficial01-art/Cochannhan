import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGameStore, type MonsterSprite, type CombatResult } from '../store/gameStore.js';
import { useAuthStore } from '../store/auth.js';

export function useSocket(): { isConnected: boolean } {
  const socketRef = useRef<Socket | null>(null);
  const { token, player } = useAuthStore();
  const {
    setConnected,
    updatePlayer,
    setPlayers,
    setPosition,
    setMonsters,
    setCombatResult,
  } = useGameStore();

  useEffect(() => {
    if (!token) return;

    const socket = io('/', {
      auth: {
        token,
        accountId: player?.id ?? '',
        playerId: player?.id ?? '',
        playerName: player?.name ?? 'Unknown',
      },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Socket] ✅ Connected. Emitting map:join for "bac_nguyen_village"');
      setConnected(true);
      socket.emit('map:join', 'bac_nguyen_village');
    });

    socket.on('disconnect', (reason) => {
      console.warn(`[Socket] ⚠️ Disconnected — reason: "${reason}"`);
      setConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] 🔴 Connection error:', err.message);
      setConnected(false);
    });

    socket.on('player:update', (data) => {
      updatePlayer(data);
    });

    socket.on('map:players', (data) => {
      setPlayers(data);
    });

    socket.on('player:left', (data: { accountId: string }) => {
      const currentMap = useGameStore.getState().players;
      const asArray = Array.from(currentMap.values());
      setPlayers(asArray.filter((p) => p.accountId !== data.accountId));
    });

    // ── Combat events ────────────────────────────────

    socket.on('monster:spawn', (monsters: MonsterSprite[]) => {
      console.log(`[Socket] 📥 Received monster:spawn — ${monsters.length} monsters`);
      setMonsters(monsters);
      // Also notify GameScene to render them (in case scene registers late)
    });

    socket.on('monster:dead', (data: { instanceId: string }) => {
      const currentMonsters = useGameStore.getState().monsters;
      const deadMonster = currentMonsters.find((m) => m.instanceId === data.instanceId);
      if (deadMonster && deadMonster.name === 'Bạch Lang Vương') {
        console.log('[Socket] 📥 Bạch Lang Vương defeated! Triggering ending cutscene.');
        emitToGameScene('monster:dead', { instanceId: data.instanceId, name: 'Bạch Lang Vương' });
      }

      setMonsters(currentMonsters.filter(
        (m) => m.instanceId !== data.instanceId,
      ));
    });

    socket.on('monster:update', (data: { instanceId: string; currentHp: number; maxHp: number }) => {
      const current = useGameStore.getState().monsters;
      const idx = current.findIndex((m) => m.instanceId === data.instanceId);
      if (idx >= 0) {
        const updated = [...current];
        updated[idx] = { ...updated[idx], currentHp: data.currentHp, maxHp: data.maxHp };
        setMonsters(updated);
      }
    });

    socket.on('monster:move', (data: { instanceId: string; x: number; y: number }) => {
      const current = useGameStore.getState().monsters;
      const idx = current.findIndex((m) => m.instanceId === data.instanceId);
      if (idx >= 0) {
        const updated = [...current];
        updated[idx] = { ...updated[idx], x: data.x, y: data.y };
        setMonsters(updated);
      }
    });

    socket.on('player:damaged', (data: { damage: number; currentHp: number; maxHp: number }) => {
      console.log(`[Socket] 📥 Received player:damaged event: -${data.damage} hp`);
      emitToGameScene('player:damaged', data);
    });

    socket.on('player:respawn', (data: { mapId: string; x: number; y: number }) => {
      console.log(`[Socket] 📥 Player died! Respawning at map: ${data.mapId}`);
      useGameStore.getState().setMap(data.mapId);
      useGameStore.getState().setPosition(data.x, data.y);
      emitToGameScene('player:respawn', data);
    });

    socket.on('combat:result', (data: { damage: number; isCritical: boolean; targetX?: number; targetY?: number }) => {
      const result: CombatResult = {
        damage: data.damage,
        isCritical: data.isCritical,
        targetX: data.targetX ?? 0,
        targetY: data.targetY ?? 0,
      };
      setCombatResult(result);
      // Auto-clear after 1.2s (animation duration)
      setTimeout(() => setCombatResult(null), 1200);
    });

    socket.on('quest:updated', (activeQuests: unknown[]) => {
      console.log('[Socket] 📥 Received quest:updated event');
      useGameStore.getState().setActiveQuests(activeQuests);
    });

    // ── Map synchronization events ───────────────────
    // Helper: emit to GameScene with retry (fixes race condition where socket
    // connects before GameScene.create() registers its event listeners)
    const emitToGameScene = (eventName: string, payload: unknown, maxRetries = 30): void => {
      let attempt = 0;
      const tryEmit = (retriesLeft: number): void => {
        attempt++;
        const game = (window as unknown as Record<string, unknown>).__phaserGame as Phaser.Game | undefined;
        const scene = game?.scene.getScene('GameScene');
        // Check if the scene is active (i.e. create() has completed)
        if (scene && scene.sys.isActive()) {
          if (attempt > 1) console.log(`[Socket] ✅ emitToGameScene("${eventName}") succeeded on attempt ${attempt}`);
          scene.events.emit(eventName, payload);
        } else if (retriesLeft > 0) {
          // Retry every 100ms — up to 3 seconds total wait
          setTimeout(() => tryEmit(retriesLeft - 1), 100);
        } else {
          console.warn(`[Socket] ⚠️ emitToGameScene("${eventName}") gave up after ${attempt} attempts — GameScene not active`);
        }
      };
      tryEmit(maxRetries);
    };

    // ── Diagnostic: confirm server received our request ──
    socket.on('map:join:ack', (data: { received: boolean; targetMapId: string }) => {
      console.log(`[Socket] 📨 Server ACK — map:join received for "${data.targetMapId}"`);
    });

    socket.on('error', (data: { message: string }) => {
      console.error(`[Socket] 🔴 Server error: ${data.message}`);
    });

    socket.on('map:init', (data: { id: string; name: string; region: string; width: number; height: number; background: string }) => {
      console.log(`[Socket] 📥 Received map:init — "${data.name}" (${data.width}x${data.height})`);
      useGameStore.getState().setMap(data.id);
      emitToGameScene('map:init', data);
    });

    socket.on('map:npcs', (npcs: Array<{ id: string; name: string; sprite: string; x: number; y: number; hasShop: boolean }>) => {
      console.log(`[Socket] 📥 Received map:npcs — ${npcs.length} NPCs`);
      emitToGameScene('map:npcs', npcs);
    });

    socket.on('map:portals', (portals: Array<{ id: string; from_x: number; from_y: number; portal_name: string; to_map_id: string; to_map_name: string; to_x: number; to_y: number }>) => {
      console.log(`[Socket] 📥 Received map:portals — ${portals.length} portals`);
      emitToGameScene('map:portals', portals);
    });

    return (): void => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [token, player, setConnected, updatePlayer, setPlayers, setMonsters, setCombatResult]);

  const emitMove = useCallback(
    (mapId: string, x: number, y: number): void => {
      const socket = socketRef.current;
      if (!socket?.connected) return;
      socket.emit('player:move', { mapId, x, y });
      setPosition(x, y);
    },
    [setPosition],
  );

  const emitMapJoin = useCallback(
    (input: string | { mapId: string; x?: number; y?: number }): void => {
      const socket = socketRef.current;
      if (!socket?.connected) return;
      socket.emit('map:join', input);
    },
    [],
  );

  const emitAttack = useCallback(
    (instanceId: string): void => {
      const socket = socketRef.current;
      if (!socket?.connected) return;
      socket.emit('player:attack', { targetInstanceId: instanceId });
    },
    [],
  );

  // Expose bridges globally for Phaser scene
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__socketEmitMove = emitMove;
    (window as unknown as Record<string, unknown>).__socketEmitMapJoin = emitMapJoin;
    (window as unknown as Record<string, unknown>).__socketEmitAttack = emitAttack;
    return (): void => {
      delete (window as unknown as Record<string, unknown>).__socketEmitMove;
      delete (window as unknown as Record<string, unknown>).__socketEmitMapJoin;
      delete (window as unknown as Record<string, unknown>).__socketEmitAttack;
    };
  }, [emitMove, emitMapJoin, emitAttack]);

  const isConnected = useGameStore((s) => s.isConnected);
  return { isConnected };
}
