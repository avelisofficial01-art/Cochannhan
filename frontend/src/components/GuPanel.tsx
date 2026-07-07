import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore.js';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

const ELEMENT_COLORS: Record<string, string> = {
  'Hỏa': 'text-red-400 border-red-700 bg-red-900/20',
  'Phong': 'text-cyan-400 border-cyan-700 bg-cyan-900/20',
  'Thạch': 'text-amber-400 border-amber-700 bg-amber-900/20',
  'Huyết': 'text-rose-400 border-rose-700 bg-rose-900/20',
  'Độc': 'text-purple-400 border-purple-700 bg-purple-900/20',
  'fire': 'text-red-400 border-red-700 bg-red-900/20',
  'wind': 'text-cyan-400 border-cyan-700 bg-cyan-900/20',
  'earth': 'text-amber-400 border-amber-700 bg-amber-900/20',
  'blood': 'text-rose-400 border-rose-700 bg-rose-900/20',
  'poison': 'text-purple-400 border-purple-700 bg-purple-900/20',
  'light': 'text-yellow-400 border-yellow-700 bg-yellow-900/20',
  'physical': 'text-gray-300 border-gray-600 bg-gray-900/20',
  'ice': 'text-blue-300 border-blue-600 bg-blue-900/20',
  'wood': 'text-green-400 border-green-700 bg-green-900/20',
  'lightning': 'text-indigo-400 border-indigo-700 bg-indigo-900/20',
  'space': 'text-pink-400 border-pink-700 bg-pink-900/20',
  'time': 'text-teal-400 border-teal-700 bg-teal-900/20',
};

const RANK_NAMES: Record<number, string> = {
  1: 'Nhất Chuyển',
  2: 'Nhị Chuyển',
  3: 'Tam Chuyển',
  4: 'Tứ Chuyển',
  5: 'Ngũ Chuyển',
  6: 'Lục Chuyển',
  7: 'Thất Chuyển',
  8: 'Bát Chuyển',
  9: 'Cửu Chuyển',
};

