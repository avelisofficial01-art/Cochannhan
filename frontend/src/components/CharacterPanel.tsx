import React, { useEffect, useState } from 'react';
import { useGameStore, type PlayerGuState } from '../store/gameStore.js';

const ELEMENT_COLORS: Record<string, string> = {
  'Hỏa': 'text-red-400 border-red-700 bg-red-900/20',
  'Phong': 'text-cyan-400 border-cyan-700 bg-cyan-900/20',
  'Thạch': 'text-amber-400 border-amber-700 bg-amber-900/20',
  'Huyết': 'text-rose-400 border-rose-700 bg-rose-900/20',
  'Độc': 'text-purple-400 border-purple-700 bg-purple-900/20',
};

const ELEMENT_EMOJIS: Record<string, string> = {
  'Hỏa': '🔥',
  'Phong': '🌪️',
  'Thạch': '🪨',
  'Huyết': '🩸',
  'Độc': '☠️',
};

const SLOT_LABELS: Record<string, string> = {
  main_hand: '🗡️ Vũ khí',
  off_hand: '🛡️ Khiên/Vật phụ',
  body: '👕 Giáp thân',
  head: '⛑️ Mũ giáp',
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

interface ProfileState {
  id: string;
  name: string;
  realm: number;
  daoId: string | null;
}

interface StatsState {
  hp: number;
  mana: number;
  atk: number;
  def: number;
  crit: number;
  critDamage: number;
  moveSpeed: number;
  realm: number;
  daoId: string | null;
}

interface EquipmentTemplate {
  id: string;
  name: string;
  type: string;
  slot: string;
  tier: string;
  baseHp: number;
  baseAtk: number;
  baseDef: number;
  baseCrit: number;
  requiredLevel: number;
  description: string;
  icon: string;
}

interface EquipmentInstance {
  id: string;
  playerId: string;
  equipmentId: string;
  enhancement: number;
  isEquipped: string | boolean;
  slotIndex: number | null;
  obtainedAt?: string;
  template?: EquipmentTemplate | null;
}

interface RawGuTemplate {
  name?: string;
  element?: string;
  rank?: number;
  sprite?: string;
}

interface RawGuSkill {
  skillId?: string;
  name?: string;
  type?: string;
  description?: string;
  cooldown?: number;
  damageMultiplier?: number;
}

interface RawPlayerGu {
  id?: string;
  guTemplateId?: string;
  name?: string;
  level?: number;
  enhancement?: number;
  mastery?: number;
  bondLevel?: number;
  isEquipped?: string | boolean;
  slotIndex?: number | null;
  guTemplate?: RawGuTemplate;
  skills?: RawGuSkill[];
}

interface RawSynergy {
  gu_a?: string;
  gu_b?: string;
  result_name?: string;
  resultName?: string;
}

interface RawEquipmentTemplate {
  id?: string;
  name?: string;
  type?: string;
  slot?: string;
  tier?: string;
  baseHp?: number;
  baseAtk?: number;
  baseDef?: number;
  baseCrit?: number;
  requiredLevel?: number;
  description?: string;
  icon?: string;
}

interface RawEquipmentInstance {
  id?: string;
  playerId?: string;
  equipmentId?: string;
  enhancement?: number;
  isEquipped?: string | boolean;
  slotIndex?: number | null;
  obtainedAt?: string;
}

interface QuestObjective {
  type: string;
  target: string;
  count: number;
  description?: string;
}

interface QuestTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  objectives: QuestObjective[] | string;
  flagRequired: string | null;
}

interface PlayerQuest {
  id: string;
  questId: string;
  status: string;
  objectivesProgress: Array<{ index: number; current: number; target: number }>;
}

