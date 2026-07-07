import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { BootScene } from '../game/BootScene.js';
import { PreloadScene } from '../game/PreloadScene.js';
import { GameScene } from '../game/GameScene.js';
import { UIScene } from '../game/UIScene.js';
import { useAuthStore } from '../store/auth.js';
import { useSocket } from '../hooks/useSocket.js';
import { api } from '../api/client.js';
import CharacterPanel from '../components/CharacterPanel.js';
import GameHUD from '../components/GameHUD.js';
import CraftPanel from '../components/CraftPanel.js';
import { DialoguePanel } from '../components/DialoguePanel.js';
import { QuestTracker } from '../components/QuestTracker.js';
import ShopPanel from '../components/ShopPanel.js';
import CharacterCreationPanel from '../components/CharacterCreationPanel.js';

export default function GamePage(): React.ReactElement {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { player, setPlayer } = useAuthStore();
  const [needsCreation, setNeedsCreation] = useState(false);
  useSocket();

  useEffect(() => {
    if (!player) {
      api.getProfile()
        .then((res) => {
          if (res.data) {
            setPlayer({ id: res.data.id, name: res.data.name });
          }
        })
        .catch(() => {
          // No player yet — show character creation
          setNeedsCreation(true);
        });
    }
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


  if (needsCreation) {
    return (
      <CharacterCreationPanel
        onCreated={(id, name) => {
          setPlayer({ id, name });
          setNeedsCreation(false);
        }}
      />
    );
  }

  return (
    <div className="h-dvh bg-gu-darker relative overflow-hidden" style={{ touchAction: 'manipulation' }}>
      {/* Game area — fills entire viewport */}
      <div className="absolute inset-0 bg-gu-darker overflow-hidden">
        {/* Phaser canvas wrapper - rendered first so React overlays sit on top */}
        <div
          ref={containerRef}
          className="absolute inset-0 w-full h-full z-0"
        />
        <CharacterPanel />
        <GameHUD />
        <CraftPanel />
        <DialoguePanel />
        <QuestTracker />
        <ShopPanel />
      </div>
    </div>
  );
}
