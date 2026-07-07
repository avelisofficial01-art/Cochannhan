// ============================================================
// GAMEPLAY SEED DATA
// ============================================================

export const bodyConstitutionSeeds = [
  {
    id: 1,
    name: 'Đại Lực Chân Vũ Thể',
    description: 'Thể chất lấy sức mạnh và sinh mệnh làm căn cơ, thích hợp lối đánh trực diện.',
    stat_bonuses: { hp_pct: 40, atk_pct: 15 },
    passive_ability: 'dai_luc_chan_vu',
    passive_description: 'Tăng mạnh HP và sát thương vật lý khi giao chiến lâu dài.',
    weakness: 'Tốc độ và né tránh thấp.',
    realm_scaling: true,
    rarity: 'legendary',
  },
  {
    id: 2,
    name: 'Bắc Minh Băng Phách Thể',
    description: 'Thể chất thiên về băng đạo, khí tức lạnh lẽo, khống chế tốt nhưng thể lực mỏng.',
    stat_bonuses: { mana_pct: 35, def_pct: 10 },
    passive_ability: 'bang_phach',
    passive_description: 'Có xác suất làm chậm mục tiêu khi tấn công.',
    weakness: 'HP thấp hơn các thể cận chiến.',
    realm_scaling: true,
    rarity: 'legendary',
  },
  {
    id: 3,
    name: 'Cổ Nguyệt Âm Hoang Thể',
    description: 'Thể chất âm hàn, phù hợp nuôi dưỡng Gu bí thuật và đánh lâu dài.',
    stat_bonuses: { mana_pct: 25, cooldown_reduction: 10 },
    passive_ability: 'am_hoang',
    passive_description: 'Giảm tiêu hao mana của kỹ năng Gu.',
    weakness: 'Sát thương bộc phát không cao.',
    realm_scaling: true,
    rarity: 'legendary',
  },
  {
    id: 4,
    name: 'Viêm Hoàng Lôi Trạch Thể',
    description: 'Thể chất hỏa lôi, sát thương bộc phát mạnh, thích hợp kết thúc nhanh trận đấu.',
    stat_bonuses: { atk_pct: 30, crit_rate: 10 },
    passive_ability: 'loi_hoa',
    passive_description: 'Đòn chí mạng gây thêm sát thương hỏa lôi.',
    weakness: 'Phòng thủ thấp.',
    realm_scaling: true,
    rarity: 'legendary',
  },
  {
    id: 5,
    name: 'Sâm La Vạn Tượng Thể',
    description: 'Thể chất biến hóa đa dạng, cân bằng giữa sinh tồn, tài nguyên và chiến đấu.',
    stat_bonuses: { all_stats_pct: 10 },
    passive_ability: 'van_tuong',
    passive_description: 'Tăng nhẹ toàn bộ chỉ số cơ bản.',
    weakness: 'Không có điểm bùng nổ rõ rệt.',
    realm_scaling: false,
    rarity: 'legendary',
  },
  {
    id: 6,
    name: 'Kim Cang Bất Hoại Thể',
    description: 'Thể chất phòng ngự kiên cố, lấy chịu đòn và phản kích làm sở trường.',
    stat_bonuses: { hp_pct: 20, def_pct: 35 },
    passive_ability: 'bat_hoai',
    passive_description: 'Giảm sát thương nhận vào khi HP thấp.',
    weakness: 'Tốc độ tấn công chậm.',
    realm_scaling: true,
    rarity: 'legendary',
  },
  {
    id: 7,
    name: 'Thanh Mộc Trường Sinh Thể',
    description: 'Thể chất sinh cơ dồi dào, hồi phục tốt, thích hợp người chơi mới.',
    stat_bonuses: { hp_regen: 5, hp_pct: 20 },
    passive_ability: 'truong_sinh',
    passive_description: 'Hồi phục HP theo thời gian ngoài giao tranh.',
    weakness: 'Thiếu sát thương dứt điểm.',
    realm_scaling: true,
    rarity: 'epic',
  },
  {
    id: 8,
    name: 'Huyết Hải Tu La Thể',
    description: 'Thể chất càng bị thương càng hung hãn, mạnh trong những trận chiến nguy hiểm.',
    stat_bonuses: { life_steal_pct: 12, atk_pct: 15 },
    passive_ability: 'huyet_hai',
    passive_description: 'Hút máu một phần sát thương gây ra.',
    weakness: 'Cần duy trì giao tranh để phát huy.',
    realm_scaling: true,
    rarity: 'epic',
  },
  {
    id: 9,
    name: 'Không Khiếu Linh Lung Thể',
    description: 'Thể chất thiên về điều khiển chân nguyên và phối hợp nhiều loại Gu.',
    stat_bonuses: { mana_pct: 30, skill_multiplier_pct: 15 },
    passive_ability: 'linh_lung',
    passive_description: 'Tăng hiệu quả kỹ năng Gu.',
    weakness: 'Phụ thuộc vào trang bị và Gu.',
    realm_scaling: false,
    rarity: 'epic',
  },
  {
    id: 10,
    name: 'Vô Tướng Thiên Ma Thể',
    description: 'Thể chất khó đoán, khởi đầu yếu nhưng tiềm năng phát triển đa hướng.',
    stat_bonuses: { all_stats_pct: 5, drop_rate_pct: 10 },
    passive_ability: 'vo_tuong',
    passive_description: 'Tăng nhẹ toàn diện và mở nhiều hướng phát triển về sau.',
    weakness: 'Giai đoạn đầu không nổi bật.',
    realm_scaling: false,
    rarity: 'epic',
  },
];

