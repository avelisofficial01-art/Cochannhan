import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { GameScene } from '../game/GameScene.js';
import { useSocket } from '../hooks/useSocket.js';

export default function GamePage(): React.ReactElement {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isConnected } = useSocket();

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerRef.current,
      backgroundColor: '#1a1a2e',
      scene: [GameScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
        },
      },
    };

    gameRef.current = new Phaser.Game(config);

    return (): void => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gu-darker flex flex-col items-center">
      {/* Top bar */}
      <header className="w-full max-w-4xl flex items-center justify-between px-6 py-3 bg-gu-dark border-b border-gu-border">
        <h1 className="text-lg font-bold text-gu-accent">
          CỔ ĐẠO
        </h1>
        <div className="flex items-center gap-4">
          <span className={`text-sm ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {isConnected ? '● Connected' : '○ Disconnected'}
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 text-sm border border-gu-border rounded hover:bg-gu-border/30 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Game area */}
      <div
        ref={containerRef}
        className="w-full max-w-4xl flex-1 flex items-center justify-center bg-gu-darker"
      />

      {/* Bottom hint */}
      <footer className="w-full max-w-4xl px-6 py-2 text-xs text-gray-500 text-center border-t border-gu-border">
        Arrow keys to move — Sprint 1: Player &amp; World
      </footer>
    </div>
  );
}
