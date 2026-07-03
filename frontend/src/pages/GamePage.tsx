import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { BootScene } from '../game/BootScene.js';
import { PreloadScene } from '../game/PreloadScene.js';
import { GameScene } from '../game/GameScene.js';
import { UIScene } from '../game/UIScene.js';
import { useSocket } from '../hooks/useSocket.js';
import GuPanel from '../components/GuPanel.js';
import EquipmentPanel from '../components/EquipmentPanel.js';
import CraftPanel from '../components/CraftPanel.js';

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
      scene: [BootScene, PreloadScene, GameScene, UIScene],
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
      {/* Top bar — compact on mobile */}
      <header className="w-full flex items-center justify-between px-3 py-2 md:px-6 md:py-3 bg-gu-dark border-b border-gu-border">
        <h1 className="text-base md:text-lg font-bold text-gu-accent">
          CỔ ĐẠO
        </h1>
        <div className="flex items-center gap-2 md:gap-4">
          <span className={`text-xs md:text-sm ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {isConnected ? '●' : '○'}
          </span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 md:px-4 md:py-1.5 text-xs md:text-sm border border-gu-border rounded hover:bg-gu-border/30 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Game area — full width, no max-w clamp */}
      <div className="relative w-full flex-1 flex items-center justify-center bg-gu-darker">
        <GuPanel />
        <EquipmentPanel />
        <CraftPanel />
        <div
          ref={containerRef}
          className="flex-1 h-full"
        />
      </div>

      {/* Bottom hint — hidden on mobile (touch controls in UIScene) */}
      <footer className="w-full px-3 py-1 md:px-6 md:py-2 text-xs text-gray-500 text-center border-t border-gu-border hidden md:block">
        Arrow keys to move | G = Gu | E = Equipment | C = Craft
      </footer>
    </div>
  );
}
