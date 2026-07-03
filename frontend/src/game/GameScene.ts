import Phaser from 'phaser';
import {
  getMapKey,
  getPlayerKey,
  getMonsterKey,
} from './AssetManager.js';
import { useGameStore, type MonsterSprite } from '../store/gameStore.js';

/**
 * Floating damage text that appears briefly then fades out.
 */
interface FloatText {
  text: Phaser.GameObjects.Text;
  startY: number;
  elapsed: number;
  duration: number;
}

/**
 * GameScene — Map rendering, player movement, combat UI.
 *
 * All gameplay visuals use real asset sprites loaded via AssetManager.
 * Rectangle placeholders are ONLY a last-resort fallback when textures fail to load.
 */
export class GameScene extends Phaser.Scene {
  private playerSprite!: Phaser.GameObjects.Image;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private guKey!: Phaser.Input.Keyboard.Key;
  private eqKey!: Phaser.Input.Keyboard.Key;
  private craftKey!: Phaser.Input.Keyboard.Key;
  private playerX = 400;
  private playerY = 300;
  private readonly moveSpeed = 200;

  /** Current map ID */
  private mapId = 'bnp';

  /** Monsters rendered on screen */
  private monsterSprites: Map<
    string,
    { sprite: Phaser.GameObjects.Image; hpBar: Phaser.GameObjects.Graphics; nameLabel: Phaser.GameObjects.Text }
  > = new Map();

  /** Floating damage texts */
  private floatTexts: FloatText[] = [];

  /** Attack cooldown graphics */
  private cooldownBar!: Phaser.GameObjects.Graphics;
  private cooldownBg!: Phaser.GameObjects.Graphics;
  private attackReady = true;
  private attackCooldownMs = 1000;
  private attackCooldownRemaining = 0;

  constructor() {
    super({ key: 'GameScene' });
  }

