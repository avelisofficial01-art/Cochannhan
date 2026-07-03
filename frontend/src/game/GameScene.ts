import Phaser from 'phaser';
import { preloadScene, getMapKey, getPlayerKey } from './AssetManager.js';

/**
 * GameScene — Map rendering and player movement.
 * Sprint 1: Tilemap background + player sprite + arrow-key movement.
 *
 * All asset references go through AssetManager — no hardcoded paths.
 * If an asset fails to load, the scene falls back to geometric placeholders.
 */
export class GameScene extends Phaser.Scene {
  private playerSprite!: Phaser.GameObjects.Rectangle;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private playerX = 400;
  private playerY = 300;
  private readonly moveSpeed = 200;

  /** Current map ID received from game state (default: Bắc Nguyên) */
  private mapId = 'bnp';

  constructor() {
    super({ key: 'GameScene' });
  }

  /* ───────────────────────────────────────
   *  Preload — register all assets via AssetManager
   * ─────────────────────────────────────── */
  preload(): void {
    preloadScene(this);
  }

  /* ───────────────────────────────────────
   *  Create — build the scene from loaded assets
   * ─────────────────────────────────────── */
  create(): void {
    this.cameras.main.setBackgroundColor('#1a1a2e');

    /* ── Map background (try loaded asset, fallback to grid) ── */
    const mapKey = getMapKey(this.mapId);
    if (this.textures.exists(mapKey)) {
      this.add.image(400, 300, mapKey).setDisplaySize(800, 600);
    } else {
      this.drawGridFallback();
    }

    /* ── Map title ── */
    this.add
      .text(400, 20, 'Bắc Nguyên — Village', {
        fontSize: '16px',
        color: '#cccccc',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    /* ── Player sprite (try loaded asset, fallback to rectangle) ── */
    const playerKey = getPlayerKey();
    if (this.textures.exists(playerKey)) {
      const img = this.add.image(this.playerX, this.playerY, playerKey);
      img.setDisplaySize(32, 32);
      // Re-use the same tracking via a reference wrapper
      this.playerSprite = this.add.rectangle(this.playerX, this.playerY, 0, 0).setVisible(false);
      this._playerImage = img;
    } else {
      this.playerSprite = this.add.rectangle(this.playerX, this.playerY, 32, 32, 0x00ff88);
      this.playerSprite.setStrokeStyle(2, 0xffffff);
    }

    /* ── Player name label ── */
    this.add
      .text(this.playerX, this.playerY - 24, 'You', {
        fontSize: '12px',
        color: '#00ff88',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
      .setName('playerLabel');

    /* ── Input ── */
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    /* ── Hint ── */
    this.add
      .text(400, 580, 'Use Arrow Keys to move', {
        fontSize: '12px',
        color: '#666666',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);
  }

  /* ───────────────────────────────────────
   *  Update — movement loop (called every frame)
   * ─────────────────────────────────────── */
  update(_time: number, delta: number): void {
    const dt = delta / 1000;
    let moved = false;

    if (this.cursors.left.isDown) {
      this.playerX -= this.moveSpeed * dt;
      moved = true;
    }
    if (this.cursors.right.isDown) {
      this.playerX += this.moveSpeed * dt;
      moved = true;
    }
    if (this.cursors.up.isDown) {
      this.playerY -= this.moveSpeed * dt;
      moved = true;
    }
    if (this.cursors.down.isDown) {
      this.playerY += this.moveSpeed * dt;
      moved = true;
    }

    /* ── Clamp within bounds ── */
    this.playerX = Phaser.Math.Clamp(this.playerX, 16, 784);
    this.playerY = Phaser.Math.Clamp(this.playerY, 16, 568);

    if (moved) {
      this.playerSprite.setPosition(this.playerX, this.playerY);
      if (this._playerImage) {
        this._playerImage.setPosition(this.playerX, this.playerY);
      }

      const label = this.children.getByName('playerLabel') as Phaser.GameObjects.Text;
      if (label) {
        label.setPosition(this.playerX, this.playerY - 24);
      }

      /* ── Emit movement via Socket.IO (bridge injected by useSocket) ── */
      const bridge = (window as unknown as Record<string, (mapId: string, x: number, y: number) => void>)
        .__socketEmitMove;
      if (bridge) {
        bridge('bac_nguyen_village', Math.round(this.playerX), Math.round(this.playerY));
      }
    }
  }

  /* ───────────────────────────────────────
   *  Helpers
   * ─────────────────────────────────────── */

  private _playerImage?: Phaser.GameObjects.Image;

  private drawGridFallback(): void {
    const gfx = this.add.graphics();
    gfx.lineStyle(1, 0x333355, 0.3);
    for (let x = 0; x <= 800; x += 50) {
      gfx.moveTo(x, 0);
      gfx.lineTo(x, 600);
    }
    for (let y = 0; y <= 600; y += 50) {
      gfx.moveTo(0, y);
      gfx.lineTo(800, y);
    }
    gfx.strokePath();
  }
}
