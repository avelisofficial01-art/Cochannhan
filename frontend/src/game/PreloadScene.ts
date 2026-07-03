import Phaser from 'phaser';
import { preloadScene } from './AssetManager.js';

/**
 * PreloadScene — Loads every game asset and shows a progress bar.
 *
 * All assets are defined in AssetConfig.ts and loaded via AssetManager.
 * If any asset fails to load, the error is logged but the game continues
 * (GameScene will use last-resort fallback rectangles for missing textures).
 *
 * After all assets are loaded (or failed), this scene hands off to GameScene.
 */
export class PreloadScene extends Phaser.Scene {
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressBox!: Phaser.GameObjects.Graphics;
  private loadingText!: Phaser.GameObjects.Text;
  private percentText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    const { width, height } = this.cameras.main;

    /* ── Loading label ── */
    this.loadingText = this.add
      .text(width / 2, height / 2 - 50, 'Đang tải...', {
        fontSize: '18px',
        color: '#ffffff',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    /* ── Progress bar background ── */
    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(width / 2 - 160, height / 2 - 15, 320, 30);

    /* ── Progress bar fill ── */
    this.progressBar = this.add.graphics();

    /* ── Percent text ── */
    this.percentText = this.add
      .text(width / 2, height / 2 + 25, '0%', {
        fontSize: '14px',
        color: '#aaaaaa',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    /* ── Progress callback ── */
    this.load.on('progress', (value: number) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0x00ff88, 1);
      this.progressBar.fillRect(width / 2 - 155, height / 2 - 10, 310 * value, 20);
      this.percentText.setText(`${Math.round(value * 100)}%`);
    });

    /* ── Error callback — log to console so we can debug on Render ── */
    this.load.on('loaderror', (file: { key: string; url: string }) => {
      console.error(`[PreloadScene] ❌ Failed to load: "${file.key}" from "${file.url}"`);
    });

    /* ── File progress (debug) ── */
    this.load.on('fileprogress', (file: { key: string }) => {
      console.log(`[PreloadScene] ✓ Loaded: ${file.key}`);
    });

    /* ── Complete callback ── */
    this.load.on('complete', () => {
      console.log('[PreloadScene] ✅ All assets loaded (or failed). Starting GameScene...');
      this.progressBar.destroy();
      this.progressBox.destroy();
      this.loadingText.destroy();
      this.percentText.destroy();
    });

    /* ── Queue all assets ── */
    console.log('[PreloadScene] 🚀 Starting asset preload...');
    preloadScene(this);
  }

  create(): void {
    this.scene.start('GameScene');
  }
}
