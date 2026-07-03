import Phaser from 'phaser';
import { preloadScene } from './AssetManager.js';

/**
 * PreloadScene — Loads every game asset and shows a progress bar.
 *
 * After all assets are loaded this scene hands off to GameScene.
 */
export class PreloadScene extends Phaser.Scene {
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressBox!: Phaser.GameObjects.Graphics;
  private loadingText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    const { width, height } = this.cameras.main;

    /* ── Progress bar box ── */
    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(width / 2 - 160, height / 2 - 15, 320, 30);

    this.progressBar = this.add.graphics();

    /* ── Loading label ── */
    this.loadingText = this.add
      .text(width / 2, height / 2 - 40, 'Đang tải...', {
        fontSize: '18px',
        color: '#cccccc',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    /* ── Progress events ── */
    this.load.on('progress', (value: number) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0x00ff88, 1);
      this.progressBar.fillRect(width / 2 - 155, height / 2 - 10, 310 * value, 20);
    });

    this.load.on('complete', () => {
      this.progressBar.destroy();
      this.progressBox.destroy();
      this.loadingText.destroy();
    });

    /* ── Delegate to AssetManager ── */
    preloadScene(this);
  }

  create(): void {
    this.scene.start('GameScene');
  }
}