export const cultivationRealmSeeds = [
  { id: 1, name: 'Nhất Chuyển', level: 1, exp_required: 0, max_hp_bonus: 0, max_mana_bonus: 0, atk_bonus: 0, def_bonus: 0, breakthrough_gold: 0, description: 'Phàm nhân vừa khai khiếu, bắt đầu tiếp xúc Gu đạo.' },
  { id: 2, name: 'Nhị Chuyển', level: 2, exp_required: 1000, max_hp_bonus: 40, max_mana_bonus: 20, atk_bonus: 8, def_bonus: 4, breakthrough_gold: 1000, description: 'Chân nguyên ổn định hơn, có thể điều khiển Gu thành thục.' },
  { id: 3, name: 'Tam Chuyển', level: 3, exp_required: 5000, max_hp_bonus: 100, max_mana_bonus: 60, atk_bonus: 20, def_bonus: 10, breakthrough_gold: 5000, description: 'Bước vào hàng tinh anh trong phàm tục.' },
  { id: 4, name: 'Tứ Chuyển', level: 4, exp_required: 20000, max_hp_bonus: 220, max_mana_bonus: 140, atk_bonus: 45, def_bonus: 25, breakthrough_gold: 20000, description: 'Có thể trấn giữ một phương, chiến lực vượt xa người thường.' },
  { id: 5, name: 'Ngũ Chuyển', level: 5, exp_required: 100000, max_hp_bonus: 500, max_mana_bonus: 320, atk_bonus: 100, def_bonus: 60, breakthrough_gold: 100000, description: 'Đỉnh cao phàm nhân, cách tiên phàm chi biệt một bước.' },
  { id: 6, name: 'Lục Chuyển Cổ Tiên', level: 6, exp_required: 500000, max_hp_bonus: 1200, max_mana_bonus: 900, atk_bonus: 260, def_bonus: 160, breakthrough_gold: 500000, description: 'Thăng tiên, mở ra cục diện hoàn toàn mới.' },
  { id: 7, name: 'Thất Chuyển Cổ Tiên', level: 7, exp_required: 2000000, max_hp_bonus: 2500, max_mana_bonus: 1800, atk_bonus: 560, def_bonus: 360, breakthrough_gold: 2000000, description: 'Tiên nhân mạnh mẽ, đủ sức tranh đoạt tài nguyên rộng lớn.' },
  { id: 8, name: 'Bát Chuyển Cổ Tiên', level: 8, exp_required: 10000000, max_hp_bonus: 5200, max_mana_bonus: 4000, atk_bonus: 1200, def_bonus: 780, breakthrough_gold: 10000000, description: 'Cường giả bát chuyển, nhất cử nhất động ảnh hưởng đại cục.' },
  { id: 9, name: 'Cửu Chuyển Tôn Giả', level: 9, exp_required: 99999999, max_hp_bonus: 12000, max_mana_bonus: 9000, atk_bonus: 3000, def_bonus: 2000, breakthrough_gold: 99999999, description: 'Tầng cao nhất của Gu giới, gần như đứng trên thời đại.' },
];

