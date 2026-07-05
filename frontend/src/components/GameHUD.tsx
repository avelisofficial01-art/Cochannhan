import React, { useEffect, useState } from 'react';
import { useGameStore, type MonsterSprite, type ProfileState, type StatsState } from '../store/gameStore.js';

interface HUDActiveSkill {
  skillId: string;
  name: string;
  type: string;
  description: string;
  cooldown: number;
  damageMultiplier: number;
  element: string;
  guName: string;
}

const ELEMENT_EMOJIS: Record<string, string> = {
  'Hỏa': '🔥',
  'Phong': '🌪️',
  'Thạch': '🪨',
  'Huyết': '🩸',
  'Độc': '☠️',
};

const ELEMENT_BG_COLORS: Record<string, string> = {
  'Hỏa': 'bg-red-650/80 border-red-500 shadow-red-900/50',
  'Phong': 'bg-cyan-650/80 border-cyan-500 shadow-cyan-900/50',
  'Thạch': 'bg-amber-650/80 border-amber-500 shadow-amber-900/50',
  'Huyết': 'bg-rose-650/80 border-rose-500 shadow-rose-900/50',
  'Độc': 'bg-purple-650/80 border-purple-500 shadow-purple-900/50',
};

const REALM_NAMES: Record<number, string> = {
  1: 'Nhất Chuyển',
  2: 'Nhị Chuyển',
  3: 'Tam Chuyển',
  4: 'Tứ Chuyển',
  5: 'Ngũ Chuyển',
  6: 'Lục Chuyển (Tiên)',
  7: 'Thất Chuyển (Tiên)',
  8: 'Bát Chuyển (Tiên)',
  9: 'Cửu Chuyển (Tôn)',
};