export default function CharacterPanel(): React.ReactElement | null {
  const {
    isCharacterPanelOpen,
    toggleCharacterPanel,
    playerGuList,
    guSynergies,
    setPlayerGuList,
    setGuSynergies,
    equipmentList,
    setEquipmentList,
    setEquippedItems,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<'stats' | 'gu' | 'equip' | 'quest'>('stats');
  const [profile, setProfile] = useState<ProfileState | null>(null);
  const [stats, setStats] = useState<StatsState | null>(null);
  const [playerEquipInstances, setPlayerEquipInstances] = useState<EquipmentInstance[]>([]);
  const [selectedGu, setSelectedGu] = useState<PlayerGuState | null>(null);
  const [selectedEquip, setSelectedEquip] = useState<EquipmentInstance | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [activePlayerQuests, setActivePlayerQuests] = useState<PlayerQuest[]>([]);
  const [questTemplates, setQuestTemplates] = useState<QuestTemplate[]>([]);

  const token = localStorage.getItem('token');

  // Load profile, stats, Gu, and equipment
  const loadData = () => {
    if (!token) return;

    // Profile
    fetch('/api/player/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((d: { success: boolean; data: ProfileState }) => {
        if (d.success) setProfile(d.data);
      })
      .catch(() => {});

    // Stats
    fetch('/api/player/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((d: { success: boolean; data: StatsState }) => {
        if (d.success) setStats(d.data);
      })
      .catch(() => {});

    // Gu
    fetch('/api/gu/player', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((d: { success: boolean; data: RawPlayerGu[] }) => {
        if (d.success && Array.isArray(d.data)) {
          const list: PlayerGuState[] = d.data.map((g) => ({
            id: String(g.id ?? ''),
            guTemplateId: String(g.guTemplateId ?? ''),
            name: String(g.guTemplate?.name ?? g.name ?? ''),
            element: String(g.guTemplate?.element ?? ''),
            rank: Number(g.guTemplate?.rank ?? 1),
            level: Number(g.level ?? 1),
            enhancement: Number(g.enhancement ?? 0),
            mastery: Number(g.mastery ?? 0),
            bondLevel: Number(g.bondLevel ?? 0),
            isEquipped: String(g.isEquipped ?? 'false') === 'true',
            slotIndex: g.slotIndex != null ? Number(g.slotIndex) : null,
            sprite: g.guTemplate?.sprite ? String(g.guTemplate.sprite) : null,
            skills: Array.isArray(g.skills)
              ? g.skills.map((s: RawGuSkill) => ({
                  skillId: String(s.skillId ?? ''),
                  name: String(s.name ?? ''),
                  type: String(s.type ?? ''),
                  description: String(s.description ?? ''),
                  cooldown: Number(s.cooldown ?? 0),
                  damageMultiplier: Number(s.damageMultiplier ?? 100),
                }))
              : [],
          }));
          setPlayerGuList(list);

          // Get active synergies
          const equippedIds = list.filter((g) => g.isEquipped).map((g) => g.guTemplateId);
          if (equippedIds.length >= 2) {
            fetch('/api/gu/synergies', { headers: { Authorization: `Bearer ${token}` } })
              .then((res) => res.json())
              .then((synData: { success: boolean; data: RawSynergy[] }) => {
                if (synData.success && Array.isArray(synData.data)) {
                  const active = synData.data
                    .filter((s) => s.gu_a && s.gu_b && equippedIds.includes(s.gu_a) && equippedIds.includes(s.gu_b))
                    .map((s) => String(s.result_name ?? s.resultName ?? ''));
                  setGuSynergies(active);
                }
              })
              .catch(() => {});
          } else {
            setGuSynergies([]);
          }
        }
      })
      .catch(() => {});

    // Equipment templates
    fetch('/api/equipment/templates', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((d: { success: boolean; data: RawEquipmentTemplate[] }) => {
        if (d.success && Array.isArray(d.data)) {
          setEquipmentList(
            d.data.map((e) => ({
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
        }
      })
      .catch(() => {});

    // Player Equipment instances
    fetch('/api/equipment/player', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((d: { success: boolean; data: RawEquipmentInstance[] }) => {
        if (d.success && Array.isArray(d.data)) {
          setPlayerEquipInstances(d.data.map((inst) => ({
            id: String(inst.id ?? ''),
            playerId: String(inst.playerId ?? ''),
            equipmentId: String(inst.equipmentId ?? ''),
            enhancement: Number(inst.enhancement ?? 0),
            isEquipped: inst.isEquipped ?? 'false',
            slotIndex: inst.slotIndex != null ? Number(inst.slotIndex) : null,
          })));
        }
      })
      .catch(() => {});

    // Active Quests
    fetch('/api/quest/player/active', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((d: { success: boolean; data: unknown[] }) => {
        if (d.success && Array.isArray(d.data)) {
          setActivePlayerQuests(d.data as PlayerQuest[]);
        }
      })
      .catch(() => {});

    // Quest Templates
    fetch('/api/quest', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((d: { success: boolean; data: unknown[] }) => {
        if (d.success && Array.isArray(d.data)) {
          setQuestTemplates(d.data as QuestTemplate[]);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (isCharacterPanelOpen) {
      loadData();
      setSelectedGu(null);
      setSelectedEquip(null);
      setMessage(null);
    }
  }, [isCharacterPanelOpen]);

  // Synchronise equippedItems when instances or templates load
  useEffect(() => {
    const items: Record<string, string | null> = {};
    for (const slot of SLOTS) {
      items[slot] = null;
    }
    for (const instance of playerEquipInstances) {
      if (String(instance.isEquipped) === 'true') {
        const tmpl = equipmentList.find((t) => t.id === instance.equipmentId);
        if (tmpl) {
          items[tmpl.slot] = `${tmpl.name} +${instance.enhancement}`;
        }
      }
    }
    setEquippedItems(items);
  }, [playerEquipInstances, equipmentList, setEquippedItems]);

  if (!isCharacterPanelOpen) return null;

  // Gu Actions
  const handleEquipGu = async (guId: string) => {
    if (!token) return;
    // Find first available slot (0-5)
    const equipped = playerGuList.filter((g) => g.isEquipped);
    const slotsUsed = equipped.map((g) => g.slotIndex);
    let targetSlot = 0;
    for (let i = 0; i < 6; i++) {
      if (!slotsUsed.includes(i)) {
        targetSlot = i;
        break;
      }
    }
    if (equipped.length >= 6) {
      showToast('Tất cả 6 ô Cổ Trùng đều đã đầy!');
      return;
    }

    try {
      const res = await fetch('/api/gu/equip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ playerGuId: guId, slotIndex: targetSlot }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Trang bị Cổ Trùng thành công!');
        loadData();
        setSelectedGu(null);
      } else {
        showToast(data.message ?? 'Không thể trang bị Cổ Trùng');
      }
    } catch {
      showToast('Lỗi kết nối máy chủ.');
    }
  };

  const handleUnequipGu = async (guId: string) => {
    if (!token) return;
    try {
      const res = await fetch('/api/gu/unequip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ playerGuId: guId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Tháo Cổ Trùng thành công!');
        loadData();
        setSelectedGu(null);
      } else {
        showToast(data.message ?? 'Không thể tháo Cổ Trùng');
      }
    } catch {
      showToast('Lỗi kết nối máy chủ.');
    }
  };

  // Equipment Actions
  const handleEquipItem = async (instanceId: string, slotName: string) => {
    if (!token) return;
    const slotIdx = SLOTS.indexOf(slotName);
    if (slotIdx === -1) return;

    try {
      const res = await fetch('/api/equipment/equip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ playerEquipmentId: instanceId, slotIndex: slotIdx }),
      });
      const data: { success: boolean; message?: string } = await res.json();
      if (data.success) {
        showToast('Trang bị vật phẩm thành công!');
        loadData();
        setSelectedEquip(null);
      } else {
        showToast(data.message ?? 'Không thể trang bị vật phẩm');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối.';
      showToast(msg);
    }
  };

  const handleUnequipItem = async (instanceId: string) => {
    if (!token) return;
    try {
      const res = await fetch('/api/equipment/unequip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ playerEquipmentId: instanceId }),
      });
      const data: { success: boolean; message?: string } = await res.json();
      if (data.success) {
        showToast('Tháo trang bị thành công!');
        loadData();
        setSelectedEquip(null);
      } else {
        showToast(data.message ?? 'Không thể tháo trang bị');
      }
    } catch {
      showToast('Lỗi kết nối.');
    }
  };

  const handleEnhanceItem = async (instanceId: string) => {
    if (!token) return;
    try {
      const res = await fetch('/api/equipment/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ playerEquipmentId: instanceId }),
      });
      const data: { success: boolean; message?: string; data?: RawEquipmentInstance } = await res.json();
      if (data.success) {
        showToast('Cường hóa thành công!');
        loadData();
        // Update selected equip view
        const updatedInst = data.data;
        if (updatedInst) {
          const tmpl = equipmentList.find((t) => t.id === updatedInst.equipmentId);
          setSelectedEquip({
            id: String(updatedInst.id ?? ''),
            playerId: String(updatedInst.playerId ?? ''),
            equipmentId: String(updatedInst.equipmentId ?? ''),
            enhancement: Number(updatedInst.enhancement ?? 0),
            isEquipped: updatedInst.isEquipped ?? 'false',
            slotIndex: updatedInst.slotIndex != null ? Number(updatedInst.slotIndex) : null,
            template: tmpl,
          });
        } else {
          setSelectedEquip(null);
        }
      } else {
        showToast(data.message ?? 'Cường hóa thất bại.');
      }
    } catch {
      showToast('Lỗi kết nối.');
    }
  };

  const handleCompleteQuest = async (questId: string) => {
    if (!token) return;
    try {
      const res = await fetch('/api/quest/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ questId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Hoàn thành nhiệm vụ thành công!');
        loadData();
      } else {
        showToast(data.message ?? 'Không thể hoàn thành nhiệm vụ.');
      }
    } catch {
      showToast('Lỗi kết nối.');
    }
  };

  const showToast = (txt: string) => {
    setMessage(txt);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-[92vw] max-w-[420px] h-[80vh] bg-gu-dark/95 backdrop-blur border border-gu-border rounded-xl shadow-2xl flex flex-col overflow-hidden text-white font-sans">
      {/* Toast Alert */}
      {message && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 bg-gu-accent text-gu-dark font-bold text-xs px-3 py-1.5 rounded shadow-lg animate-bounce">
          {message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gu-border bg-gu-darker/60 shrink-0">
        <div className="flex flex-col">
          <h2 className="text-sm font-bold text-gu-accent">👤 THÔNG TIN NHÂN VẬT</h2>
          {profile && (
            <span className="text-[10px] text-gray-400">
              {profile.name} — {REALM_NAMES[profile.realm] ?? `Cảnh giới ${profile.realm}`}
            </span>
          )}
        </div>
        <button
          onClick={toggleCharacterPanel}
          className="text-gray-400 hover:text-white text-xl leading-none px-2 py-1"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gu-border bg-gu-darker/20 shrink-0">
        <button
          onClick={() => {
            setActiveTab('stats');
            setSelectedGu(null);
            setSelectedEquip(null);
          }}
          className={`flex-1 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'stats' ? 'border-gu-accent text-gu-accent bg-gu-border/10' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          📈 Thuộc Tính
        </button>
        <button
          onClick={() => {
            setActiveTab('gu');
            setSelectedGu(null);
            setSelectedEquip(null);
          }}
          className={`flex-1 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'gu' ? 'border-gu-accent text-gu-accent bg-gu-border/10' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          🪲 Cổ Trùng
        </button>
        <button
          onClick={() => {
            setActiveTab('equip');
            setSelectedGu(null);
            setSelectedEquip(null);
          }}
          className={`flex-1 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'equip' ? 'border-gu-accent text-gu-accent bg-gu-border/10' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          ⚔️ Trang Bị
        </button>
        <button
          onClick={() => {
            setActiveTab('quest');
            setSelectedGu(null);
            setSelectedEquip(null);
          }}
          className={`flex-1 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'quest' ? 'border-gu-accent text-gu-accent bg-gu-border/10' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          📜 Nhiệm Vụ
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* ================= STATS TAB ================= */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            {stats ? (
              <>
                {/* Realm Summary */}
                <div className="bg-gu-darker/40 p-3 rounded-lg border border-gu-border/50 text-center">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">Cảnh giới tu vi</div>
                  <div className="text-lg font-bold text-yellow-400 mt-0.5">
                    {REALM_NAMES[stats.realm] ?? `${stats.realm} Chuyển`}
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
                    <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>

                {/* Main stats list */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs border-b border-gu-border/30 pb-2">
                    <span className="text-gray-400">❤️ Sinh Mệnh (HP)</span>
                    <span className="font-bold text-green-400">{stats.hp} / {stats.hp}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-gu-border/30 pb-2">
                    <span className="text-gray-400">🔮 Chân Nguyên (Mana)</span>
                    <span className="font-bold text-cyan-400">{stats.mana} / {stats.mana}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-gu-border/30 pb-2">
                    <span className="text-gray-400">⚔️ Tấn Công (ATK)</span>
                    <span className="font-bold text-red-400">{stats.atk}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-gu-border/30 pb-2">
                    <span className="text-gray-400">🛡️ Phòng Ngự (DEF)</span>
                    <span className="font-bold text-blue-400">{stats.def}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-gu-border/30 pb-2">
                    <span className="text-gray-400">💥 Bạo Kích</span>
                    <span className="font-bold text-purple-400">{stats.crit}%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-gu-border/30 pb-2">
                    <span className="text-gray-400">⚡ Sát Thương Bạo</span>
                    <span className="font-bold text-yellow-500">{stats.critDamage}%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pb-1">
                    <span className="text-gray-400">👟 Tốc độ di chuyển</span>
                    <span className="font-bold text-orange-400">{stats.moveSpeed}</span>
                  </div>
                </div>

                <div className="bg-gu-darker/60 p-3 rounded-lg border border-gu-border/40 text-[10px] text-gray-500 italic text-center">
                  Luyện hóa Cổ Trùng và cường hóa trang bị để gia tăng vĩnh viễn các thuộc tính cơ bản.
                </div>
              </>
            ) : (
              <p className="text-xs text-gray-400 text-center py-8">Đang tải chỉ số nhân vật...</p>
            )}
          </div>
        )}

        {/* ================= GU TAB ================= */}
        {activeTab === 'gu' && (
          <div className="space-y-4">
            {/* Equipped grid */}
            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase mb-2">Đang sử dụng (6 Ô)</h3>
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 6 }).map((_, i) => {
                  const gu = playerGuList.find((g) => g.isEquipped && g.slotIndex === i);
                  const colorClass = gu ? ELEMENT_COLORS[gu.element] || 'text-gray-400 border-gray-700 bg-gray-900/20' : 'border-gray-880 bg-gu-darker/30';
                  return (
                    <div
                      key={i}
                      onClick={() => gu && setSelectedGu(gu)}
                      className={`h-11 rounded-lg border flex flex-col items-center justify-center text-[10px] cursor-pointer hover:border-gu-accent transition-colors ${colorClass}`}
                    >
                      {gu ? (
                        <>
                          <span className="font-bold">{ELEMENT_EMOJIS[gu.element] || '🪲'}</span>
                          <span className="text-[9px] opacity-75 truncate max-w-full px-1">{gu.name}</span>
                        </>
                      ) : (
                        <span className="text-gray-700 text-sm font-light">∅</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Synergies display */}
            {guSynergies.length > 0 && (
              <div className="bg-yellow-950/20 border border-yellow-800/40 rounded-lg p-2.5">
                <h4 className="text-[10px] font-bold text-yellow-400 uppercase mb-1">⚡ Cộng Hưởng Cộng Thêm</h4>
                <div className="space-y-0.5">
                  {guSynergies.map((s, i) => (
                    <div key={i} className="text-xs text-yellow-200/90">• {s}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Detail section */}
            {selectedGu ? (
              <div className="bg-gu-darker/60 rounded-xl border border-gu-border p-3 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-gu-accent">{selectedGu.name}</h4>
                    <span className="text-[9px] text-gray-400">
                      Hệ: {selectedGu.element} | Cấp: {selectedGu.level}
                    </span>
                  </div>
                  <button
                    onClick={() => handleUnequipGu(selectedGu.id)}
                    className="px-2.5 py-1 text-[10px] bg-red-950/60 border border-red-700/70 text-red-300 rounded hover:bg-red-900/40 transition-colors"
                  >
                    Tháo Ra
                  </button>
                </div>
                {selectedGu.skills && selectedGu.skills.length > 0 && (
                  <div className="border-t border-gu-border/30 pt-2 text-[10px]">
                    <span className="font-bold text-yellow-400 block mb-0.5">Kỹ năng chủ động:</span>
                    {selectedGu.skills.map((s, idx: number) => (
                      <div key={idx}>
                        <span className="font-medium text-cyan-300">{s.name}</span>: {s.description} (Hồi chiêu: {s.cooldown}s)
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Unequipped inventory list */
              <div>
                <h3 className="text-[10px] font-bold text-gray-400 uppercase mb-2">Cổ Trùng Tự Do</h3>
                {playerGuList.filter((g) => !g.isEquipped).length === 0 ? (
                  <p className="text-xs text-gray-600 italic py-4 text-center">Túi Cổ Trùng trống</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {playerGuList
                      .filter((g) => !g.isEquipped)
                      .map((gu) => {
                        const colorClass = ELEMENT_COLORS[gu.element] || 'border-gray-800 bg-gu-darker/30';
                        return (
                          <div
                            key={gu.id}
                            onClick={() => setSelectedGu(gu)}
                            className={`rounded-lg border p-2 text-xs cursor-pointer hover:border-gu-accent transition-colors flex flex-col justify-between ${colorClass}`}
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-medium truncate">{gu.name}</span>
                              <span className="text-[8px] opacity-60">Lv.{gu.level}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEquipGu(gu.id);
                              }}
                              className="w-full mt-2 py-0.5 bg-gu-accent text-gu-dark text-[9px] font-bold rounded hover:bg-yellow-300"
                            >
                              Sử dụng
                            </button>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= EQUIPMENT TAB ================= */}
        {activeTab === 'equip' && (
          <div className="space-y-4">
            {/* Slots */}
            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase mb-2">Các slot trang bị</h3>
              <div className="grid grid-cols-2 gap-2">
                {SLOTS.map((slot) => {
                  const idx = SLOTS.indexOf(slot);
                  const instance = playerEquipInstances.find((e) => String(e.isEquipped) === 'true' && e.slotIndex === idx);
                  const tmpl = instance ? equipmentList.find((t) => t.id === instance.equipmentId) : null;
                  const colorClass = tmpl ? TIER_COLORS[tmpl.tier] || TIER_COLORS.common : 'border-gray-800 bg-gu-darker/20';

                  return (
                    <div
                      key={slot}
                      onClick={() => instance && setSelectedEquip({ ...instance, template: tmpl })}
                      className={`h-11 rounded-lg border px-2 flex items-center justify-between text-[10px] cursor-pointer hover:border-gu-accent transition-colors ${colorClass}`}
                    >
                      <span className="text-gray-500 font-medium">{SLOT_LABELS[slot] ?? slot}</span>
                      <span className={tmpl ? 'text-green-300 font-bold truncate max-w-[60%]' : 'text-gray-700'}>
                        {tmpl ? tmpl.name : '∅'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detail section */}
            {selectedEquip ? (
              <div className="bg-gu-darker/60 rounded-xl border border-gu-border p-3 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-gu-accent">
                      {selectedEquip.template?.name} +{selectedEquip.enhancement}
                    </h4>
                    <span className="text-[9px] text-gray-400 capitalize">
                      Loại: {selectedEquip.template?.type} | Phẩm: {selectedEquip.template?.tier}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleEnhanceItem(selectedEquip.id)}
                      className="px-2.5 py-1 text-[10px] bg-yellow-950/60 border border-yellow-700/70 text-yellow-300 rounded hover:bg-yellow-900/40 transition-colors"
                    >
                      Cường Hóa
                    </button>
                    <button
                      onClick={() => handleUnequipItem(selectedEquip.id)}
                      className="px-2.5 py-1 text-[10px] bg-red-950/60 border border-red-700/70 text-red-300 rounded hover:bg-red-900/40 transition-colors"
                    >
                      Tháo Ra
                    </button>
                  </div>
                </div>
                {selectedEquip.template && (
                  <div className="border-t border-gu-border/30 pt-2 text-[10px] space-y-1">
                    <span className="font-bold text-gray-400 block">Thuộc tính trang bị:</span>
                    <div className="flex gap-3">
                      {selectedEquip.template.baseAtk > 0 && (
                        <span>Tấn công: +{selectedEquip.template.baseAtk + selectedEquip.enhancement * 4}</span>
                      )}
                      {selectedEquip.template.baseDef > 0 && (
                        <span>Phòng ngự: +{selectedEquip.template.baseDef + selectedEquip.enhancement * 2}</span>
                      )}
                      {selectedEquip.template.baseHp > 0 && (
                        <span>HP: +{selectedEquip.template.baseHp + selectedEquip.enhancement * 15}</span>
                      )}
                    </div>
                    <p className="text-gray-500 italic mt-1">{selectedEquip.template.description}</p>
                  </div>
                )}
              </div>
            ) : (
              /* Equipment inventory list */
              <div>
                <h3 className="text-[10px] font-bold text-gray-400 uppercase mb-2">Túi Trang Bị</h3>
                {playerEquipInstances.filter((e) => String(e.isEquipped) === 'false').length === 0 ? (
                  <p className="text-xs text-gray-600 italic py-4 text-center">Túi trang bị trống</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {playerEquipInstances
                      .filter((e) => String(e.isEquipped) === 'false')
                      .map((instance) => {
                        const tmpl = equipmentList.find((t) => t.id === instance.equipmentId);
                        if (!tmpl) return null;
                        const colorClass = TIER_COLORS[tmpl.tier] || TIER_COLORS.common;

                        return (
                          <div
                            key={instance.id}
                            onClick={() => setSelectedEquip({ ...instance, template: tmpl })}
                            className={`rounded-lg border p-2 text-xs cursor-pointer hover:border-gu-accent transition-colors flex flex-col justify-between ${colorClass}`}
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-medium truncate">{tmpl.name}</span>
                              <span className="text-[8px] opacity-60">+{instance.enhancement}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEquipItem(instance.id, tmpl.slot);
                              }}
                              className="w-full mt-2 py-0.5 bg-gu-accent text-gu-dark text-[9px] font-bold rounded hover:bg-yellow-300"
                            >
                              Sử dụng
                            </button>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= QUESTS TAB ================= */}
        {activeTab === 'quest' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gu-accent border-b border-gu-border pb-1.5 uppercase tracking-wide">
              Nhiệm Vụ Đang Thực Hiện
            </h3>
            {activePlayerQuests.length === 0 ? (
              <p className="text-xs text-gray-500 italic py-6 text-center select-none">
                Hiện tại không có nhiệm vụ nào hoạt động.
              </p>
            ) : (
              <div className="space-y-3.5">
                {activePlayerQuests.map((pq) => {
                  const template = questTemplates.find((t) => t.id === pq.questId);
                  if (!template) return null;

                  const objectives = template.objectives
                    ? typeof template.objectives === 'string'
                      ? (JSON.parse(template.objectives) as QuestObjective[])
                      : (template.objectives as QuestObjective[])
                    : [];

                  const allDone = objectives.every((obj, i) => {
                    const prog = pq.objectivesProgress?.[i];
                    return prog && prog.current >= obj.count;
                  });

                  return (
                    <div
                      key={pq.id}
                      className="bg-gu-darker/50 border border-gu-border/80 rounded-xl p-3.5 space-y-2.5 shadow-lg relative text-white"
                    >
                      {/* Quest Title & Type */}
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-yellow-400">{template.name}</h4>
                        <span className="text-[8px] bg-yellow-950/80 border border-yellow-800 text-yellow-300 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider">
                          {template.type === 'main' ? 'Chính' : 'Phụ'}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-[10px] text-gray-400 leading-relaxed italic border-l-2 border-gray-700 pl-2">
                        {template.description}
                      </p>

                      {/* Objectives */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Mục tiêu:</span>
                        {objectives.map((obj, i) => {
                          const prog = pq.objectivesProgress?.[i] || { current: 0, target: obj.count };
                          const isObjDone = prog.current >= obj.count;

                          // Dynamic objective description
                          let objectiveLabel = '';
                          if (obj.type === 'kill') {
                            objectiveLabel = `Tiêu diệt ${obj.target}`;
                          } else if (obj.type === 'talk') {
                            objectiveLabel = `Đối thoại với ${obj.target}`;
                          } else if (obj.type === 'reach') {
                            objectiveLabel = `Đi đến ${obj.target}`;
                          } else if (obj.type === 'collect') {
                            objectiveLabel = `Thu thập ${obj.target}`;
                          } else {
                            objectiveLabel = obj.description || `Mục tiêu ${i + 1}`;
                          }

                          return (
                            <div
                              key={i}
                              className={`flex justify-between items-center text-[10px] pl-1 ${
                                isObjDone ? 'text-green-400 font-medium' : 'text-gray-400'
                              }`}
                            >
                              <span>{isObjDone ? '✓' : '•'} {objectiveLabel}</span>
                              <span className="font-mono">
                                {prog.current}/{obj.count}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Complete / Claim Reward Button */}
                      {allDone && (
                        <div className="pt-2 border-t border-gu-border/25 mt-1.5 flex justify-end">
                          <button
                            onClick={() => handleCompleteQuest(pq.questId)}
                            className="w-full py-1.5 text-xs bg-yellow-400 hover:bg-yellow-300 text-gu-dark font-bold rounded-lg shadow-md hover:shadow-lg active:scale-98 transition-all uppercase tracking-wider text-center"
                          >
                            Nhận Phần Thưởng (Hoàn Thành)
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-2 border-t border-gu-border bg-gu-darker/60 text-[9px] text-gray-500 shrink-0 text-center">
        Nhấn C trên bàn phím để đóng/mở nhanh bảng nhân vật.
      </div>
    </div>
  );
}