export const itemSeeds = [
  { ref: 'spirit_stone_low', name: 'Hạ Phẩm Nguyên Thạch', type: 'currency', rarity: 'common', description: 'Nguyên thạch cấp thấp dùng trong tu luyện và giao dịch.', effects: { spirit_stone: 1 }, stack_limit: 999, sell_price: 1 },
  { ref: 'herb_bloodgrass', name: 'Huyết Thảo', type: 'material', rarity: 'common', description: 'Dược thảo thường thấy quanh Bắc Nguyên thôn.', effects: {}, stack_limit: 99, sell_price: 3 },
  { ref: 'wolf_fang', name: 'Răng Sói Hoang', type: 'material', rarity: 'common', description: 'Răng sắc của sói hoang, dùng luyện khí và chế tác.', effects: {}, stack_limit: 99, sell_price: 5 },
  { ref: 'healing_pellet', name: 'Hồi Huyết Đan', type: 'consumable', rarity: 'common', description: 'Đan dược sơ cấp hồi phục HP.', effects: { heal_hp: 60 }, stack_limit: 20, sell_price: 12 },
  { ref: 'mana_pellet', name: 'Bổ Nguyên Đan', type: 'consumable', rarity: 'common', description: 'Đan dược sơ cấp hồi phục mana.', effects: { restore_mana: 35 }, stack_limit: 20, sell_price: 12 },
  { ref: 'iron_ore', name: 'Thiết Khoáng', type: 'material', rarity: 'common', description: 'Khoáng thạch dùng chế tạo trang bị sơ cấp.', effects: {}, stack_limit: 99, sell_price: 4 },
];

export const equipmentSeeds = [
  { ref: 'novice_robe', name: 'Áo Vải Tân Thủ', slot: 'armor', rarity: 'common', required_realm: 1, stat_bonuses: { hp: 20, def: 2 }, description: 'Áo vải đơn giản cho người mới khai khiếu.' },
  { ref: 'bone_blade', name: 'Cốt Đao Thô', slot: 'weapon', rarity: 'common', required_realm: 1, stat_bonuses: { atk: 6 }, description: 'Lưỡi đao thô sơ làm từ xương thú.' },
  { ref: 'wolfhide_boots', name: 'Giày Da Sói', slot: 'boots', rarity: 'common', required_realm: 1, stat_bonuses: { spd: 3, def: 1 }, description: 'Giày nhẹ làm từ da sói hoang.' },
];

export const guSeeds = [
  { ref: 'moonlight_gu', name: 'Nguyệt Quang Cổ', type: 'attack', rank: 1, dao_affinity: 'light', description: 'Cổ trùng cơ bản phóng nguyệt nhận công kích.', effects: { atk_multiplier: 1.2, mana_cost: 8 } },
  { ref: 'white_boar_gu', name: 'Bạch Trư Cổ', type: 'body', rank: 1, dao_affinity: 'strength', description: 'Cổ trùng tăng lực đạo thân thể.', effects: { atk_bonus: 5, hp_bonus: 20 } },
  { ref: 'grass_heal_gu', name: 'Sinh Thảo Cổ', type: 'support', rank: 1, dao_affinity: 'wood', description: 'Cổ trùng hỗ trợ hồi phục nhẹ.', effects: { heal: 30, mana_cost: 10 } },
];

export const monsterSeeds = [
  { ref: 'wild_wolf', name: 'Sói Hoang Bắc Nguyên', realm: 1, hp: 80, atk: 10, def: 3, spd: 7, exp_reward: 25, gold_reward: 8, respawn_time: 180, ai_type: 'aggressive', drop_table: [{ item_ref: 'wolf_fang', chance: 45, quantity: 1 }, { item_ref: 'spirit_stone_low', chance: 20, quantity: 1 }] },
  { ref: 'blood_rabbit', name: 'Huyết Thố', realm: 1, hp: 55, atk: 7, def: 2, spd: 10, exp_reward: 18, gold_reward: 5, respawn_time: 120, ai_type: 'passive', drop_table: [{ item_ref: 'herb_bloodgrass', chance: 35, quantity: 1 }] },
  { ref: 'bandit_scout', name: 'Thám Tử Sơn Tặc', realm: 2, hp: 140, atk: 18, def: 8, spd: 8, exp_reward: 55, gold_reward: 18, respawn_time: 300, ai_type: 'aggressive', drop_table: [{ item_ref: 'healing_pellet', chance: 15, quantity: 1 }, { item_ref: 'spirit_stone_low', chance: 40, quantity: 2 }] },
  { ref: 'wolf_king', name: 'Lang Vương', realm: 3, hp: 420, atk: 42, def: 18, spd: 12, exp_reward: 250, gold_reward: 80, respawn_time: 900, ai_type: 'boss', drop_table: [{ item_ref: 'wolf_fang', chance: 100, quantity: 4 }, { item_ref: 'healing_pellet', chance: 40, quantity: 2 }] },
];

