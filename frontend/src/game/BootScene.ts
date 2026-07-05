import Phaser from 'phaser';

/**
 * BootScene — Minimal bootstrap scene.
 *
 * Responsibilities:
 *  - Set up global game settings (scale mode, input).
 *  - Transition immediately to PreloadScene.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // No assets to preload here — the PreloadScene handles everything.
  }

  create(): void {
    this.scene.start('PreloadScene');
  }
}
