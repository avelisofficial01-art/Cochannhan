// ============================================================
// GAMEPLAY SEED DATA — Moved from config/index.ts
// ============================================================

// ============================================================
// 10 THẬP TUYỆT THỂ — Body Constitution Seed Data
// Nguồn: GAME_VISION.md (lore Cổ Chân Nhân)
// Mỗi Thể là một cơ chế gameplay riêng biệt, không chỉ là bộ chỉ số
// ============================================================
export const bodyConstitutionSeeds = [
  {
    id: 1,
    name: 'Xuân Thu Nguyệt Lão Thể',
    description:
      'Thể của sự hồi phục bất diệt. Mỗi giây hồi một lượng HP cố định. Khi HP xuống dưới 30%, tốc độ hồi phục tăng gấp 3. Người sở hữu gần như không thể bị hạ gục trong trận chiến kéo dài.',
    stat_bonuses: JSON.stringify({ hp_pct: 40, hp_regen: 5 }),
    passive_ability: 'truong_xuan_bat_tu',
    passive_description:
      'Trường Xuân Bất Tử — Không thể bị kill trong 2 giây sau khi HP chạm 1 (cooldown 120 giây).',
    weakness: 'Attack thấp, không có Crit.',
    realm_scaling: true,
    rarity: 'legendary',
  },
  {
    id: 2,
    name: 'Tiên Mộng Cốc Thể',
    description:
      'Thể của ảo mộng và kiểm soát. Tấn công có thể gây Mê (Stun). Mỗi 5 đòn tấn công, có 1 đòn gây Mê tự động. HP và DEF thấp nhưng bù lại bằng khả năng tránh né siêu phàm.',
    stat_bonuses: JSON.stringify({ mana_pct: 40, cooldown_reduction: 20 }),
    passive_ability: 'mong_huyen',
    passive_description:
      'Mộng Huyễn — Khi bị tấn công, có 15% xác suất hóa ảo ảnh, né tránh hoàn toàn đòn đó.',
    weakness: 'HP thấp, DEF thấp.',
    realm_scaling: true,
    rarity: 'legendary',
  },
  {
    id: 3,
    name: 'Vu Gia Thể',
    description:
      'Thể của nguyền rủa và tích lũy. Các kỹ năng gây thêm hiệu ứng Curse ngẫu nhiên. Curse chồng chất, mỗi lớp tăng sát thương. Khi địch đủ 3 Curse, mọi đòn đánh xuyên giáp hoàn toàn.',
    stat_bonuses: JSON.stringify({ element_dmg_pct: 35, status_duration_pct: 40 }),
    passive_ability: 'lao_vu_thu_khau',
    passive_description:
      'Lão Vu Thứ Khẩu — Khi địch có từ 3 Curse trở lên, mọi đòn đánh đều xuyên giáp hoàn toàn.',
    weakness: 'Kỹ năng phức tạp, yếu khi không stack đủ Curse.',
    realm_scaling: true,
    rarity: 'legendary',
  },
  {
    id: 4,
    name: 'Vạn Biến Thể',
    description:
      'Thể của sự biến hóa vô cùng. Thay đổi hình thái mỗi 30 giây, mỗi hình thái cấp bonus nguyên tố khác nhau (Hỏa/Thủy/Phong lần lượt). Khi đổi hình thái, hồi 20% HP và xóa 1 debuff.',
    stat_bonuses: JSON.stringify({ all_stats_pct: 10, element_bonus: 1 }),
    passive_ability: 'vo_cuc_bien',
    passive_description:
      'Vô Cực Biến — Khi đổi hình thái, hồi 20% HP và xóa 1 debuff.',
    weakness: 'Không ổn định, khó tối ưu build.',
    realm_scaling: false,
    rarity: 'legendary',
  },
  {
    id: 5,
    name: 'Thiên Khuyết Thể',
    description:
      'Thể của sự thiếu hụt cực đoan. HP tối đa thấp hơn 50%, nhưng mọi chỉ số tấn công tăng gấp đôi khi HP dưới 50%. Khi HP dưới 20%, bước vào Bạo Tẩu: tốc độ tấn công x2, né tránh +30%.',
    stat_bonuses: JSON.stringify({ atk_pct: 50, crit_rate: 30, crit_dmg_pct: 50, hp_pct: -50 }),
    passive_ability: 'khuyet_dao',
    passive_description:
      'Khuyết Đạo — Khi HP dưới 20%, bước vào trạng thái Bạo Tẩu: tốc độ tấn công x2, né tránh +30%.',
    weakness: 'HP rất thấp, chết nhanh nếu không kiểm soát.',
    realm_scaling: true,
    rarity: 'legendary',
  },
  {
    id: 6,
    name: 'Đồng Thai Thể',
    description:
      'Thể của Song Sinh huyền bí. Mỗi khi dùng Active Skill, triệu hồi một Phân Thân tồn tại 5 giây để tấn công cùng. Phân Thân sao chép toàn bộ Gu Skill với 50% sức mạnh.',
    stat_bonuses: JSON.stringify({ summon_power_pct: 50, atk_spd_pct: 20 }),
    passive_ability: 'song_dong',
    passive_description:
      'Song Đồng — Phân Thân sao chép toàn bộ Gu Skill của chủ nhân với 50% sức mạnh.',
    weakness: 'Phức tạp, tốn mana nhiều.',
    realm_scaling: true,
    rarity: 'legendary',
  },
  {
    id: 7,
    name: 'Nhân Quả Thể',
    description:
      'Thể của luân hồi nhân quả. Mỗi đòn đánh tích lũy "Nhân". Khi đủ 10 Nhân, tự động kích hoạt "Quả" — gây sát thương bùng nổ bằng tổng sát thương đã tích lũy. Khi chết với đủ 5 Nhân, hồi sinh.',
    stat_bonuses: JSON.stringify({ skill_multiplier_pct: 40, accuracy: 20 }),
    passive_ability: 'nhan_qua_luan_hoi',
    passive_description:
      'Nhân Quả Luân Hồi — Khi chết, nếu đủ 5 Nhân, hồi sinh với 30% HP (một lần mỗi map).',
    weakness: 'Sát thương bình thường thấp, phụ thuộc vào cơ chế tích lũy.',
    realm_scaling: true,
    rarity: 'legendary',
  },
  {
    id: 8,
    name: 'Cốc Thần Thể',
    description:
      'Thể của tài nguyên và kinh tế. Mọi quái bị giết rơi thêm 50% tài nguyên. Khi ở trạng thái "Phú Quý" (sau khi nhặt đủ 100 vàng), mọi chỉ số tăng 20%. Lưu trữ được thêm 2 slot Gu.',
    stat_bonuses: JSON.stringify({ drop_rate_pct: 50, gold_find_pct: 50, craft_speed_pct: 30 }),
    passive_ability: 'than_kho',
    passive_description:
      'Thần Khố — Có thể lưu trữ thêm 2 slot Gu ngoài giới hạn thông thường (không dùng để chiến đấu, chỉ lưu trữ).',
    weakness: 'Chiến đấu yếu nhất trong 10 Thể, chủ yếu phục vụ kinh tế.',
    realm_scaling: false,
    rarity: 'epic',
  },
  {
    id: 9,
    name: 'Huyết Chiến Thể',
    description:
      'Thể của chiến đấu liên miên. Mỗi lần nhận sát thương, tích lũy "Huyết Hận". Huyết Hận tăng ATK và Crit, tối đa 10 lớp. Khi chiến đấu liên tục, hồi 1% HP mỗi giây.',
    stat_bonuses: JSON.stringify({ life_steal_pct: 15, counter_dmg_pct: 30 }),
    passive_ability: 'huyet_chien_vo_hoan',
    passive_description:
      'Huyết Chiến Vô Hoàn — Khi đang chiến đấu liên tục (không rời combat quá 3 giây), hồi 1% HP mỗi giây.',
    weakness: 'Phải nhận đòn để mạnh, không phù hợp né đòn.',
    realm_scaling: true,
    rarity: 'epic',
  },
  {
    id: 10,
    name: 'Không Thể (Vô Thể)',
    description:
      'Thể của trống rỗng tuyệt đối. Không có Stat đặc biệt, không có Passive cố định. Nhưng có thể học thêm Passive từ bất kỳ Thể nào khác thông qua Quest ẩn. Mỗi Quest Legendary hoàn thành ngẫu nhiên nhận 1 skill từ Thể khác (tối đa 3).',
    stat_bonuses: JSON.stringify({ all_stats_pct: 1 }),
    passive_ability: 'vo_cuc',
    passive_description:
      'Vô Cực — Mỗi khi hoàn thành một Quest Legendary, ngẫu nhiên nhận 1 skill từ Thể khác (tối đa 3).',
    weakness: 'Yếu nhất ban đầu, cần đầu tư nhiều Quest.',
    realm_scaling: false,
    rarity: 'epic',
  },
];
