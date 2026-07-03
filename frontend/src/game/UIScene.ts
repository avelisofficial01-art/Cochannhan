import Phaser from 'phaser';

/**
 * UIScene — Overlay HUD scene that runs in parallel with GameScene.
 *
 * Responsibilities:
 *  - Display persistent HUD elements on top of gameplay.
 *  - Listen for events from GameScene to update UI state.
 *  - FUTURE: Dialogue box, notifications, minimap, player stats bar.
 *
 * This scene is launched by GameScene and remains active throughout gameplay.
 */
export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' });
  }

  create(): void {
    // UIScene runs as an overlay — transparent background.
    // HUD elements (cooldown bar, hints) are rendered inside GameScene
    // for direct access to the update loop and combat state.
    // This scene is a skeleton for future overlay UI (dialogue, notifications).

    // Listen for custom events from GameScene
    const gameScene = this.scene.get('GameScene');
    if (gameScene) {
      gameScene.events.on('show-dialogue', this.showDialogue, this);
      gameScene.events.on('show-notification', this.showNotification, this);
    }
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  private showDialogue(_data: unknown): void {
    // FUTURE: Render dialogue box overlay using UI frame asset + text
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  private showNotification(_message: string): void {
    // FUTURE: Toast notification system
  }
}
