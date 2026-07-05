import Phaser from 'phaser';
import {
  getMapKey,
  getPlayerKey,
  getMonsterKey,
  getNpcKey,
  getBgmKey,
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

interface PortalData {
  id: string;
  from_x: number;
  from_y: number;
  portal_name: string;
  to_map_id: string;
  to_map_name: string;
  to_x: number;
  to_y: number;
}

/**
 * GameScene — Map rendering, player movement, combat UI.
 *
 * All gameplay visuals use real asset sprites loaded via AssetManager.
 * Rectangle placeholders are ONLY a last-resort fallback when textures fail to load.
 *
 * @eslint-disable-next-line @typescript-eslint/class-name-casing
 */
export class GameScene extends Phaser.Scene {
  private playerSprite!: Phaser.GameObjects.Image;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private guKey!: Phaser.Input.Keyboard.Key;
  private eqKey!: Phaser.Input.Keyboard.Key;
  private charKey!: Phaser.Input.Keyboard.Key;
  private craftKey!: Phaser.Input.Keyboard.Key;
  private playerX = 400;
  private playerY = 300;
  private readonly moveSpeed = 200;

  /** Current map ID */
  private mapId = 'bnp';
  private mapWidth = 1024;
  private mapHeight = 640;
  private mapImage: Phaser.GameObjects.Image | null = null;
  private gridGfx: Phaser.GameObjects.Graphics | null = null;

  /** NPCs and Portals on map */
  private npcSprites: Map<string, { sprite: Phaser.GameObjects.Image; nameLabel: Phaser.GameObjects.Text }> = new Map();
  private portalSprites: Map<string, { gfx: Phaser.GameObjects.Graphics; nameLabel: Phaser.GameObjects.Text; data: PortalData }> = new Map();
  private portalPointersGfx: Phaser.GameObjects.Graphics | null = null;

  /** Throttle socket emits */
  private lastMoveEmitTime = 0;

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

  /** Player HP Bar & Stats */
  private playerHpBar: Phaser.GameObjects.Graphics | null = null;
  private playerCurrentHp = 100;
  private playerMaxHp = 100;

  private playerControlsEnabled = true;
  private introCutscenePlayed = false;
  private bossDialogueTriggered = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  /* ───────────────────────────────────────
   *  Create — build the scene from preloaded assets
   * ─────────────────────────────────────── */
   create(): void {
    console.log('[GameScene] 🎬 create() started');
    this.cameras.main.setBackgroundColor('#1a1a2e');

    /* ── Bind Socket.IO Map Events ── */
    this.events.on('map:init', this.handleMapInit, this);
    this.events.on('map:npcs', this.handleMapNpcs, this);
    this.events.on('map:portals', this.handleMapPortals, this);

    /* ── Player sprite ── */
    const playerKey = getPlayerKey();
    if (this.textures.exists(playerKey)) {
      this.playerSprite = this.add.image(this.playerX, this.playerY, playerKey);
      this.playerSprite.setDisplaySize(36, 36);
    } else {
      this.createPlayerFallback();
    }

    // Camera follow
    this.cameras.main.startFollow(this.playerSprite, true, 0.08, 0.08);

    /* ── Player name label ── */
    this.add
      .text(this.playerX, this.playerY - 28, 'You', {
        fontSize: '12px',
        color: '#00ff88',
        fontFamily: 'monospace',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setName('playerLabel');

    /* ── Player HP Bar ── */
    this.playerHpBar = this.add.graphics();
    this.drawHpBar(this.playerHpBar, this.playerX, this.playerY - 20, this.playerCurrentHp, this.playerMaxHp);

    /* ── Bind Damaged/Respawn Events ── */
    this.events.on('player:damaged', this.handlePlayerDamaged, this);
    this.events.on('player:respawn', this.handlePlayerRespawn, this);
    this.events.on('monster:dead', this.handleMonsterDead, this);

    /* ── Input ── */
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.guKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
      this.eqKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
      this.charKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
      this.craftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);
    }

    /* ── Play Background Music (BGM) ── */
    const bgmKey = getBgmKey();
    if (!this.sound.get(bgmKey)) {
      try {
        const bgm = this.sound.add(bgmKey, { loop: true, volume: 0.25 });
        bgm.play();
      } catch (err) {
        console.error('[GameScene] BGM play failed:', err);
      }
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


    /* ── Re-request map state after scene is fully initialized ──
     * Socket may have connected and received map:init before GameScene.create()
     * registered listeners. Re-emitting map:join ensures server re-sends all
     * map:init, map:npcs, map:portals, and monster:spawn events.
     */
    this.time.delayedCall(300, () => {
      const mapId = useGameStore.getState().currentMapId || 'bac_nguyen_village';
      console.log(`[GameScene] 🔄 Re-joining map: "${mapId}"`);
      const joinBridge = (window as unknown as Record<string, (input: unknown) => void>).__socketEmitMapJoin;
      if (joinBridge) {
        joinBridge({ mapId });
      } else {
        console.warn('[GameScene] ⚠️ __socketEmitMapJoin bridge not available — re-join skipped');
      }
    });
  }

  /* ───────────────────────────────────────
   *  Update — called every frame
   * ─────────────────────────────────────── */
  update(_time: number, delta: number): void {
    // delta is in milliseconds — convert to seconds for physics calculations
    const deltaSec = delta / 1000;
    this.updatePlayerMovement(deltaSec);
    this.updateAttackCooldown(delta);
    this.handleCharToggle();
    this.handleCraftToggle();
    this.syncMonsters();
    this.updateFloatTexts(delta);
    this.checkBossProximity();
    this.drawPortalPointers();
  }

  /* ───────────────────────────────────────
   *  Player Movement
   * ─────────────────────────────────────── */
  private updatePlayerMovement(dtSec: number): void {
    if (!this.playerControlsEnabled) {
      return;
    }
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

    // ── Mobile H5: virtual joystick from UIScene ──
    const uiScene = this.scene.get('UIScene') as {
      getJoystickState?: () => { direction: { x: number; y: number }; isActive: boolean };
    } | null;
    if (uiScene?.getJoystickState) {
      const js = uiScene.getJoystickState();
      if (js.isActive) {
        this.playerX += js.direction.x * this.moveSpeed * dtSec;
        this.playerY += js.direction.y * this.moveSpeed * dtSec;
        moved = true;
      }
    }

    this.playerX = Phaser.Math.Clamp(this.playerX, 18, this.mapWidth - 18);
    this.playerY = Phaser.Math.Clamp(this.playerY, 18, this.mapHeight - 18);

    if (moved) {
      this.playerSprite.setPosition(this.playerX, this.playerY);

      const label = this.children.getByName('playerLabel') as Phaser.GameObjects.Text;
      if (label) {
        label.setPosition(this.playerX, this.playerY - 28);
      }

      if (this.playerHpBar) {
        this.drawHpBar(this.playerHpBar, this.playerX, this.playerY - 20, this.playerCurrentHp, this.playerMaxHp);
      }

      // Throttle movement updates to 50ms (20Hz)
      const now = this.time.now;
      if (now - this.lastMoveEmitTime >= 50) {
        const bridge = (window as unknown as Record<string, (mapId: string, x: number, y: number) => void>)
          .__socketEmitMove;
        if (bridge) {
          bridge(this.mapId, Math.round(this.playerX), Math.round(this.playerY));
        }
        this.lastMoveEmitTime = now;
      }

      // Check portal proximity
      this.checkPortalCollision();
    }
  }

  private checkPortalCollision(): void {
    const joinBridge = (window as unknown as Record<string, (input: unknown) => void>).__socketEmitMapJoin;
    if (!joinBridge) return;

    for (const p of this.portalSprites.values()) {
      const dx = this.playerX - p.data.from_x;
      const dy = this.playerY - p.data.from_y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 32) {
        console.log(`[GameScene] Teleporting through portal: ${p.data.portal_name} to map ${p.data.to_map_name}`);
        
        // Move player locally to portal destination
        this.playerX = p.data.to_x;
        this.playerY = p.data.to_y;
        this.playerSprite.setPosition(this.playerX, this.playerY);
        
        joinBridge({
          mapId: p.data.to_map_id,
          x: p.data.to_x,
          y: p.data.to_y,
        });
        break;
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
  private handleCharToggle(): void {
    if (!this.playerControlsEnabled) return;
    if (
      (this.charKey && Phaser.Input.Keyboard.JustDown(this.charKey)) ||
      (this.guKey && Phaser.Input.Keyboard.JustDown(this.guKey)) ||
      (this.eqKey && Phaser.Input.Keyboard.JustDown(this.eqKey))
    ) {
      useGameStore.getState().toggleCharacterPanel();
    }
  }

  private handleCraftToggle(): void {
    if (!this.playerControlsEnabled) return;
    if (this.craftKey && Phaser.Input.Keyboard.JustDown(this.craftKey)) {
      useGameStore.getState().toggleCraftPanel();
    }
  }

  /* ───────────────────────────────────────
   *  Attack cooldown visual
   * ─────────────────────────────────────── */
  private updateAttackCooldown(delta: number): void {
    if (!this.playerControlsEnabled) {
      return;
    }
    if (this.spaceKey && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.handleAttack();
    }

    // ── Mobile H5: attack button from UIScene ──
    const uiScene = this.scene.get('UIScene') as {
      isAttackPressed?: () => boolean;
    } | null;
    if (uiScene?.isAttackPressed?.()) {
      this.handleAttack();
      // release immediately so it only fires once per press
      (uiScene as Record<string, boolean>).isAttacking = false;
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
  private monsterSyncLogged = false;
  private syncMonsters(): void {
    const storeMonsters = useGameStore.getState().monsters;
    
    if (!this.monsterSyncLogged && storeMonsters.length > 0) {
      console.log(`[GameScene] 🐾 syncMonsters — ${storeMonsters.length} monsters in store, rendering...`);
      this.monsterSyncLogged = true;
    }
    
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
    const texExists = this.textures.exists(monsterKey);

    if (texExists) {
      sprite = this.add.image(m.x, m.y, monsterKey);
      sprite.setDisplaySize(32, 32);
    } else {
      // Fallback: always-visible red circle
      const rect = this.add.circle(m.x, m.y, 16, 0xff4444, 0.9);
      rect.setStrokeStyle(2, 0x000000, 1);
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
  private showDamageNumber(result: { damage: number; isCritical: boolean; targetX: number; targetY: number; damageType?: string }): void {
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

    this.playAttackSlashEffect(result.targetX, result.targetY, result.damageType);
  }

  private playAttackSlashEffect(x: number, y: number, damageType?: string): void {
    const slash = this.add.graphics();
    
    // Choose color based on element!
    let color = 0x00ffff; // Default cyan for physical
    if (damageType === 'fire') color = 0xff3300; // Red/orange for fire
    if (damageType === 'poison') color = 0x9933ff; // Purple for poison
    if (damageType === 'blood') color = 0xff0055; // Crimson for blood
    if (damageType === 'ice') color = 0x33ccff; // Ice blue
    if (damageType === 'earth') color = 0xffaa00; // Earth amber

    slash.lineStyle(3, color, 0.95);
    
    // Draw a neat curved arc representing a sword slash
    slash.beginPath();
    slash.arc(x, y, 20, Phaser.Math.DegToRad(-60), Phaser.Math.DegToRad(60));
    slash.strokePath();

    this.tweens.add({
      targets: slash,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 180,
      onComplete: () => {
        slash.destroy();
      }
    });
  }

  private drawPortalPointers(): void {
    if (!this.portalPointersGfx) {
      this.portalPointersGfx = this.add.graphics().setScrollFactor(0).setDepth(1500);
    }
    const gfx = this.portalPointersGfx;
    gfx.clear();

    const cam = this.cameras.main;
    const px = this.playerX;
    const py = this.playerY;

    for (const p of this.portalSprites.values()) {
      const tx = p.data.from_x;
      const ty = p.data.from_y;

      // Check if off-screen
      if (tx < cam.scrollX || tx > cam.scrollX + cam.width || ty < cam.scrollY || ty > cam.scrollY + cam.height) {
        // Calculate angle from screen center (player) to target portal
        const angle = Phaser.Math.Angle.Between(px, py, tx, ty);
        
        // Position pointer at screen edge
        const edgeOffset = 24;
        const centerX = cam.width / 2;
        const centerY = cam.height / 2;
        
        // Calculate screen edge position
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        let screenX = centerX + cos * (centerX - edgeOffset);
        let screenY = centerY + sin * (centerY - edgeOffset);
        
        // Clamp to screen bounds
        screenX = Phaser.Math.Clamp(screenX, edgeOffset, cam.width - edgeOffset);
        screenY = Phaser.Math.Clamp(screenY, edgeOffset, cam.height - edgeOffset);
        
        // Draw a neat arrow pointing to the portal
        gfx.fillStyle(0x00ffff, 0.85);
        gfx.lineStyle(1, 0xffffff, 0.9);
        
        gfx.beginPath();
        gfx.moveTo(screenX, screenY);
        gfx.lineTo(screenX - cos * 14 + sin * 7, screenY - sin * 14 - cos * 7);
        gfx.lineTo(screenX - cos * 10, screenY - sin * 10);
        gfx.lineTo(screenX - cos * 14 - sin * 7, screenY - sin * 14 + cos * 7);
        gfx.closePath();
        gfx.fillPath();
        gfx.strokePath();
      }
    }
  }

  private showFloatingText(x: number, y: number, text: string, color = '#ff3333'): void {
    const txt = this.add
      .text(x, y - 20, text, {
        fontSize: '11px',
        color: color,
        fontFamily: 'monospace',
        stroke: '#000000',
        strokeThickness: 2,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: { x: 4, y: 2 },
      })
      .setOrigin(0.5);

    this.floatTexts.push({
      text: txt,
      startY: y - 20,
      elapsed: 0,
      duration: 1200,
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
    console.warn('[GameScene] ⚠️ Using player rectangle fallback (texture failed to load)');
    const rect = this.add.rectangle(this.playerX, this.playerY, 32, 32, 0x00ff88);
    rect.setStrokeStyle(2, 0xffffff);
    this.playerSprite = rect as unknown as Phaser.GameObjects.Image;
  }

  private drawGridFallback(): void {
    console.warn('[GameScene] ⚠️ Using grid fallback (map texture failed to load)');
    const gfx = this.add.graphics();
    gfx.lineStyle(1, 0x333355, 0.3);
    for (let x = 0; x <= this.mapWidth; x += 50) {
      gfx.moveTo(x, 0);
      gfx.lineTo(x, this.mapHeight);
    }
    for (let y = 0; y <= this.mapHeight; y += 50) {
      gfx.moveTo(0, y);
      gfx.lineTo(this.mapWidth, y);
    }
    gfx.strokePath();
    this.gridGfx = gfx;
  }

  private handleMapInit(data: { id: string; name: string; region: string; width: number; height: number; background: string; spawnX?: number; spawnY?: number }): void {
    console.log(`[GameScene] 🗺️ handleMapInit — "${data.name}" (${data.width}x${data.height}, region=${data.region})`);
    this.mapId = data.id;
    this.mapWidth = data.width;
    this.mapHeight = data.height;

    // Reset physics and camera bounds
    this.physics.world.setBounds(0, 0, data.width, data.height);
    this.cameras.main.setBounds(0, 0, data.width, data.height);

    // Reset player to spawn position (default: map center)
    const spawnX = data.spawnX ?? Math.round(data.width / 2);
    const spawnY = data.spawnY ?? Math.round(data.height / 2);
    this.playerX = spawnX;
    this.playerY = spawnY;
    if (this.playerSprite) {
      this.playerSprite.setPosition(spawnX, spawnY);
    }

    if (this.playerHpBar) {
      this.drawHpBar(this.playerHpBar, spawnX, spawnY - 20, this.playerCurrentHp, this.playerMaxHp);
    }

    this.time.delayedCall(500, () => {
      this.checkAndPlayOpeningCutscene();
    });

    // Re-attach camera follow on new map
    this.cameras.main.startFollow(this.playerSprite, true, 0.1, 0.1);

    // Render map background
    if (this.mapImage) {
      this.mapImage.destroy();
    }
    if (this.gridGfx) {
      this.gridGfx.destroy();
      this.gridGfx = null;
    }

    const mapKey = getMapKey(data.region);
    if (this.textures.exists(mapKey)) {
      this.mapImage = this.add.image(data.width / 2, data.height / 2, mapKey);
      this.mapImage.setDisplaySize(data.width, data.height);
      this.mapImage.setDepth(-1000);
    } else {
      this.drawGridFallback();
    }
  }

  private handleMapNpcs(npcs: Array<{ id: string; name: string; sprite: string; x: number; y: number; hasShop: boolean }>): void {
    console.log(`[GameScene] 👤 handleMapNpcs — ${npcs.length} NPCs`);
    // Clear old NPC sprites
    for (const obj of this.npcSprites.values()) {
      obj.sprite.destroy();
      obj.nameLabel.destroy();
    }
    this.npcSprites.clear();

    // Create new NPC sprites
    npcs.forEach((npc) => {
      // NPC_PLACEHOLDERS are loaded as npc_0, npc_1, ...
      // sprite field is like 'char_2' (1-indexed). Map: char_N -> npc_(N-1)
      const charIndex = parseInt(npc.sprite.replace('char_', ''), 10);
      const npcIdx = isNaN(charIndex) ? 0 : Math.max(0, charIndex - 1);
      const npcKey = getNpcKey(npcIdx);

      let npcSprite: Phaser.GameObjects.Image | Phaser.GameObjects.Arc;
      if (this.textures.exists(npcKey)) {
        npcSprite = this.add.image(npc.x, npc.y, npcKey);
        npcSprite.setDisplaySize(40, 40);
        npcSprite.setInteractive({ useHandCursor: true });
      } else {
        // Fallback: colored circle always visible
        const circle = this.add.circle(npc.x, npc.y, 20, 0xffaa00, 0.9);
        circle.setStrokeStyle(2, 0xffffff, 1);
        npcSprite = circle;
        npcSprite.setInteractive({
          hitArea: new Phaser.Geom.Circle(20, 20, 20),
          hitAreaCallback: Phaser.Geom.Circle.Contains,
          useHandCursor: true,
        });
      }

      npcSprite.setDepth(50);

      const nameLabel = this.add.text(npc.x, npc.y - 32, npc.name, {
        fontSize: '12px',
        color: '#ffff00',
        fontFamily: 'monospace',
        stroke: '#000000',
        strokeThickness: 3,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: { x: 4, y: 2 },
      }).setOrigin(0.5);

      npcSprite.on('pointerdown', () => {
        const dx = this.playerX - npc.x;
        const dy = this.playerY - npc.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= 120) {
          useGameStore.getState().openDialogue(npc);
        } else {
          this.showFloatingText(npc.x, npc.y, 'Hãy đến gần hơn để trò chuyện', '#ffff00');
        }
      });

      this.npcSprites.set(npc.id, { sprite: npcSprite as Phaser.GameObjects.Image, nameLabel });
    });
  }

  private handleMapPortals(portals: PortalData[]): void {
    console.log(`[GameScene] 🌐 handleMapPortals — ${portals.length} portals`);
    // Clear old portal sprites
    for (const obj of this.portalSprites.values()) {
      obj.gfx.destroy();
      obj.nameLabel.destroy();
    }
    this.portalSprites.clear();

    // Create new portal graphics with depth + pulse animation
    portals.forEach((p) => {
      const gfx = this.add.graphics();
      gfx.lineStyle(3, 0x00ffff, 0.9);
      gfx.fillStyle(0x00ffff, 0.25);
      gfx.strokeCircle(p.from_x, p.from_y, 32);
      gfx.fillCircle(p.from_x, p.from_y, 32);
      gfx.setDepth(100);

      // Pulse animation
      this.tweens.add({
        targets: gfx,
        alpha: { from: 1, to: 0.4 },
        duration: 800,
        yoyo: true,
        repeat: -1,
      });

      const nameLabel = this.add.text(p.from_x, p.from_y - 40, p.portal_name || '🔄 Portal', {
        fontSize: '11px',
        color: '#00ffff',
        fontFamily: 'monospace',
        stroke: '#000000',
        strokeThickness: 3,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: { x: 4, y: 2 },
      }).setOrigin(0.5).setDepth(101);

      this.portalSprites.set(p.id, { gfx, nameLabel, data: p });
    });
  }

  private handlePlayerDamaged(data: { damage: number; currentHp: number; maxHp: number }): void {
    this.playerCurrentHp = data.currentHp;
    this.playerMaxHp = data.maxHp;

    // Show floating red text over player
    this.showFloatingText(this.playerX, this.playerY, `-${data.damage}`, '#ff0000');

    // Redraw player HP bar
    if (this.playerHpBar) {
      this.drawHpBar(this.playerHpBar, this.playerX, this.playerY - 20, this.playerCurrentHp, this.playerMaxHp);
    }
  }

  private handlePlayerRespawn(data: { mapId: string; x: number; y: number }): void {
    console.log(`[GameScene] Player respawning at map: ${data.mapId}`);
    this.playerCurrentHp = 100;
    this.playerMaxHp = 100;

    this.playerX = data.x;
    this.playerY = data.y;

    if (this.playerSprite) {
      this.playerSprite.setPosition(data.x, data.y);
    }

    if (this.playerHpBar) {
      this.drawHpBar(this.playerHpBar, data.x, data.y - 20, this.playerCurrentHp, this.playerMaxHp);
    }

    const label = this.children.getByName('playerLabel') as Phaser.GameObjects.Text;
    if (label) {
      label.setPosition(data.x, data.y - 28);
    }

    // Join the map
    const joinBridge = (window as unknown as Record<string, (input: unknown) => void>).__socketEmitMapJoin;
    if (joinBridge) {
      joinBridge({ mapId: data.mapId, x: data.x, y: data.y });
    }
  }

  private handleMonsterDead(data: { instanceId: string; name: string }): void {
    if (data.name === 'Bạch Lang Vương') {
      this.playEndingCutscene();
    }
  }

  private checkBossProximity(): void {
    if (this.bossDialogueTriggered) return;

    // Find boss monster
    const monsters = useGameStore.getState().monsters;
    const boss = monsters.find(m => m.name === 'Bạch Lang Vương');
    if (boss) {
      const dx = this.playerX - boss.x;
      const dy = this.playerY - boss.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        this.bossDialogueTriggered = true;
        this.playerControlsEnabled = false;

        console.log('[GameScene] 🐺 Near Bạch Lang Vương. Triggering pre-fight dialogue.');

        // Find Bạch Lang Vương NPC template to start conversation
        const token = localStorage.getItem('token');
        fetch('/api/npc', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(json => {
          if (json.success && json.data) {
            const bossNpc = json.data.find((n: { name: string }) => n.name === 'Bạch Lang Vương');
            if (bossNpc) {
              useGameStore.getState().openDialogue({
                id: bossNpc.id,
                name: bossNpc.name,
                sprite: bossNpc.sprite,
                hasShop: false
              });
            }
          }
        })
        .catch(() => {});

        // Wait until dialogue is closed, then re-enable controls
        const checkClosed = setInterval(() => {
          if (!useGameStore.getState().isDialogueOpen) {
            clearInterval(checkClosed);
            this.playerControlsEnabled = true;
          }
        }, 200);
      }
    }
  }

  private checkAndPlayOpeningCutscene(): void {
    const activeQuests = useGameStore.getState().activeQuests as Array<{ name: string }>;
    const isAwakenActive = activeQuests.some(q => q.name === 'Tỉnh Giấc Mộng') || activeQuests.length === 0;
    const played = localStorage.getItem('ch1_intro_cutscene_played') === 'true';

    if (isAwakenActive && (this.mapId === 'lang_cothao' || this.mapId === 'bac_nguyen_village') && !played && !this.introCutscenePlayed) {
      this.introCutscenePlayed = true;
      localStorage.setItem('ch1_intro_cutscene_played', 'true');
      this.playOpeningCutscene();
    }
  }

  private playOpeningCutscene(): void {
    this.playerControlsEnabled = false;

    // Draw solid black overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.95);
    overlay.fillRect(0, 0, this.mapWidth, this.mapHeight);
    overlay.setScrollFactor(0);
    overlay.setDepth(2000);

    // Opening title
    const titleText = this.add.text(400, 180, "CỔ ĐẠO — CHƯƠNG I: BẮC NGUYÊN BĂNG DÃ", {
      fontFamily: 'Georgia, serif',
      fontSize: '20px',
      color: '#ffcc00',
      align: 'center',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(2001);

    // Dramatic scrolling text
    const text = this.add.text(400, 320,
      "Đại lục hoang vu, Thiên Đạo chí cao khống chế vạn vật...\n" +
      "Mười vạn năm trước, Cổ Đạo quật khởi nghịch thiên cải mệnh,\n" +
      "nhưng cuối cùng bị chôn vùi dưới dòng sông lịch sử.\n\n" +
      "Hôm nay, tại Làng Cổ Thảo xa xôi phía Bắc,\n" +
      "ngươi tỉnh lại giữa bão tuyết cuồng nộ...\n" +
      "Khi cầm trên tay khối Cổ Thạch kỳ dị rỉ máu,\n" +
      "Sinh Cổ đệ nhất tinh hoa liền thức tỉnh!\n\n" +
      "[ Nhấp chuột bất kỳ để Bắt Đầu Hành Trình ]",
      {
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '13px',
        color: '#ffffff',
        align: 'center',
        lineSpacing: 8
      }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(2001);

    this.input.once('pointerdown', () => {
      this.cameras.main.flash(800, 255, 255, 255);
      titleText.destroy();
      text.destroy();
      overlay.destroy();
      this.playerControlsEnabled = true;
    });
  }

  private playEndingCutscene(): void {
    this.playerControlsEnabled = false;

    // Draw full black overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.95);
    overlay.fillRect(0, 0, this.mapWidth, this.mapHeight);
    overlay.setScrollFactor(0);
    overlay.setDepth(2000);

    // Defeated title
    const titleText = this.add.text(400, 180, "BẠCH LANG VƯƠNG PHONG ẤN THẤT BẠI", {
      fontFamily: 'Georgia, serif',
      fontSize: '22px',
      color: '#ff3333',
      align: 'center',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(2001);

    // Breakthrough text
    const text = this.add.text(400, 330,
      "Bạch Lang Vương tru lên một tiếng thê lương rồi ngã gục.\n" +
      "Luồng Tinh Hoa Băng cực hàn thoát ra, phong ấn hoàn toàn vỡ nát!\n\n" +
      "Bất ngờ, Sinh Cổ trong Không Khiếu tự động kích hoạt,\n" +
      "điên cuồng thôn phệ hàn khí chuyển hóa thành sinh cơ vô tận...\n" +
      "Không Khiếu rung chuyển dữ dội, xiềng xích phàm nhân đứt gãy!\n\n" +
      "Chúc mừng ngươi phá cảnh thành công:\n" +
      "--- ĐỘT PHÁ LÊN NHỊ CHUYỂN CẢNH GIỚI! ---\n\n" +
      "[ Nhấp chuột để tiếp tục sang Chương II: Nam Cương Trùng Độc ]",
      {
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '13px',
        color: '#ffcc00',
        align: 'center',
        lineSpacing: 8
      }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(2001);

    this.input.once('pointerdown', () => {
      titleText.destroy();
      text.destroy();
      overlay.destroy();
      this.playerControlsEnabled = true;

      // Set story flag ch1_complete on server
      const token = localStorage.getItem('token');
      fetch('/api/quest/flags/set', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ flagKey: 'ch1_complete', flagValue: 'true' }),
      }).then(() => {
        window.location.reload();
      }).catch(() => {});
    });
  }
}
