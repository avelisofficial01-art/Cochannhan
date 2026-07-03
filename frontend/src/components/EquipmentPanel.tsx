import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore.js';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

const SLOT_LABELS: Record<string, string> = {
  main_hand: '🗡️ Vũ khí',
  off_hand: '🛡️ Khiên',
  body: '👕 Giáp',
  head: '⛑️ Mũ',
  feet: '👢 Giày',
  ring1: '💍 Nhẫn 1',
  ring2: '💍 Nhẫn 2',
  neck: '📿 Dây chuyền',
};

const SLOTS = ['main_hand', 'off_hand', 'body', 'head', 'feet', 'ring1', 'ring2', 'neck'];

const TIER_COLORS: Record<string, string> = {
  common: 'text-gray-300 border-gray-600 bg-gray-900/30',
  uncommon: 'text-green-300 border-green-600 bg-green-900/20',
  rare: 'text-blue-300 border-blue-600 bg-blue-900/20',
  epic: 'text-purple-300 border-purple-600 bg-purple-900/20',
  legendary: 'text-yellow-300 border-yellow-600 bg-yellow-900/20',
};

async function fetchEquipment(token: string): Promise<{ data?: Array<Record<string, unknown>> }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/api/equipment/templates`, { headers });
  if (!res.ok) throw new Error('Failed to fetch equipment');
  return res.json();
}

async function fetchEquipped(token: string): Promise<{ data?: Record<string, unknown> }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/api/equipment/player`, { headers });
  if (!res.ok) throw new Error('Failed to fetch equipped');
  return res.json();
}

export default function EquipmentPanel(): React.ReactElement {
  const {
    isEquipmentPanelOpen,
    toggleEquipmentPanel,
    equipmentList,
    equippedItems,
    setEquipmentList,
    setEquippedItems,
  } = useGameStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetchEquipment(token)
      .then((data) => {
        const list = (data.data ?? []) as Array<Record<string, unknown>>;
        setEquipmentList(
          list.map((e) => ({
            id: String(e.id ?? ''),
            name: String(e.name ?? ''),
            type: String(e.type ?? ''),
            slot: String(e.slot ?? ''),
            tier: String(e.tier ?? 'common'),
            baseHp: Number(e.baseHp ?? 0),
            baseAtk: Number(e.baseAtk ?? 0),
            baseDef: Number(e.baseDef ?? 0),
            baseCrit: Number(e.baseCrit ?? 0),
            requiredLevel: Number(e.requiredLevel ?? 1),
            description: String(e.description ?? ''),
            icon: String(e.icon ?? ''),
          })),
        );
      })
      .catch(() => { /* equipment data unavailable */ });

    fetchEquipped(token)
      .then((data) => {
        const slots = data.data as Record<string, unknown> ?? {};
        const items: Record<string, string | null> = {};
        for (const [slot, name] of Object.entries(slots)) {
          items[slot] = String(name ?? '');
        }
        setEquippedItems(items);
      })
      .catch(() => { /* equipped data unavailable */ });
  }, [setEquipmentList, setEquippedItems]);

  if (!isEquipmentPanelOpen) {
    return (
      <button
        onClick={toggleEquipmentPanel}
        className="absolute top-2 left-[110px] z-20 px-3 py-1.5 text-xs bg-gu-dark border border-gu-border rounded hover:bg-gu-border/30 transition-colors"
        title="Open Equipment Panel (E)"
      >
        ⚔️ Trang bị
      </button>
    );
  }

  return (
    <div className="absolute top-0 left-0 z-20 w-72 h-full bg-gu-dark border-r border-gu-border flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gu-border">
        <h2 className="text-sm font-bold text-yellow-400">⚔️ Trang bị</h2>
        <button
          onClick={toggleEquipmentPanel}
          className="text-gray-400 hover:text-white text-lg leading-none"
        >
          ✕
        </button>
      </div>

      {/* Equipped Slots */}
      <div className="px-3 py-3 border-b border-gu-border">
        <h3 className="text-xs text-gray-400 mb-2">Đã trang bị</h3>
        <div className="space-y-2">
          {SLOTS.map((slot) => {
            const itemName = equippedItems[slot];
            return (
              <div
                key={slot}
                className="flex justify-between items-center rounded border border-gray-700 bg-gray-900/30 px-3 py-1.5 text-xs"
              >
                <span className="text-gray-400">{SLOT_LABELS[slot] ?? slot}</span>
                <span className={itemName ? 'text-green-300' : 'text-gray-600'}>
                  {itemName || '(trống)'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Equipment List */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <h3 className="text-xs text-gray-400 mb-2">Trang bị có thể ({equipmentList.length})</h3>
        {equipmentList.length === 0 ? (
          <p className="text-xs text-gray-600 italic">Đang tải...</p>
        ) : (
          <div className="space-y-2">
            {equipmentList.map((eq) => {
              const colorClass = TIER_COLORS[eq.tier] ?? TIER_COLORS.common;
              return (
                <div key={eq.id} className={`rounded border p-2 text-xs ${colorClass}`}>
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{eq.name}</span>
                    <span className="text-[10px] opacity-70">{SLOT_LABELS[eq.slot] ?? eq.slot}</span>
                  </div>
                  <div className="flex gap-2 text-[10px] opacity-70 mt-1">
                    {eq.baseAtk > 0 && <span>⚔️ +{eq.baseAtk}</span>}
                    {eq.baseDef > 0 && <span>🛡️ +{eq.baseDef}</span>}
                    {eq.baseHp > 0 && <span>❤️ +{eq.baseHp}</span>}
                    {eq.baseCrit > 0 && <span>💥 +{eq.baseCrit}%</span>}
                  </div>
                  <p className="text-[10px] opacity-50 mt-1 truncate">{eq.description}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 text-[10px] text-gray-600 border-t border-gu-border">
        Nhấn E để đóng/mở
      </div>
    </div>
  );
}
