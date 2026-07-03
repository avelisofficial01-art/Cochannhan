import Phaser from 'phaser';
import {
  getMapKey,
  getPlayerKey,
  getMonsterKey,
  getNpcKey,
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

      let npcSprite: Phaser.GameObjects.Image;
      if (this.textures.exists(npcKey)) {
        npcSprite = this.add.image(npc.x, npc.y, npcKey);
        npcSprite.setDisplaySize(40, 40);
      } else {
        // Fallback: colored circle always visible
        const circle = this.add.circle(npc.x, npc.y, 20, 0xffaa00, 0.9);
        circle.setStrokeStyle(2, 0xffffff, 1);
        npcSprite = circle as unknown as Phaser.GameObjects.Image;
      }

      npcSprite.setInteractive(new Phaser.Geom.Circle(0, 0, 30), Phaser.Geom.Circle.Contains);

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
        useGameStore.getState().openDialogue(npc);
      });

      this.npcSprites.set(npc.id, { sprite: npcSprite, nameLabel });
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

    // Create new portal graphics
    portals.forEach((p) => {
      const gfx = this.add.graphics();
      gfx.lineStyle(2, 0x00ffff, 0.8);
      gfx.fillStyle(0x00ffff, 0.2);
      gfx.strokeCircle(p.from_x, p.from_y, 24);
      gfx.fillCircle(p.from_x, p.from_y, 24);

      const nameLabel = this.add.text(p.from_x, p.from_y - 32, p.portal_name || 'Portal', {
        fontSize: '10px',
        color: '#00ffff',
        fontFamily: 'monospace',
        stroke: '#000000',
        strokeThickness: 2,
      }).setOrigin(0.5);

      this.portalSprites.set(p.id, { gfx, nameLabel, data: p });
    });
  }
}