export const worldMapSeeds = [
  { id: 'bac_nguyen_village', name: 'Bắc Nguyên Thôn', region: 'bac_nguyen', recommended_realm: 1, is_safe_zone: 'true', background: 'map_bac_nguyen', width: 3200, height: 2400 },
  { id: 'bac_nguyen_field', name: 'Đồng Hoang Bắc Nguyên', region: 'bac_nguyen', recommended_realm: 1, is_safe_zone: 'false', background: 'map_field', width: 3600, height: 2600 },
  { id: 'wolf_forest', name: 'Lang Lâm', region: 'bac_nguyen', recommended_realm: 2, is_safe_zone: 'false', background: 'map_forest', width: 3600, height: 2600 },
  { id: 'bandit_camp', name: 'Sơn Trại Hoang', region: 'bac_nguyen', recommended_realm: 2, is_safe_zone: 'false', background: 'map_camp', width: 3000, height: 2200 },
  { id: 'nam_cuong_border', name: 'Nam Cương Biên Giới', region: 'nam_cuong', recommended_realm: 3, is_safe_zone: 'false', background: 'map_border', width: 3600, height: 2600 },
];

export const mapPortalSeeds = [
  { from_map_id: 'bac_nguyen_village', to_map_id: 'bac_nguyen_field', from_x: 2920, from_y: 1180, to_x: 260, to_y: 1200, label: 'Ra đồng hoang', min_realm: 1 },
  { from_map_id: 'bac_nguyen_field', to_map_id: 'bac_nguyen_village', from_x: 160, from_y: 1200, to_x: 2820, to_y: 1180, label: 'Về Bắc Nguyên Thôn', min_realm: 1 },
  { from_map_id: 'bac_nguyen_field', to_map_id: 'wolf_forest', from_x: 3300, from_y: 900, to_x: 260, to_y: 920, label: 'Vào Lang Lâm', min_realm: 1 },
  { from_map_id: 'wolf_forest', to_map_id: 'bac_nguyen_field', from_x: 160, from_y: 920, to_x: 3200, to_y: 900, label: 'Về đồng hoang', min_realm: 1 },
  { from_map_id: 'wolf_forest', to_map_id: 'bandit_camp', from_x: 3300, from_y: 1600, to_x: 260, to_y: 1600, label: 'Đến sơn trại', min_realm: 2 },
  { from_map_id: 'bandit_camp', to_map_id: 'wolf_forest', from_x: 160, from_y: 1600, to_x: 3200, to_y: 1600, label: 'Rời sơn trại', min_realm: 1 },
  { from_map_id: 'bandit_camp', to_map_id: 'nam_cuong_border', from_x: 2760, from_y: 1000, to_x: 320, to_y: 1100, label: 'Đi Nam Cương', min_realm: 3 },
  { from_map_id: 'nam_cuong_border', to_map_id: 'bandit_camp', from_x: 220, from_y: 1100, to_x: 2660, to_y: 1000, label: 'Về Bắc Nguyên', min_realm: 1 },
];

export const mapSpawnSeeds = [
  { map_id: 'bac_nguyen_field', monster_ref: 'blood_rabbit', spawn_x: 900, spawn_y: 900, max_count: 4 },
  { map_id: 'bac_nguyen_field', monster_ref: 'wild_wolf', spawn_x: 1800, spawn_y: 1300, max_count: 3 },
  { map_id: 'wolf_forest', monster_ref: 'wild_wolf', spawn_x: 1200, spawn_y: 900, max_count: 5 },
  { map_id: 'wolf_forest', monster_ref: 'wolf_king', spawn_x: 2600, spawn_y: 1400, max_count: 1 },
  { map_id: 'bandit_camp', monster_ref: 'bandit_scout', spawn_x: 1500, spawn_y: 1200, max_count: 4 },
];

