import Phaser from 'phaser';

export interface JoystickState {
  direction: { x: number; y: number };
  isActive: boolean;
}

/**
 * VirtualJoystick — On-screen touch joystick for mobile H5 games.
 *
 * Renders a semi-transparent base circle + thumb circle.
 * Listens for pointer events and calculates a normalized direction vector.
 *
 * Usage:
 *   const joystick = new VirtualJoystick(scene, x, y, radius);
 *   const { direction, isActive } = joystick.getState();
 */
export class VirtualJoystick {
  private scene: Phaser.Scene;
  private base: Phaser.GameObjects.Arc;
  private thumb: Phaser.GameObjects.Arc;
  private readonly baseX: number;
  private readonly baseY: number;
  private readonly maxDist: number;
  private state: JoystickState = { direction: { x: 0, y: 0 }, isActive: false };
  private activePointerId: number | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number, radius = 40) {
    this.scene = scene;
    this.baseX = x;
    this.baseY = y;
    this.maxDist = radius - 10;

    // Base circle
    this.base = scene.add.circle(x, y, radius, 0x000000, 0.25);
    this.base.setStrokeStyle(2, 0xffffff, 0.35);
    this.base.setDepth(1000);

    // Thumb circle
    this.thumb = scene.add.circle(x, y, radius * 0.5, 0xffffff, 0.4);
    this.thumb.setDepth(1001);

    // Pointer events
    scene.input.on('pointerdown', this.onPointerDown, this);
    scene.input.on('pointermove', this.onPointerMove, this);
    scene.input.on('pointerup', this.onPointerUp, this);
  }

  /* ── Pointer handlers ── */

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    const dist = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.baseX, this.baseY);
    if (dist < this.maxDist * 1.8) {
      this.activePointerId = pointer.id;
      this.state.isActive = true;
      this.updateThumb(pointer.x, pointer.y);
    }
  }

  private onPointerMove(pointer: Phaser.Input.Pointer): void {
    if (pointer.id === this.activePointerId) {
      this.updateThumb(pointer.x, pointer.y);
    }
  }

  private onPointerUp(pointer: Phaser.Input.Pointer): void {
    if (pointer.id === this.activePointerId) {
      this.activePointerId = null;
      this.state.isActive = false;
      this.state.direction = { x: 0, y: 0 };
      this.thumb.setPosition(this.baseX, this.baseY);
    }
  }

  /* ── Internal ── */

  private updateThumb(px: number, py: number): void {
    let dx = px - this.baseX;
    let dy = py - this.baseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > this.maxDist) {
      const ratio = this.maxDist / dist;
      dx *= ratio;
      dy *= ratio;
    }

    this.thumb.setPosition(this.baseX + dx, this.baseY + dy);

    if (dist > 0) {
      this.state.direction = {
        x: dx / this.maxDist,
        y: dy / this.maxDist,
      };
    }
  }

  /* ── Public API ── */

  getState(): JoystickState {
    return this.state;
  }

  destroy(): void {
    this.base.destroy();
    this.thumb.destroy();
    this.scene.input.off('pointerdown', this.onPointerDown, this);
    this.scene.input.off('pointermove', this.onPointerMove, this);
    this.scene.input.off('pointerup', this.onPointerUp, this);
  }
}
