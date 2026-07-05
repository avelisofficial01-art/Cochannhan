import Phaser from 'phaser';
import { VirtualJoystick, type JoystickState } from './VirtualJoystick.js';

/**
 * UIScene — Overlay HUD, touch controls for mobile H5.
 *
 * Desktop: skeleton only (keyboard hints in GameScene).
 * Mobile:  virtual joystick (bottom-left) + attack button (bottom-right).
 */
export class UIScene extends Phaser.Scene {
  private joystick: VirtualJoystick | null = null;
  private attackButton: Phaser.GameObjects.Arc | null = null;
  private isAttacking = false;
  private isMobile = false;

  constructor() {
    super({ key: 'UIScene' });
  }

  create(): void {
    this.isMobile = this.sys.game.device.input.touch;

    if (this.isMobile) {
      const { width, height } = this.cameras.main;
      this.joystick = new VirtualJoystick(this, 100, height - 100, 40);
      this.createAttackButton(width - 80, height - 100);
    }
  }

  /* ── Attack button (bottom-right) ── */

  private createAttackButton(x: number, y: number): void {
    this.attackButton = this.add.circle(x, y, 35, 0xff0000, 0.35);
    this.attackButton.setStrokeStyle(2, 0xff4444, 0.7);
    this.attackButton.setDepth(1000);
    this.attackButton.setInteractive();

    this.add.text(x, y, '⚔', { fontSize: '22px' })
      .setOrigin(0.5)
      .setDepth(1001);

    this.attackButton.on('pointerdown', () => { this.isAttacking = true; });
    this.attackButton.on('pointerup', () => { this.isAttacking = false; });
    this.attackButton.on('pointerout', () => { this.isAttacking = false; });
  }

  /* ── Public API (called by GameScene) ── */

  getJoystickState(): JoystickState {
    return this.joystick?.getState() ?? { direction: { x: 0, y: 0 }, isActive: false };
  }

  isAttackPressed(): boolean {
    return this.isAttacking;
  }
}
