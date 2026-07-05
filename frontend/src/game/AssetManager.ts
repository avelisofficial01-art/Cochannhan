/**
 * AssetManager — Centralised asset loading & lookup for 《CỔ ĐẠO》.
 *
 * Responsibilities:
 *  - Preload all assets into the Phaser texture/audio cache.
 *  - Provide typed helpers to retrieve the correct key for any asset.
 *  - Abstract the file path → Phaser key mapping so that future asset
 *    swaps only require changes to AssetConfig.ts.
 *
 * Usage (in a Phaser Scene):
 *   AssetManager.preloadScene(this);
 *   …
 *   this.add.image(0, 0, AssetManager.getPlayerKey());
 */

import Phaser from 'phaser';
import {
  ASSET_KEYS,
  CHARACTER_PLAYER,
  MAPS_BY_ID,
  MONSTER_SPRITES,
  BOSS_SPRITES,
  GU_PLACEHOLDERS,
  EQUIPMENT_WEAPON,
  EQUIPMENT_ARMOR,
  EQUIPMENT_ACCESSORY,
  NPC_PLACEHOLDERS,
  UI_ICONS,
  UI_FRAME_DIALOGUE_BOX,
  UI_FRAME_MODAL,
  UI_APP_ICON,
  AUDIO_BGM_MAIN,
  type AssetType,
} from './AssetConfig.js';

/* ============================================================================
 *  Preloading
 * ============================================================================ */

/**
 * Register every known game asset with the Phaser Loader.
 * Call this once in the `preload()` method of your boot / game scene.
 */
export function preloadScene(scene: Phaser.Scene): void {
  /* ── Characters & NPCs ── */
  scene.load.image(ASSET_KEYS.player, CHARACTER_PLAYER);
  NPC_PLACEHOLDERS.forEach((path, idx) => {
    scene.load.image(`${ASSET_KEYS.npc}_${idx}`, path);
  });

  /* ── Monsters ── */
  MONSTER_SPRITES.forEach((path, idx) => {
    scene.load.image(`${ASSET_KEYS.monster}_${idx + 1}`, path);
  });

  /* ── Bosses ── */
  BOSS_SPRITES.forEach((path, idx) => {
    scene.load.image(`${ASSET_KEYS.boss}_${idx + 1}`, path);
  });

  /* ── Maps ── */
  Object.entries(MAPS_BY_ID).forEach(([mapId, path]) => {
    scene.load.image(`${ASSET_KEYS.map}_${mapId}`, path);
  });

  /* ── Gu Placeholders ── */
  GU_PLACEHOLDERS.forEach((path, idx) => {
    scene.load.image(`${ASSET_KEYS.gu}_${idx + 1}`, path);
  });

  /* ── Equipment ── */
  preloadEquipmentGroup(scene, 'weapon', EQUIPMENT_WEAPON);
  preloadEquipmentGroup(scene, 'armor', EQUIPMENT_ARMOR);
  preloadEquipmentGroup(scene, 'accessory', EQUIPMENT_ACCESSORY);

  /* ── UI ── */
  scene.load.image(`${ASSET_KEYS.ui}_app_icon`, UI_APP_ICON);
  scene.load.image(`${ASSET_KEYS.ui}_frame_dialogue`, UI_FRAME_DIALOGUE_BOX);
  scene.load.image(`${ASSET_KEYS.ui}_frame_modal`, UI_FRAME_MODAL);
  Object.entries(UI_ICONS).forEach(([name, path]) => {
    scene.load.image(`${ASSET_KEYS.ui}_${name}`, path);
  });

  /* ── Audio ── */
  scene.load.audio(`${ASSET_KEYS.bgm}_main`, AUDIO_BGM_MAIN);
}

/* ============================================================================
 *  Lookup helpers
 * ============================================================================ */

/**
 * Return the Phaser texture key for the player sprite.
 */
