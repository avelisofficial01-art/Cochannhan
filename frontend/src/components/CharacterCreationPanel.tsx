import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../api/client.js';

interface Constitution {
  id: number;
  name: string;
  description: string;
  passive_ability: string;
  passive_description: string;
  weakness: string;
  stat_bonuses: Record<string, number>;
  rarity: string;
  realm_scaling: boolean;
}

interface Props {
  onCreated: (playerId: string, playerName: string) => void;
}

const RARITY_COLOR: Record<string, string> = {
  legendary: 'text-yellow-400 border-yellow-500/60 bg-yellow-900/20',
  epic: 'text-purple-400 border-purple-500/60 bg-purple-900/20',
  rare: 'text-blue-400 border-blue-500/60 bg-blue-900/20',
  common: 'text-gray-300 border-gray-500/40 bg-gray-900/20',
};

const RARITY_LABEL: Record<string, string> = {
  legendary: '✦ Truyền Thuyết',
  epic: '◆ Sử Thi',
  rare: '● Hiếm',
  common: '○ Thường',
};

export default function CharacterCreationPanel({ onCreated }: Props): React.ReactElement {
  const [step, setStep] = useState<'name' | 'constitution'>('name');
  const [playerName, setPlayerName] = useState('');
  const [constitutions, setConstitutions] = useState<Constitution[]>([]);
  const [selected, setSelected] = useState<Constitution | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWithAuth('/api/constitution')
      .then((r) => r.json())
      .then((d: { success: boolean; data: Constitution[] }) => {
        if (d.success) setConstitutions(d.data);
      })
      .catch(() => {});
  }, []);

  async function handleCreate(): Promise<void> {
    if (!playerName.trim()) { setError('Nhập tên nhân vật!'); return; }
    if (!selected) { setError('Chọn Thập Tuyệt Thể!'); return; }
    setError('');
    setLoading(true);
    try {
      // 1. Create player
      const createRes = await fetchWithAuth('/api/player/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName.trim() }),
      });
      const createData = await createRes.json() as { success: boolean; data?: { player?: { id: string; name: string } } };
      if (!createData.success || !createData.data?.player) {
        throw new Error('Tạo nhân vật thất bại');
      }
      const { id, name } = createData.data.player;

      // 2. Choose constitution
      await fetchWithAuth('/api/constitution/choose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ constitutionId: selected.id }),
      });

      onCreated(id, name);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi không xác định';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-2">
      <div className="w-full max-w-2xl rounded-xl border border-gu-gold/40 bg-gu-dark shadow-2xl">
        {/* Header */}
        <div className="border-b border-gu-gold/30 px-6 py-4 text-center">
          <h1 className="font-fantasy text-3xl text-gu-gold">CỔ ĐẠO</h1>
          <p className="mt-1 text-sm text-gray-400">Tạo Nhân Vật</p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 rounded border border-red-500/50 bg-red-900/20 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Step 1: Name */}
          {step === 'name' && (
            <div className="space-y-4">
              <p className="text-center text-gray-300">Đặt tên cho nhân vật của bạn</p>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Nhập pháp danh..."
                maxLength={30}
                className="w-full rounded border border-gu-gold/30 bg-black/40 px-4 py-3 text-center text-lg text-gu-gold placeholder-gray-600 outline-none focus:border-gu-gold"
              />
              <button
                onClick={() => {
                  if (!playerName.trim()) { setError('Nhập tên nhân vật!'); return; }
                  setError('');
                  setStep('constitution');
                }}
                className="w-full rounded bg-gu-gold/90 px-4 py-3 font-bold text-black transition hover:bg-gu-gold"
              >
                Tiếp Theo →
              </button>
            </div>
          )}

          {/* Step 2: Choose constitution */}
          {step === 'constitution' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <button onClick={() => setStep('name')} className="text-sm text-gray-400 hover:text-gray-200">← Quay lại</button>
                <p className="flex-1 text-center text-gray-300">
                  <span className="text-gu-gold font-bold">{playerName}</span>
                  {' '}— Chọn Thập Tuyệt Thể
                </p>
              </div>

              <div className="max-h-[50vh] overflow-y-auto space-y-2 pr-1">
                {constitutions.map((c) => {
                  const colorClass = RARITY_COLOR[c.rarity] ?? RARITY_COLOR.common;
                  const isSelected = selected?.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelected(c)}
                      className={`w-full rounded-lg border px-4 py-3 text-left transition ${colorClass} ${isSelected ? 'ring-2 ring-gu-gold' : 'opacity-80 hover:opacity-100'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{c.name}</span>
                        <span className="text-xs">{RARITY_LABEL[c.rarity] ?? c.rarity}</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-300 line-clamp-2">{c.description}</p>
                      <p className="mt-1 text-xs italic text-gray-400">⚡ {c.passive_description}</p>
                      {c.weakness && (
                        <p className="mt-1 text-xs text-red-400">⚠ Điểm yếu: {c.weakness}</p>
                      )}
                    </button>
                  );
                })}
              </div>

              {selected && (
                <div className="rounded-lg border border-gu-gold/40 bg-gu-gold/5 p-3 text-sm">
                  <p className="font-bold text-gu-gold">{selected.name}</p>
                  <p className="mt-1 text-gray-300">{selected.passive_description}</p>
                  {selected.weakness && (
                    <p className="mt-1 text-xs text-red-400">⚠ Điểm yếu: {selected.weakness}</p>
                  )}
                  {selected.realm_scaling && (
                    <p className="mt-1 text-xs text-green-400">★ Sức mạnh tăng khi đột phá cảnh giới</p>
                  )}
                </div>
              )}

              <button
                onClick={handleCreate}
                disabled={loading || !selected}
                className="w-full rounded bg-gu-gold/90 px-4 py-3 font-bold text-black transition hover:bg-gu-gold disabled:opacity-40"
              >
                {loading ? 'Đang tạo...' : 'Bắt Đầu Tu Tiên'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
