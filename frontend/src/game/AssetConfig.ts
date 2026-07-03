/**
 * AssetConfig — Asset path configuration for 《CỔ ĐẠO》.
 *
 * All asset paths are defined HERE and nowhere else.
 * When assets are replaced (e.g. new sprites shipped by artist),
 * update this file — zero gameplay code changes required.
 *
 * Key naming convention: TYPE_IDENTIFIER (e.g. CHARACTER_PLAYER, MAP_BAC_NGUYEN)
 */

// When using Vite with publicDir pointing to workspace assets/,
// files are served at root (no /assets prefix needed).
const BASE = '';

/* ───── Character & NPC ───── */

export const CHARACTER_PLAYER = `${BASE}/characters/char_1.png` as const;

export const NPC_PLACEHOLDERS = [
  `${BASE}/characters/char_2.png`,
  `${BASE}/characters/char_3.png`,
  `${BASE}/characters/char_4.png`,
  `${BASE}/characters/char_5.png`,
  `${BASE}/characters/char_6.png`,
  `${BASE}/characters/char_7.png`,
  `${BASE}/characters/char_8.png`,
  `${BASE}/characters/char_9.png`,
  `${BASE}/characters/char_10.png`,
] as const;

/* ───── Monsters ───── */

export const MONSTER_SPRITES = [
  `${BASE}/monsters/monster_1.png`,
  `${BASE}/monsters/monster_2.png`,
  `${BASE}/monsters/monster_3.png`,
  `${BASE}/monsters/monster_4.png`,
  `${BASE}/monsters/monster_5.png`,
  `${BASE}/monsters/monster_6.png`,
  `${BASE}/monsters/monster_7.png`,
  `${BASE}/monsters/monster_8.png`,
  `${BASE}/monsters/monster_9.png`,
  `${BASE}/monsters/monster_10.png`,
  `${BASE}/monsters/monster_11.png`,
] as const;

/* ───── Bosses ───── */

export const BOSS_SPRITES = [
  `${BASE}/bosses/boss_1.png`,
  `${BASE}/bosses/boss_2.png`,
  `${BASE}/bosses/boss_3.png`,
  `${BASE}/bosses/boss_4.png`,
  `${BASE}/bosses/boss_5.png`,
] as const;

/* ───── Maps ───── */

export const MAP_BAC_NGUYEN = `${BASE}/maps/map_bac_nguyen.png` as const;
export const MAP_NAM_CUONG = `${BASE}/maps/map_nam_cuong.png` as const;
export const MAP_DONG_HAI = `${BASE}/maps/map_dong_hai.png` as const;
export const MAP_TAY_MAC = `${BASE}/maps/map_tay_mac.png` as const;
export const MAP_TRUNG_CHAU = `${BASE}/maps/map_trung_chau.png` as const;

export const MAPS_BY_ID: Record<string, string> = {
  // Short codes (legacy)
  bnp: MAP_BAC_NGUYEN,
  ncp: MAP_NAM_CUONG,
  dhp: MAP_DONG_HAI,
  tmp: MAP_TAY_MAC,
  tcp: MAP_TRUNG_CHAU,
  // Full region names (used in database seed: world_maps.region)
  bac_nguyen: MAP_BAC_NGUYEN,
  nam_cuong: MAP_NAM_CUONG,
  dong_hai: MAP_DONG_HAI,
  tay_mac: MAP_TAY_MAC,
  trung_chau: MAP_TRUNG_CHAU,
};

/* ───── Equipment ───── */

export const EQUIPMENT_WEAPON = {
  H: `${BASE}/equipment/eq_vu_khi_h.png`,
  PT: `${BASE}/equipment/eq_vu_khi_pt.png`,
  ST: `${BASE}/equipment/eq_vu_khi_st.png`,
  TL: `${BASE}/equipment/eq_vu_khi_tl.png`,
} as const;

export const EQUIPMENT_ARMOR = {
  H: `${BASE}/equipment/eq_giap_h.png`,
  PT: `${BASE}/equipment/eq_giap_pt.png`,
  ST: `${BASE}/equipment/eq_giap_st.png`,
  TL: `${BASE}/equipment/eq_giap_tl.png`,
} as const;

export const EQUIPMENT_ACCESSORY = {
  H: `${BASE}/equipment/eq_phukien_h.png`,
  PT: `${BASE}/equipment/eq_phukien_pt.png`,
  ST: `${BASE}/equipment/eq_phukien_st.png`,
  TL: `${BASE}/equipment/eq_phukien_tl.png`,
} as const;

/* ───── Gu (Skillbooks as placeholders) ───── */

export const GU_PLACEHOLDERS = [
  `${BASE}/skillbooks/skillbook_grade_1.png`,
  `${BASE}/skillbooks/skillbook_grade_2.png`,
  `${BASE}/skillbooks/skillbook_grade_3.png`,
  `${BASE}/skillbooks/skillbook_grade_4.png`,
  `${BASE}/skillbooks/skillbook_grade_5.png`,
] as const;

/** Fallback for Gu rank 6-9 (not yet in assets) */
export const GU_PLACEHOLDER_FALLBACK = GU_PLACEHOLDERS[4];

/* ───── UI ───── */

export const UI_APP_ICON = `${BASE}/ui/app_icon.png` as const;
export const UI_FRAME_DIALOGUE_BOX = `${BASE}/ui/frame_dialogue_box.png` as const;
export const UI_FRAME_MODAL = `${BASE}/ui/frame_modal.png` as const;

export const UI_ICONS = {
  audioOn: `${BASE}/ui/icon_audio_on.png`,
  audioOff: `${BASE}/ui/icon_audio_off.png`,
  confirmCheck: `${BASE}/ui/icon_confirm_check.png`,
  essence: `${BASE}/ui/icon_essence.png`,
  exp: `${BASE}/ui/icon_exp.png`,
  hp: `${BASE}/ui/icon_hp.png`,
  joystickBase: `${BASE}/ui/icon_joystick_base.png`,
  joystickKnob: `${BASE}/ui/icon_joystick_knob.png`,
  linhThach: `${BASE}/ui/icon_linh_thach.png`,
  lock: `${BASE}/ui/icon_lock.png`,
  navCharacter: `${BASE}/ui/icon_nav_character.png`,
  navInventory: `${BASE}/ui/icon_nav_inventory.png`,
  navMap: `${BASE}/ui/icon_nav_map.png`,
  navShop: `${BASE}/ui/icon_nav_shop.png`,
  navStory: `${BASE}/ui/icon_nav_story.png`,
  portal: `${BASE}/ui/icon_portal.png`,
  resourceChest: `${BASE}/ui/icon_resource_chest.png`,
  toastError: `${BASE}/ui/icon_toast_error.png`,
  toastSuccess: `${BASE}/ui/icon_toast_success.png`,
  toastWarning: `${BASE}/ui/icon_toast_warning.png`,
} as const;

/* ───── Audio ───── */

export const AUDIO_BGM_MAIN = `${BASE}/audio/bgm_main.mp3` as const;

/* ───── Aggregated keys for Phaser preloading ───── */

/** Keys used when loading assets into the Phaser cache. */
export const ASSET_KEYS = {
  player: 'player',
  map: 'map',
  npc: 'npc',
  monster: 'monster',
  boss: 'boss',
  equipment: 'equipment',
  gu: 'gu',
  ui: 'ui',
  bgm: 'bgm',
} as const;

export type AssetType = keyof typeof ASSET_KEYS;