export function getPlayerKey(): string {
  return ASSET_KEYS.player;
}

/**
 * Return the Phaser texture key for an NPC placeholder (index 0-8).
 */
export function getNpcKey(index: number): string {
  const idx = index % NPC_PLACEHOLDERS.length;
  return `${ASSET_KEYS.npc}_${idx}`;
}

/**
 * Return the Phaser texture key for a monster sprite (index 1-11).
 */
export function getMonsterKey(index: number): string {
  const idx = Math.max(1, Math.min(index, MONSTER_SPRITES.length));
  return `${ASSET_KEYS.monster}_${idx}`;
}

/**
 * Return the Phaser texture key for a boss sprite (index 1-5).
 */
export function getBossKey(index: number): string {
  const idx = Math.max(1, Math.min(index, BOSS_SPRITES.length));
  return `${ASSET_KEYS.boss}_${idx}`;
}

/**
 * Return the Phaser texture key for a map by its logical ID (e.g. "bnp").
 */
export function getMapKey(mapId: string): string {
  const key = `${ASSET_KEYS.map}_${mapId}`;
  // Fallback to first available map if the ID is unknown
  if (!(mapId in MAPS_BY_ID)) {
    return `${ASSET_KEYS.map}_bnp`;
  }
  return key;
}

/**
 * Return the Phaser texture key for a Gu placeholder (rank 1-5).
 * Rank 6-9 falls back to rank 5.
 */
export function getGuKey(rank: number): string {
  const idx = Math.max(1, Math.min(rank, GU_PLACEHOLDERS.length));
  return `${ASSET_KEYS.gu}_${idx}`;
}

/**
 * Return the Gu fallback texture key (for ranks without own sprite).
 */
export function getGuFallbackKey(): string {
  return `${ASSET_KEYS.gu}_${GU_PLACEHOLDERS.length}`;
}

/**
 * Return the Phaser texture key for equipment.
 *
 * @param slot  - 'weapon' | 'armor' | 'accessory'
 * @param tier  - 'H' | 'PT' | 'ST' | 'TL'
 */
export function getEquipmentKey(
  slot: 'weapon' | 'armor' | 'accessory',
  tier: 'H' | 'PT' | 'ST' | 'TL',
): string {
  return `${ASSET_KEYS.equipment}_${slot}_${tier}`;
}

/**
 * Return the Phaser texture key for a UI element.
 */
export function getUiKey(name: string): string {
  return `${ASSET_KEYS.ui}_${name}`;
}

/**
 * Return the Phaser audio key for the main BGM.
 */
export function getBgmKey(): string {
  return `${ASSET_KEYS.bgm}_main`;
}

/**
 * Get the AssetType for a given Phaser texture key.
 * Returns the base type (player, monster, boss, etc.) stripped of indices.
 */
export function classifyKey(key: string): AssetType | null {
  if (key === ASSET_KEYS.player) return 'player';
  if (key.startsWith(ASSET_KEYS.npc)) return 'npc';
  if (key.startsWith(ASSET_KEYS.monster)) return 'monster';
  if (key.startsWith(ASSET_KEYS.boss)) return 'boss';
  if (key.startsWith(ASSET_KEYS.map)) return 'map';
  if (key.startsWith(ASSET_KEYS.equipment)) return 'equipment';
  if (key.startsWith(ASSET_KEYS.gu)) return 'gu';
  if (key.startsWith(ASSET_KEYS.ui)) return 'ui';
  if (key.startsWith(ASSET_KEYS.bgm)) return 'bgm';
  return null;
}

/* ============================================================================
 *  Helpers
 * ============================================================================ */

function preloadEquipmentGroup(
  scene: Phaser.Scene,
  slot: string,
  tiers: Record<string, string>,
): void {
  Object.entries(tiers).forEach(([tier, path]) => {
    scene.load.image(`${ASSET_KEYS.equipment}_${slot}_${tier}`, path);
  });
}
