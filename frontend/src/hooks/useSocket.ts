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

    socket.on('disconnect', () => {
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
      setMonsters(useGameStore.getState().monsters.filter(
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

    socket.on('combat:result', (data: { damage: number; isCritical: boolean }) => {
      const result: CombatResult = {
        damage: data.damage,
        isCritical: data.isCritical,
        targetX: 0,
        targetY: 0,
      };
      setCombatResult(result);
      // Auto-clear after 1.2s (animation duration)
      setTimeout(() => setCombatResult(null), 1200);
    });

    // ── Map synchronization events ───────────────────
    socket.on('map:init', (data: { id: string; name: string; region: string; width: number; height: number; background: string }) => {
      useGameStore.getState().setMap(data.id);
      const game = (window as unknown as Record<string, unknown>).__phaserGame as Phaser.Game | undefined;
      const scene = game?.scene.getScene('GameScene');
      if (scene) {
        scene.events.emit('map:init', data);
      }
    });

    socket.on('map:npcs', (npcs: Array<{ id: string; name: string; sprite: string; x: number; y: number; hasShop: boolean }>) => {
      const game = (window as unknown as Record<string, unknown>).__phaserGame as Phaser.Game | undefined;
      const scene = game?.scene.getScene('GameScene');
      if (scene) {
        scene.events.emit('map:npcs', npcs);
      }
    });

    socket.on('map:portals', (portals: Array<{ id: string; from_x: number; from_y: number; portal_name: string; to_map_id: string; to_map_name: string; to_x: number; to_y: number }>) => {
      const game = (window as unknown as Record<string, unknown>).__phaserGame as Phaser.Game | undefined;
      const scene = game?.scene.getScene('GameScene');
      if (scene) {
        scene.events.emit('map:portals', portals);
      }
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
