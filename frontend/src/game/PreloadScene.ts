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
    this.load.on('loaderror', (file: Record<string, unknown>) => {
      console.error(
        `[PreloadScene] ❌ Load failed: key="${file.key}", url="${file.url}", src="${file.src}", type="${file.type}", state="${file.state}"`,
        file,
      );
    });

    /* ── File progress (debug) ── */
    this.load.on('fileprogress', (file: { key: string; url: string }) => {
      console.log(`[PreloadScene] ⏳ Loading: "${file.key}" from "${file.url}"`);
    });

    /* ── File complete (debug) ── */
    this.load.on('filecomplete', (_key: string, _type: string, _data: unknown) => {
      // Log successful loads (verbose — uncomment to debug specific files)
      // console.log(`[PreloadScene] ✅ Loaded: "${_key}" (type: ${_type})`);
    });

    /* ── Complete callback ── */
    this.load.on('complete', () => {
      console.log('[PreloadScene] ✅ All assets loaded (or failed).');
      console.log('[PreloadScene] 📋 Registered texture keys:', this.textures.getTextureKeys());
      this.progressBar.destroy();
      this.progressBox.destroy();
      this.loadingText.destroy();
      this.percentText.destroy();
    });

    /* ── Queue all assets ── */
    console.log('[PreloadScene] 🚀 Starting asset preload...');
    preloadScene(this);
  }

  async create(): Promise<void> {
    /* ── Verify 3 essential textures exist before handing off ── */
    const essential = [
      { key: 'player', path: '/characters/char_1.png' },
      { key: 'map_bnp', path: '/maps/map_bac_nguyen.png' },
      { key: 'monster_1', path: '/monsters/monster_1.png' },
    ];

    let allOk = true;
    for (const { key, path: url } of essential) {
      const exists = this.textures.exists(key);
      if (!exists) {
        console.error(`[PreloadScene] ❌ ESSENTIAL TEXTURE MISSING: "${key}" (file: ${url})`);

        // Fetch the URL to see what the server actually returns
        try {
          const res = await fetch(url);
          const ct = res.headers.get('content-type') ?? 'unknown';
          const bodyPreview = (await res.text()).slice(0, 80);
          console.error(
            `[PreloadScene] 🔍 Diagnostics for ${url}: HTTP ${res.status} ${res.statusText}, Content-Type: "${ct}", body preview: "${bodyPreview}"`,
          );
        } catch (fetchErr) {
          console.error(`[PreloadScene] 🔍 Fetch failed for ${url}:`, fetchErr);
        }

        allOk = false;
      }
    }

    if (allOk) {
      console.log('[PreloadScene] ✅ All 3 essential textures verified. Starting GameScene...');
    } else {
      console.error('[PreloadScene] ⚠️ Some essential textures missing — GameScene will use fallback rectangles.');
    }

    this.scene.start('GameScene');
  }
}