export default function GameHUD(): React.ReactElement {
  const token = localStorage.getItem('token');
  const {
    playerGuList,
    monsters,
    toggleCharacterPanel,
    toggleCraftPanel,
    activeQuests,
    profile,
    setProfile,
    setStats,
    characterPanelTab,
    setCharacterPanelTab,
    isCharacterPanelOpen,
    isConnected,
  } = useGameStore();

  const [activeSkills, setActiveSkills] = useState<HUDActiveSkill[]>([]);
  const [cooldowns, setCooldowns] = useState<Record<string, { total: number; remaining: number }>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadProfileAndStats = (): void => {
    if (!token) return;
    fetch('/api/player/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((d: { success: boolean; data: ProfileState }) => {
        if (d.success) setProfile(d.data);
      })
      .catch(() => {});

    fetch('/api/player/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((d: { success: boolean; data: StatsState }) => {
        if (d.success) setStats(d.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadProfileAndStats();
    const interval = setInterval(loadProfileAndStats, 5000);
    return () => clearInterval(interval);
  }, [token]);

  // Scan for active skills from equipped Gu
  useEffect(() => {
    const list: HUDActiveSkill[] = [];
    playerGuList.forEach((gu) => {
      if (gu.isEquipped && gu.skills) {
        gu.skills.forEach((s) => {
          if (s.type === 'active') {
            list.push({
              ...s,
              element: gu.element,
              guName: gu.name,
            });
          }
        });
      }
    });
    setActiveSkills(list.slice(0, 3)); // Max 3 skills on HUD
  }, [playerGuList]);

  // Tick cooldowns down
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldowns((prev) => {
        const next: typeof prev = {};
        let updated = false;
        for (const [id, cd] of Object.entries(prev)) {
          if (cd.remaining > 0.1) {
            next[id] = { total: cd.total, remaining: cd.remaining - 0.1 };
            updated = true;
          }
        }
        return updated ? next : prev;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Keyboard listener for hotkeys '1', '2', '3'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (idx >= 0 && idx < activeSkills.length) {
          const skill = activeSkills[idx];
          handleCastSkill(skill);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSkills, cooldowns, monsters]);

  const showToast = (txt: string) => {
    setToastMessage(txt);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCastSkill = (skill: HUDActiveSkill) => {
    // Check cooldown
    const cd = cooldowns[skill.skillId];
    if (cd && cd.remaining > 0) {
      showToast(`Kỹ năng ${skill.name} đang hồi chiêu!`);
      return;
    }

    // Find nearest target within range (150px)
    const playerX = useGameStore.getState().playerX;
    const playerY = useGameStore.getState().playerY;
    let nearest: MonsterSprite | null = null;
    let nearestDist = Infinity;

    for (const m of monsters) {
      const dx = m.x - playerX;
      const dy = m.y - playerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150 && dist < nearestDist) {
        nearestDist = dist;
        nearest = m;
      }
    }

    if (!nearest) {
      showToast('⚠️ Không có quái vật nào trong tầm đánh!');
      return;
    }

    // Emit skill attack
    const emitAttack = (window as unknown as Record<string, (targetId: string, skillId: string) => void>)
      .__socketEmitAttack;
    if (emitAttack) {
      emitAttack(nearest.instanceId, skill.skillId);
      
      // Set cooldown
      setCooldowns((prev) => ({
        ...prev,
        [skill.skillId]: { total: skill.cooldown, remaining: skill.cooldown },
      }));
    } else {
      showToast('Lỗi kết nối máy chủ.');
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between font-sans p-3">
      {/* Top HUD Bar — completely replacing the external header */}
      <div className="w-full flex justify-between items-center bg-gu-dark/90 backdrop-blur border border-gu-border rounded-2xl p-2.5 shadow-xl pointer-events-auto">
        {/* Left: Player basic info */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gu-accent/20 border border-gu-accent flex items-center justify-center text-sm font-bold text-gu-accent">
            👤
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white truncate max-w-[120px]">
              {profile?.name || 'Hành Giả'}
            </span>
            <span className="text-[9px] text-gu-accent font-semibold leading-tight">
              {profile?.realm ? REALM_NAMES[profile.realm] || `${profile.realm} Chuyển` : 'Nhất Chuyển'}
            </span>
          </div>
        </div>

        {/* Middle: Gold and Spirit Stones */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-lg border border-gu-border/20">
            <span className="text-[10px]">🪙</span>
            <span className="text-xs font-bold text-yellow-400">{profile?.gold ?? 0}</span>
          </div>
          <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-lg border border-gu-border/20">
            <span className="text-[10px]">💎</span>
            <span className="text-xs font-bold text-cyan-400">{profile?.spiritStone ?? 0}</span>
          </div>
        </div>

        {/* Right: Ping & Logout */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-[8px] text-gray-400 hidden xs:inline">{isConnected ? 'Online' : 'Offline'}</span>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              window.location.href = '/login';
            }}
            className="px-2 py-1 bg-red-950/40 hover:bg-red-900/60 text-[9px] text-red-400 font-bold border border-red-800/50 rounded-lg active:scale-95 transition-all"
          >
            Đăng Xuất
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="self-center mb-28 bg-gu-dark/90 border border-gu-accent text-gu-accent text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg pointer-events-auto transition-all animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Bottom Area (Dock & Skills) */}
      <div className="w-full bg-gradient-to-t from-black/85 to-transparent p-1 flex flex-col md:flex-row justify-between items-end md:items-center gap-3 pointer-events-auto">
        {/* Navigation / Menu Dock (H5 Complete Control Bar) */}
        <div className="flex flex-wrap gap-1 bg-gu-dark/85 backdrop-blur border border-gu-border rounded-xl p-1.5 shadow-lg max-w-full justify-center">
          <button
            onClick={() => {
              setCharacterPanelTab('stats');
              if (!isCharacterPanelOpen) toggleCharacterPanel();
            }}
            className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all active:scale-95 ${
              isCharacterPanelOpen && characterPanelTab === 'stats'
                ? 'bg-gu-accent text-gu-darker'
                : 'bg-gu-border/20 text-white hover:bg-gu-border/40'
            }`}
            style={{ touchAction: 'manipulation' }}
          >
            👤 Nhân Vật
          </button>
          <button
            onClick={() => {
              setCharacterPanelTab('gu');
              if (!isCharacterPanelOpen) toggleCharacterPanel();
            }}
            className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all active:scale-95 ${
              isCharacterPanelOpen && characterPanelTab === 'gu'
                ? 'bg-gu-accent text-gu-darker'
                : 'bg-gu-border/20 text-white hover:bg-gu-border/40'
            }`}
            style={{ touchAction: 'manipulation' }}
          >
            🪲 Cổ Trùng
          </button>
          <button
            onClick={() => {
              setCharacterPanelTab('equip');
              if (!isCharacterPanelOpen) toggleCharacterPanel();
            }}
            className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all active:scale-95 ${
              isCharacterPanelOpen && characterPanelTab === 'equip'
                ? 'bg-gu-accent text-gu-darker'
                : 'bg-gu-border/20 text-white hover:bg-gu-border/40'
            }`}
            style={{ touchAction: 'manipulation' }}
          >
            ⚔️ Trang Bị
          </button>
          <button
            onClick={() => {
              setCharacterPanelTab('quest');
              if (!isCharacterPanelOpen) toggleCharacterPanel();
            }}
            className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all active:scale-95 ${
              isCharacterPanelOpen && characterPanelTab === 'quest'
                ? 'bg-gu-accent text-gu-darker'
                : 'bg-gu-border/20 text-white hover:bg-gu-border/40'
            }`}
            style={{ touchAction: 'manipulation' }}
          >
            📜 Nhiệm Vụ
          </button>
          <button
            onClick={toggleCraftPanel}
            className="flex items-center gap-1 px-2.5 py-1 bg-gu-border/20 text-[10px] font-bold text-white rounded-lg hover:bg-gu-border/40 active:scale-95 transition-all"
            style={{ touchAction: 'manipulation' }}
          >
            🧪 Chế Tạo
          </button>
          <div className="px-2 text-[9px] text-gray-500 border-l border-gu-border/30 flex items-center">
            📜 Q: {activeQuests.length}
          </div>
        </div>

        {/* Skill Buttons Bar */}
        <div className="flex gap-2 items-center bg-gu-dark/65 backdrop-blur-sm border border-gu-border/40 rounded-xl p-2 shadow-xl">
          {[0, 1, 2].map((idx) => {
            const s = activeSkills[idx];
            if (s) {
              const cd = cooldowns[s.skillId] || { total: 0, remaining: 0 };
              const percent = cd.remaining > 0 ? (cd.remaining / cd.total) * 100 : 0;
              const emoji = ELEMENT_EMOJIS[s.element] || '🪲';
              const bgClass = ELEMENT_BG_COLORS[s.element] || 'bg-gray-800 border-gray-600';

              return (
                <button
                  key={s.skillId}
                  onClick={() => handleCastSkill(s)}
                  className={`relative w-11 h-11 rounded-lg border flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all ${bgClass}`}
                  style={{ touchAction: 'manipulation' }}
                >
                  {/* Cooldown graphic sweep overlay */}
                  {cd.remaining > 0 && (
                    <div
                      className="absolute inset-0 bg-black/65 rounded-lg flex items-center justify-center text-xs font-bold text-gu-accent"
                      style={{
                        clipPath: `inset(${100 - percent}% 0px 0px 0px)`,
                      }}
                    >
                      {Math.ceil(cd.remaining)}s
                    </div>
                  )}

                  {/* Icon / Emoji */}
                  <span className="text-base">{emoji}</span>
                  <span className="text-[7px] font-bold opacity-80 uppercase truncate max-w-full px-0.5 leading-none">{s.name}</span>

                  {/* Hotkey tag */}
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gu-darker border border-gu-border text-[8px] font-bold text-gu-accent rounded-full flex items-center justify-center shadow">
                    {idx + 1}
                  </div>
                </button>
              );
            } else {
              // Locked / Empty slot placeholder
              return (
                <div
                  key={`empty-${idx}`}
                  className="relative w-11 h-11 rounded-lg border border-dashed border-gray-700 bg-black/40 flex flex-col items-center justify-center text-gray-600 select-none"
                >
                  <span className="text-xs">🔒</span>
                  <span className="text-[7px] font-bold opacity-60 uppercase leading-none">Trống</span>
                  
                  {/* Hotkey tag */}
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gu-darker border border-gu-border text-[8px] font-bold text-gray-500 rounded-full flex items-center justify-center shadow">
                    {idx + 1}
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
