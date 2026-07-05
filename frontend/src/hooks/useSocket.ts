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
      setConnected(true);
      socket.emit('map:join', 'bac_nguyen_village');
    });

    socket.on('disconnect', (_reason) => {
      setConnected(false);
    });

    socket.on('connect_error', (_err) => {
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
      setMonsters(monsters);
    });

    socket.on('monster:dead', (data: { instanceId: string }) => {
      const currentMonsters = useGameStore.getState().monsters;
      const deadMonster = currentMonsters.find((m) => m.instanceId === data.instanceId);
      if (deadMonster && deadMonster.name === 'Bạch Lang Vương') {
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
      emitToGameScene('player:damaged', data);
    });

    socket.on('player:respawn', (data: { mapId: string; x: number; y: number }) => {
      useGameStore.getState().setMap(data.mapId);
      useGameStore.getState().setPosition(data.x, data.y);
      emitToGameScene('player:respawn', data);
    });

    socket.on('combat:result', (data: { damage: number; isCritical: boolean; targetId?: string; targetX?: number; targetY?: number; damageType?: string; targetDefeated?: boolean; drops?: Array<{ itemName: string; quantity: number }> }) => {
      let x = data.targetX ?? 0;
      let y = data.targetY ?? 0;

      if (data.targetId) {
        const mon = useGameStore.getState().monsters.find((m) => m.instanceId === data.targetId);
        if (mon) {
          x = mon.x;
          y = mon.y;
        }
      }

      const result: CombatResult = {
        damage: data.damage,
        isCritical: data.isCritical,
        targetX: x,
        targetY: y,
        damageType: data.damageType,
        targetDefeated: data.targetDefeated,
        drops: data.drops,
      };
      setCombatResult(result);
      setTimeout(() => setCombatResult(null), 1200);
    });

    socket.on('quest:updated', (activeQuests: unknown[]) => {
      useGameStore.getState().setActiveQuests(activeQuests);
    });

    // ── Map synchronization events ───────────────────
    const emitToGameScene = (eventName: string, payload: unknown, maxRetries = 30): void => {
      const tryEmit = (retriesLeft: number): void => {
        const game = (window as unknown as Record<string, unknown>).__phaserGame as Phaser.Game | undefined;
        const scene = game?.scene.getScene('GameScene');
        if (scene && scene.sys.isActive()) {
          scene.events.emit(eventName, payload);
        } else if (retriesLeft > 0) {
          setTimeout(() => tryEmit(retriesLeft - 1), 100);
        }
      };
      tryEmit(maxRetries);
    };

    socket.on('map:init', (data: { id: string; name: string; region: string; width: number; height: number; background: string }) => {
      useGameStore.getState().setMap(data.id);
      emitToGameScene('map:init', data);
    });

    socket.on('map:npcs', (npcs: Array<{ id: string; name: string; sprite: string; x: number; y: number; hasShop: boolean }>) => {
      emitToGameScene('map:npcs', npcs);
    });

    socket.on('map:portals', (portals: Array<{ id: string; from_x: number; from_y: number; portal_name: string; to_map_id: string; to_map_name: string; to_x: number; to_y: number }>) => {
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
    (instanceId: string, skillId?: string): void => {
      const socket = socketRef.current;
      if (!socket?.connected) return;
      socket.emit('player:attack', { targetInstanceId: instanceId, skillId });
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
