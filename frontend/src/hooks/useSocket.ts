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

    const socket = io('http://localhost:3000', {
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

    // ── Combat events ────────────────────────────────

    socket.on('monster:spawn', (monsters: MonsterSprite[]) => {
      setMonsters(monsters);
    });

    socket.on('monster:dead', (data: { instanceId: string }) => {
      setMonsters(useGameStore.getState().monsters.filter(
        (m) => m.instanceId !== data.instanceId,
      ));
    });

    socket.on('monster:update', (data: MonsterSprite) => {
      const current = useGameStore.getState().monsters;
      const idx = current.findIndex((m) => m.instanceId === data.instanceId);
      if (idx >= 0) {
        const updated = [...current];
        updated[idx] = { ...updated[idx], ...data };
        setMonsters(updated);
      }
    });

    socket.on('combat:result', (data: { damage: number; isCritical: boolean; targetX: number; targetY: number }) => {
      const result: CombatResult = {
        damage: data.damage,
        isCritical: data.isCritical,
        targetX: data.targetX,
        targetY: data.targetY,
      };
      setCombatResult(result);
      // Auto-clear after 1.2s (animation duration)
      setTimeout(() => setCombatResult(null), 1200);
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
    (window as unknown as Record<string, unknown>).__socketEmitAttack = emitAttack;
    return (): void => {
      delete (window as unknown as Record<string, unknown>).__socketEmitMove;
      delete (window as unknown as Record<string, unknown>).__socketEmitAttack;
    };
  }, [emitMove, emitAttack]);

  const isConnected = useGameStore((s) => s.isConnected);
  return { isConnected };
}
