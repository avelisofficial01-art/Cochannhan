import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { BootScene } from '../game/BootScene.js';
import { PreloadScene } from '../game/PreloadScene.js';
import { GameScene } from '../game/GameScene.js';
import { UIScene } from '../game/UIScene.js';
import { useSocket } from '../hooks/useSocket.js';
import { useAuthStore } from '../store/auth.js';
import { api } from '../api/client.js';
import CharacterPanel from '../components/CharacterPanel.js';
import GameHUD from '../components/GameHUD.js';
import CraftPanel from '../components/CraftPanel.js';
import { DialoguePanel } from '../components/DialoguePanel.js';
import { QuestTracker } from '../components/QuestTracker.js';

export default function GamePage(): React.ReactElement {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isConnected } = useSocket();
  const { player, setPlayer } = useAuthStore();

  useEffect(() => {
    if (!player) {
      api.getProfile()
        .then((res) => {
          if (res.data) {
            setPlayer({ id: res.data.id, name: res.data.name });
          }
        })
        .catch(() => {
          // If profile returns 404, auto-create player
          api.createPlayer('Hành giả')
            .then((res) => {
              if (res.data?.player) {
                setPlayer({ id: res.data.player.id, name: res.data.player.name });
              }
            })
            .catch(() => {});
        });
    }

    // Health check: verify database has game data
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        const db = data?.data?.database;
        console.log(`[Health] 🏥 API status: maps=${db?.maps ?? '?'} npcs=${db?.npcs ?? '?'} monsters=${db?.monsters ?? '?'} quests=${db?.quests ?? '?'}`);
        if (!db || db.maps === 0) {
          console.error('[Health] 🔴 DATABASE EMPTY — no maps, NPCs, or monsters! Game world will be blank.');
        } else {
          console.log(`[Health] ✅ Database populated — ${db.maps} maps, ${db.npcs} NPCs, ${db.monsters} monsters`);
        }
      })
      .catch((err) => {
        console.error('[Health] 🔴 Health check failed:', err);
      });
  }, [player, setPlayer]);

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

    const game = new Phaser.Game(config);
    gameRef.current = game;
    (window as unknown as Record<string, unknown>).__phaserGame = game;

    return (): void => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
        delete (window as unknown as Record<string, unknown>).__phaserGame;
      }
    };
  }, []);

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  };

  return (
    <div className="h-dvh bg-gu-darker flex flex-col overflow-hidden" style={{ touchAction: 'manipulation' }}>
      {/* Top bar — super compact on mobile */}
      <header className="w-full flex items-center justify-between px-2 py-1 bg-gu-dark border-b border-gu-border shrink-0">
        <h1 className="text-sm font-bold text-gu-accent">CỔ ĐẠO</h1>
        <div className="flex items-center gap-1">
          <span className={`text-[10px] ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {isConnected ? '●' : '○'}
          </span>
          <button
            onClick={handleLogout}
            className="px-2 py-0.5 text-[10px] border border-gu-border rounded hover:bg-gu-border/30"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Game area — fills remaining viewport */}
      <div className="relative w-full flex-1 bg-gu-darker overflow-hidden">
        <CharacterPanel />
        <GameHUD />
        <CraftPanel />
        <DialoguePanel />
        <QuestTracker />
        <div
          ref={containerRef}
          className="w-full h-full"
        />
      </div>

      {/* Bottom hint — hidden on mobile */}
      <footer className="w-full px-3 py-1 md:px-6 md:py-2 text-xs text-gray-500 text-center border-t border-gu-border hidden md:block">
        Phím mũi tên để di chuyển | C: Nhân Vật | V: Chế Tạo | 1, 2, 3: Sử dụng kỹ năng Cổ Trùng
      </footer>
    </div>
  );
}