export const dialogueSeeds = [
  {
    id: 'dlg_village_chief_intro',
    speaker: 'Trưởng Thôn',
    text: 'Ngươi đã khai khiếu rồi sao? Bắc Nguyên không dung kẻ yếu. Nếu muốn sống, hãy học cách tự bước đi trên Gu đạo.',
    choices: [{ text: 'Ta đã chuẩn bị.', nextDialogueId: 'dlg_village_chief_accept' }],
    next_dialogue_id: null,
    flag_key: null,
    flag_value: null,
  },
  {
    id: 'dlg_village_chief_accept',
    speaker: 'Trưởng Thôn',
    text: 'Tốt. Ra đồng hoang thu thập Huyết Thảo và quan sát động tĩnh sói hoang. Đây là thử thách đầu tiên của ngươi.',
    choices: [{ text: 'Nhận nhiệm vụ', setFlag: 'ch1_intro_done', close: true }],
    next_dialogue_id: null,
    flag_key: 'ch1_intro_done',
    flag_value: 'true',
  },
  {
    id: 'dlg_herbalist_intro',
    speaker: 'Dược Sư',
    text: 'Huyết Thảo mọc nơi khí huyết nặng. Mang về cho ta, ta có thể đổi đan dược sơ cấp cho ngươi.',
    choices: [{ text: 'Ta sẽ để ý.', close: true }],
    next_dialogue_id: null,
    flag_key: null,
    flag_value: null,
  },
  {
    id: 'dlg_guard_intro',
    speaker: 'Hộ Vệ Thôn',
    text: 'Ngoài thôn có sói hoang. Đừng chạy quá xa nếu chưa quen chiến đấu.',
    choices: [{ text: 'Đã rõ.', close: true }],
    next_dialogue_id: null,
    flag_key: null,
    flag_value: null,
  },
  {
    id: 'dlg_border_scout_intro',
    speaker: 'Trinh Sát Biên Giới',
    text: 'Phía trước là đường sang Nam Cương. Nếu chưa đủ thực lực, quay lại vẫn còn kịp.',
    choices: [{ text: 'Ta hiểu.', close: true }],
    next_dialogue_id: null,
    flag_key: null,
    flag_value: null,
  },
];

export const npcSeeds = [
  { name: 'Trưởng Thôn', role: 'quest', map_id: 'bac_nguyen_village', x: 1520, y: 1120, sprite: 'npc_elder', dialogue_id: 'dlg_village_chief_intro' },
  { name: 'Dược Sư', role: 'merchant', map_id: 'bac_nguyen_village', x: 1220, y: 1320, sprite: 'npc_herbalist', dialogue_id: 'dlg_herbalist_intro' },
  { name: 'Hộ Vệ Thôn', role: 'guard', map_id: 'bac_nguyen_village', x: 2550, y: 1180, sprite: 'npc_guard', dialogue_id: 'dlg_guard_intro' },
  { name: 'Trinh Sát Biên Giới', role: 'scout', map_id: 'nam_cuong_border', x: 620, y: 1100, sprite: 'npc_scout', dialogue_id: 'dlg_border_scout_intro' },
];

export const questSeeds = [
  {
    title: 'Bước Đầu Gu Đạo',
    description: 'Trưởng Thôn giao cho ngươi nhiệm vụ đầu tiên: ra đồng hoang thu thập Huyết Thảo và làm quen nguy hiểm ngoài thôn.',
    type: 'main',
    flag_required: 'ch1_intro_done',
    objectives: [{ type: 'collect', item_ref: 'herb_bloodgrass', required: 3 }, { type: 'kill', monster_ref: 'blood_rabbit', required: 2 }],
    rewards: { exp: 120, gold: 60, items: [{ item_ref: 'healing_pellet', quantity: 2 }] },
    min_realm: 1,
    is_repeatable: false,
  },
  {
    title: 'Sói Hoang Lẩn Khuất',
    description: 'Hộ Vệ Thôn nhắc đến bầy sói quanh Đồng Hoang Bắc Nguyên. Hãy tiêu diệt vài con để bảo vệ đường đi.',
    type: 'side',
    flag_required: 'ch1_intro_done',
    objectives: [{ type: 'kill', monster_ref: 'wild_wolf', required: 3 }],
    rewards: { exp: 180, gold: 90, items: [{ item_ref: 'mana_pellet', quantity: 1 }] },
    min_realm: 1,
    is_repeatable: false,
  },
  {
    title: 'Dấu Vết Lang Vương',
    description: 'Trong Lang Lâm xuất hiện Lang Vương. Hạ nó để chứng minh ngươi đã vượt qua tân thủ.',
    type: 'main',
    flag_required: 'ch1_intro_done',
    objectives: [{ type: 'kill', monster_ref: 'wolf_king', required: 1 }],
    rewards: { exp: 600, gold: 250, spirit_stone: 5 },
    min_realm: 2,
    is_repeatable: false,
  },
];

export const gameConfigSeeds = [
  { key: 'starter_map', value: 'bac_nguyen_village', description: 'Map khởi đầu của người chơi mới.' },
  { key: 'starter_x', value: '1500', description: 'Tọa độ X khởi đầu.' },
  { key: 'starter_y', value: '1200', description: 'Tọa độ Y khởi đầu.' },
];
