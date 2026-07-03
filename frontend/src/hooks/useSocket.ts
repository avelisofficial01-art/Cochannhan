import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGameStore } from '../store/gameStore.js';
import { useAuthStore } from '../store/auth.js';

export function useSocket(): { isConnected: boolean } {
  const socketRef = useRef<Socket | null>(null);
  const { token, player } = useAuthStore();
  const { setConnected, updatePlayer, setPlayers, setPosition } = useGameStore();

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

    return (): void => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [token, player, setConnected, updatePlayer, setPlayers]);

  const emitMove = useCallback(
    (mapId: string, x: number, y: number): void => {
      const socket = socketRef.current;
      if (!socket?.connected) return;
      socket.emit('player:move', { mapId, x, y });
      setPosition(x, y);
    },
    [setPosition],
  );

  // Expose emitMove globally for Phaser scene
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__socketEmitMove = emitMove;
    return (): void => {
      delete (window as unknown as Record<string, unknown>).__socketEmitMove;
    };
  }, [emitMove]);

  const isConnected = useGameStore((s) => s.isConnected);
  return { isConnected };
}