async function fetchGu(token: string): Promise<{ data?: Array<Record<string, unknown>> }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/api/gu/player`, { headers });
  if (!res.ok) throw new Error('Failed to fetch Gu list');
  return res.json();
}

export default function GuPanel(): React.ReactElement {
  const { playerGuList, guSynergies, isGuPanelOpen, toggleGuPanel, setPlayerGuList, stats } = useGameStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetchGu(token)
      .then((data) => {
        const list = data.data ?? [];
        setPlayerGuList(
          list.map((g: Record<string, unknown>) => ({
            id: String(g.id ?? ''),
            guTemplateId: String(g.guTemplateId ?? ''),
            name: String((g.guTemplate as Record<string, unknown>)?.name ?? g.name ?? ''),
            element: String((g.guTemplate as Record<string, unknown>)?.element ?? ''),
            rank: Number((g.guTemplate as Record<string, unknown>)?.rank ?? 1),
            level: Number(g.level ?? 1),
            enhancement: Number(g.enhancement ?? 0),
            mastery: Number(g.mastery ?? 0),
            bondLevel: Number(g.bondLevel ?? 0),
            isEquipped: String(g.isEquipped ?? 'false') === 'true',
            slotIndex: g.slotIndex != null ? Number(g.slotIndex) : null,
            sprite: String((g.guTemplate as Record<string, unknown>)?.sprite ?? ''),
            description: String((g.guTemplate as Record<string, unknown>)?.description ?? ''),
            stats: (g.stats as Record<string, unknown>) ? {
              hp: Number((g.stats as Record<string, unknown>).hp ?? 0),
              atk: Number((g.stats as Record<string, unknown>).atk ?? 0),
              def: Number((g.stats as Record<string, unknown>).def ?? 0),
              crit: Number((g.stats as Record<string, unknown>).crit ?? 0),
              critDamage: Number((g.stats as Record<string, unknown>).crit_damage ?? (g.stats as Record<string, unknown>).critDamage ?? 0),
              moveSpeed: Number((g.stats as Record<string, unknown>).move_speed ?? (g.stats as Record<string, unknown>).moveSpeed ?? 0),
            } : undefined,
          })),
        );
      })
      .catch(() => {
        /* Gu data unavailable — server may not have seeds yet */
      });
  }, [setPlayerGuList]);

  if (!isGuPanelOpen) {
    return (
      <button
        onClick={toggleGuPanel}
        className="absolute top-2 left-2 z-20 px-3 py-1.5 text-xs bg-gu-dark border border-gu-border rounded hover:bg-gu-border/30 transition-colors"
        title="Open Gu Panel (G)"
      >
        🪲 Cổ Trùng
      </button>
    );
  }

  const maxSlots = stats?.realm ?? 1;
  const equipped = playerGuList.filter((g) => g.isEquipped);
  const unequipped = playerGuList.filter((g) => !g.isEquipped);

  return (
    <div className="absolute top-0 left-0 z-20 w-72 h-full bg-gu-dark border-r border-gu-border flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gu-border">
        <h2 className="text-sm font-bold text-gu-accent">🪲 Cổ Trùng</h2>
        <button
          onClick={toggleGuPanel}
          className="text-gray-400 hover:text-white text-lg leading-none"
        >
          ✕
        </button>
      </div>

      {/* Equipped Slots */}
      <div className="px-3 py-3 border-b border-gu-border">
        <h3 className="text-xs text-gray-400 mb-2">Đã trang bị ({equipped.length}/{maxSlots})</h3>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: maxSlots }).map((_, i) => {
            const gu = equipped.find((g) => g.slotIndex === i);
            const colorClass = gu ? ELEMENT_COLORS[gu.element.toLowerCase()] || ELEMENT_COLORS[gu.element] || 'text-gray-400 border-gray-700 bg-gray-900/20' : '';
            return (
              <div
                key={i}
                className={`h-16 rounded border flex flex-col items-center justify-center text-xs ${colorClass}`}
              >
                {gu ? (
                  <>
                    <span className="font-medium truncate w-full text-center px-1">{gu.name}</span>
                    <span className="opacity-70">+{gu.enhancement}</span>
                  </>
                ) : (
                  <span className="text-gray-600 text-lg">∅</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Synergies */}
      {guSynergies.length > 0 && (
        <div className="px-3 py-2 border-b border-gu-border">
          <h3 className="text-xs text-yellow-400 mb-1">⚡ Synergy</h3>
          {guSynergies.map((s, i) => (
            <div key={i} className="text-xs text-yellow-300/80">{s}</div>
          ))}
        </div>
      )}

      {/* Gu List */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <h3 className="text-xs text-gray-400 mb-2">Cổ Trùng ({unequipped.length})</h3>
        {unequipped.length === 0 ? (
          <p className="text-xs text-gray-600 italic">Chưa có Cổ Trùng</p>
        ) : (
          <div className="space-y-2">
            {unequipped.map((gu) => {
              const colorClass = ELEMENT_COLORS[gu.element.toLowerCase()] || ELEMENT_COLORS[gu.element] || 'border-gray-700';
              const rankName = RANK_NAMES[gu.rank] ?? `Rank ${gu.rank}`;
              return (
                <div
                  key={gu.id}
                  className={`rounded border p-2 text-xs ${colorClass}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{gu.name} {gu.enhancement > 0 ? `+${gu.enhancement}` : ''}</span>
                    <span className="text-[10px] opacity-70">Lv.{gu.level}</span>
                  </div>
                  <div className="flex justify-between text-[10px] opacity-60 mt-1">
                    <span>{rankName}</span>
                    <span>+{gu.enhancement}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="px-3 py-2 text-[10px] text-gray-600 border-t border-gu-border text-center">
        Nhấn G để đóng/mở | Mở bảng nhân vật (C) để tháo lắp & cường hóa
      </div>
    </div>
  );
}