  /* ───────────────────────────────────────
   *  Create — build the scene from preloaded assets
   * ─────────────────────────────────────── */
  create(): void {
    this.cameras.main.setBackgroundColor('#1a1a2e');

    /* ── Map background ── */
    const mapKey = getMapKey(this.mapId);
    if (this.textures.exists(mapKey)) {
      const mapImg = this.add.image(400, 300, mapKey);
      mapImg.setDisplaySize(800, 600);
    } else {
      // Last-resort fallback — only if the asset truly failed
      this.drawGridFallback();
    }

    /* ── Player sprite ── */
    const playerKey = getPlayerKey();
    if (this.textures.exists(playerKey)) {
      this.playerSprite = this.add.image(this.playerX, this.playerY, playerKey);
      this.playerSprite.setDisplaySize(32, 32);
    } else {
      // Last-resort fallback
      this.createPlayerFallback();
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
      this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.guKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
      this.eqKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
      this.craftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
    }

    /* ── Launch overlay UI scene ── */
    this.scene.launch('UIScene');

    /* ── Attack cooldown indicator ── */
    this.cooldownBg = this.add.graphics();
    this.cooldownBg.fillStyle(0x333333, 0.8);
    this.cooldownBg.fillRect(300, 585, 200, 8);
    this.cooldownBar = this.add.graphics();
    this.drawCooldownReady();

    /* ── Hint ── */
    this.add
      .text(400, 572, 'SPACE: Attack  |  G: Gu  |  E: Equipment  |  C: Craft', {
        fontSize: '10px',
        color: '#888888',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 582, 'Arrow Keys: Move', {
        fontSize: '9px',
        color: '#666666',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
      .setAlpha(0.6);
  }

  /* ───────────────────────────────────────
   *  Update — called every frame
   * ─────────────────────────────────────── */
  update(_time: number, delta: number): void {
    this.updatePlayerMovement(delta);
    this.updateAttackCooldown(delta);
    this.handleGuToggle();
    this.handleEquipToggle();
    this.handleCraftToggle();
    this.syncMonsters();
    this.updateFloatTexts(delta);
  }

  /* ───────────────────────────────────────
   *  Player Movement
   * ─────────────────────────────────────── */
  private updatePlayerMovement(dtSec: number): void {
    let moved = false;

    if (this.cursors.left.isDown) {
      this.playerX -= this.moveSpeed * dtSec;
      moved = true;
    }
    if (this.cursors.right.isDown) {
      this.playerX += this.moveSpeed * dtSec;
      moved = true;
    }
    if (this.cursors.up.isDown) {
      this.playerY -= this.moveSpeed * dtSec;
      moved = true;
    }
    if (this.cursors.down.isDown) {
      this.playerY += this.moveSpeed * dtSec;
      moved = true;
    }

    this.playerX = Phaser.Math.Clamp(this.playerX, 16, 784);
    this.playerY = Phaser.Math.Clamp(this.playerY, 16, 568);

    if (moved) {
      this.playerSprite.setPosition(this.playerX, this.playerY);

      const label = this.children.getByName('playerLabel') as Phaser.GameObjects.Text;
      if (label) {
        label.setPosition(this.playerX, this.playerY - 24);
      }

      const bridge = (window as unknown as Record<string, (mapId: string, x: number, y: number) => void>)
        .__socketEmitMove;
      if (bridge) {
        bridge('bac_nguyen_village', Math.round(this.playerX), Math.round(this.playerY));
      }
    }
  }

  /* ───────────────────────────────────────
   *  Attack input (spacebar)
   * ─────────────────────────────────────── */
  private handleAttack(): void {
    if (!this.attackReady) return;

    const monsters = useGameStore.getState().monsters;
    if (monsters.length === 0) return;

    let nearest: MonsterSprite | null = null;
    let nearestDist = Infinity;

    for (const m of monsters) {
      const dx = m.x - this.playerX;
      const dy = m.y - this.playerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100 && dist < nearestDist) {
        nearestDist = dist;
        nearest = m;
      }
    }

    if (!nearest) return;

    const emitAttack = (window as unknown as Record<string, (instanceId: string) => void>)
      .__socketEmitAttack;
    if (emitAttack) {
      emitAttack(nearest.instanceId);
      this.attackReady = false;
      this.attackCooldownRemaining = this.attackCooldownMs;
    }
  }

  /* ───────────────────────────────────────
   *  Panel toggles
   * ─────────────────────────────────────── */
  private handleGuToggle(): void {
    if (this.guKey && Phaser.Input.Keyboard.JustDown(this.guKey)) {
      useGameStore.getState().toggleGuPanel();
    }
  }

  private handleEquipToggle(): void {
    if (this.eqKey && Phaser.Input.Keyboard.JustDown(this.eqKey)) {
      useGameStore.getState().toggleEquipmentPanel();
    }
  }

  private handleCraftToggle(): void {
    if (this.craftKey && Phaser.Input.Keyboard.JustDown(this.craftKey)) {
      useGameStore.getState().toggleCraftPanel();
    }
  }

  /* ───────────────────────────────────────
   *  Attack cooldown visual
   * ─────────────────────────────────────── */
  private updateAttackCooldown(delta: number): void {
    if (this.spaceKey && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.handleAttack();
    }

    if (!this.attackReady && this.attackCooldownRemaining > 0) {
      this.attackCooldownRemaining -= delta;
      const ratio = (this.attackCooldownMs - this.attackCooldownRemaining) / this.attackCooldownMs;
      this.cooldownBar.clear();
      this.cooldownBar.fillStyle(0xff8800, 1);
      this.cooldownBar.fillRect(300, 585, 200 * ratio, 8);

      if (this.attackCooldownRemaining <= 0) {
        this.attackReady = true;
        this.attackCooldownRemaining = 0;
        this.drawCooldownReady();
      }
    }
  }

  private drawCooldownReady(): void {
    this.cooldownBar.clear();
    this.cooldownBar.fillStyle(0x00ff88, 1);
    this.cooldownBar.fillRect(300, 585, 200, 8);
  }

  /* ───────────────────────────────────────
   *  Monster sync — render sprites + HP bars
   * ─────────────────────────────────────── */
  private syncMonsters(): void {
    const storeMonsters = useGameStore.getState().monsters;
    const storeIds = new Set(storeMonsters.map((m) => m.instanceId));

    // Remove dead / despawned monsters
    for (const [id, obj] of this.monsterSprites) {
      if (!storeIds.has(id)) {
        obj.sprite.destroy();
        obj.hpBar.destroy();
        obj.nameLabel.destroy();
        this.monsterSprites.delete(id);
      }
    }

    // Add / update monsters
    for (const m of storeMonsters) {
      const existing = this.monsterSprites.get(m.instanceId);
      if (existing) {
        existing.sprite.setPosition(m.x, m.y);
        existing.nameLabel.setPosition(m.x, m.y - 22);
        this.drawHpBar(existing.hpBar, m.x, m.y - 14, m.currentHp, m.maxHp);
      } else {
        this.spawnMonsterSprite(m);
      }
    }

    // Show damage numbers from combat result
    const result = useGameStore.getState().combatResult;
    if (result) {
      this.showDamageNumber(result);
      useGameStore.getState().setCombatResult(null);
    }
  }

  /* ───────────────────────────────────────
   *  Spawn a new monster sprite (real asset or fallback)
   * ─────────────────────────────────────── */
  private spawnMonsterSprite(m: MonsterSprite): void {
    let sprite: Phaser.GameObjects.Image;

    // Try to map monster templateId to a monster sprite index
    const monsterKey = getMonsterKey(this.getMonsterIndex(m.templateId));

    if (this.textures.exists(monsterKey)) {
      sprite = this.add.image(m.x, m.y, monsterKey);
      sprite.setDisplaySize(28, 28);
    } else {
      // Last-resort fallback
      const rect = this.add.rectangle(m.x, m.y, 28, 28, 0xff4444);
      rect.setStrokeStyle(2, 0x000000);
      // Wrap rectangle as an Image-like object — we use a proxy pattern via
      // type assertion since Phaser.Rectangle shares setPosition/setDisplaySize
      sprite = rect as unknown as Phaser.GameObjects.Image;
    }

    const nameLabel = this.add
      .text(m.x, m.y - 22, m.name, {
        fontSize: '10px',
        color: '#ffaaaa',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    const hpBar = this.add.graphics();
    this.drawHpBar(hpBar, m.x, m.y - 14, m.currentHp, m.maxHp);

    this.monsterSprites.set(m.instanceId, { sprite, hpBar, nameLabel });
  }

  /**
   * Map a monster templateId to a sprite index (1-based) for AssetManager.
   * Uses a simple hash so the same template always gets the same sprite.
   */
  private getMonsterIndex(templateId: string): number {
    let hash = 0;
    for (let i = 0; i < templateId.length; i++) {
      hash = (hash * 31 + templateId.charCodeAt(i)) >>> 0;
    }
    return (hash % 11) + 1; // 11 monster sprites available
  }

  /* ───────────────────────────────────────
   *  HP bar
   * ─────────────────────────────────────── */
  private drawHpBar(
    gfx: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    currentHp: number,
    maxHp: number,
  ): void {
    const barWidth = 32;
    const barHeight = 4;
    const hpRatio = Math.max(0, currentHp / maxHp);

    gfx.clear();
    gfx.fillStyle(0x330000, 0.9);
    gfx.fillRect(x - barWidth / 2, y, barWidth, barHeight);

    let color = 0x00ff00;
    if (hpRatio < 0.3) color = 0xff0000;
    else if (hpRatio < 0.6) color = 0xffaa00;
    gfx.fillStyle(color, 1);
    gfx.fillRect(x - barWidth / 2, y, barWidth * hpRatio, barHeight);
  }

  /* ───────────────────────────────────────
   *  Damage numbers (floating text)
   * ─────────────────────────────────────── */
  private showDamageNumber(result: { damage: number; isCritical: boolean; targetX: number; targetY: number }): void {
    const color = result.isCritical ? '#ffaa00' : '#ffffff';
    const size = result.isCritical ? '16px' : '13px';
    const prefix = result.isCritical ? 'CRIT! ' : '';

    const txt = this.add
      .text(result.targetX, result.targetY - 20, `${prefix}${result.damage}`, {
        fontSize: size,
        color: color,
        fontFamily: 'monospace',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    this.floatTexts.push({
      text: txt,
      startY: result.targetY - 20,
      elapsed: 0,
      duration: 1000,
    });
  }

  /* ───────────────────────────────────────
   *  Update floating texts (fade + float up)
   * ─────────────────────────────────────── */
  private updateFloatTexts(delta: number): void {
    for (let i = this.floatTexts.length - 1; i >= 0; i--) {
      const ft = this.floatTexts[i];
      ft.elapsed += delta;

      const progress = ft.elapsed / ft.duration;
      ft.text.setY(ft.startY - progress * 30);
      ft.text.setAlpha(1 - progress);

      if (progress >= 1) {
        ft.text.destroy();
        this.floatTexts.splice(i, 1);
      }
    }
  }

  /* ───────────────────────────────────────
   *  Last-resort fallbacks (when textures fail to load)
   * ─────────────────────────────────────── */

  private createPlayerFallback(): void {
    const rect = this.add.rectangle(this.playerX, this.playerY, 32, 32, 0x00ff88);
    rect.setStrokeStyle(2, 0xffffff);
    this.playerSprite = rect as unknown as Phaser.GameObjects.Image;
  }

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
