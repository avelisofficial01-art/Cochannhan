import React, { useEffect, useState } from 'react';
import { useGameStore, type MonsterSprite } from '../store/gameStore.js';

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

export default function GameHUD(): React.ReactElement {
  const {
    playerGuList,
    monsters,
    toggleCharacterPanel,
    toggleCraftPanel,
    activeQuests,
  } = useGameStore();

  const [activeSkills, setActiveSkills] = useState<HUDActiveSkill[]>([]);
  const [cooldowns, setCooldowns] = useState<Record<string, { total: number; remaining: number }>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-end font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="self-center mb-28 bg-gu-dark/90 border border-gu-accent text-gu-accent text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg pointer-events-auto transition-all animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Main HUD overlay bottom area */}
      <div className="w-full bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col md:flex-row justify-between items-center gap-3 pointer-events-auto">
        {/* Navigation / Menu Dock */}
        <div className="flex gap-2 bg-gu-dark/80 backdrop-blur border border-gu-border rounded-full p-1.5 shadow-lg">
          <button
            onClick={toggleCharacterPanel}
            className="flex items-center gap-1 px-3.5 py-1.5 bg-gu-border/20 text-xs font-bold text-white rounded-full hover:bg-gu-border/40 active:scale-95 transition-all"
            style={{ touchAction: 'manipulation' }}
          >
            👤 Nhân Vật
          </button>
          <button
            onClick={toggleCraftPanel}
            className="flex items-center gap-1 px-3.5 py-1.5 bg-gu-border/20 text-xs font-bold text-white rounded-full hover:bg-gu-border/40 active:scale-95 transition-all"
            style={{ touchAction: 'manipulation' }}
          >
            🧪 Chế Tạo
          </button>
          <div className="px-2 text-xs text-gray-500 border-l border-gu-border/30 flex items-center">
            📜 Quests: {activeQuests.length}
          </div>
        </div>

        {/* Skill Buttons Bar */}
        <div className="flex gap-3 items-center bg-gu-dark/60 backdrop-blur-sm border border-gu-border/40 rounded-2xl p-2.5 shadow-xl">
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
                  className={`relative w-12 h-12 rounded-xl border flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all ${bgClass}`}
                  style={{ touchAction: 'manipulation' }}
                >
                  {/* Cooldown graphic sweep overlay */}
                  {cd.remaining > 0 && (
                    <div
                      className="absolute inset-0 bg-black/65 rounded-xl flex items-center justify-center text-xs font-bold text-gu-accent"
                      style={{
                        clipPath: `inset(${100 - percent}% 0px 0px 0px)`,
                      }}
                    >
                      {Math.ceil(cd.remaining)}s
                    </div>
                  )}

                  {/* Icon / Emoji */}
                  <span className="text-lg">{emoji}</span>
                  <span className="text-[8px] font-bold opacity-80 uppercase truncate max-w-full px-0.5">{s.name}</span>

                  {/* Hotkey tag */}
                  <div className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-gu-darker border border-gu-border text-[8px] font-bold text-gu-accent rounded-full flex items-center justify-center shadow">
                    {idx + 1}
                  </div>
                </button>
              );
            } else {
              // Locked / Empty slot placeholder
              return (
                <div
                  key={`empty-${idx}`}
                  className="relative w-12 h-12 rounded-xl border border-dashed border-gray-700 bg-black/40 flex flex-col items-center justify-center text-gray-600 select-none"
                >
                  <span className="text-sm">🔒</span>
                  <span className="text-[7px] font-bold opacity-60 uppercase">Trống</span>
                  
                  {/* Hotkey tag */}
                  <div className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-gu-darker border border-gu-border text-[8px] font-bold text-gray-500 rounded-full flex items-center justify-center shadow">
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
