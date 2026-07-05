import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore.js';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

async function fetchRecipes(token: string): Promise<{ data?: Array<Record<string, unknown>> }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/api/craft/recipes`, { headers });
  if (!res.ok) throw new Error('Failed to fetch recipes');
  return res.json();
}

export default function CraftPanel(): React.ReactElement | null {
  const {
    isCraftPanelOpen,
    toggleCraftPanel,
    recipeList,
    setRecipeList,
  } = useGameStore();

  const [craftMessage, setCraftMessage] = React.useState<string | null>(null);
  const [craftingId, setCraftingId] = React.useState<string | null>(null);

  const handleCraft = async (recipeId: string, recipeName: string) => {
    setCraftingId(recipeId);
    setCraftMessage(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/craft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipeId }),
      });
      const json = await res.json();
      if (json.success) {
        setCraftMessage(`✅ Chế tạo ${recipeName} thành công!`);
      } else {
        setCraftMessage(`❌ ${json.message || 'Chế tạo thất bại'}`);
      }
    } catch {
      setCraftMessage('❌ Lỗi kết nối');
    } finally {
      setCraftingId(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetchRecipes(token)
      .then((data) => {
        const list = (data.data ?? []) as Array<Record<string, unknown>>;
        setRecipeList(
          list.map((r) => ({
            id: String(r.id ?? ''),
            name: String(r.name ?? ''),
            resultType: String(r.resultType ?? 'equipment'),
            resultName: String(r.resultName ?? ''),
            requiredGold: Number(r.requiredGold ?? 0),
            successRate: Number(r.successRate ?? 100),
            materials: ((r.materials ?? []) as Array<Record<string, unknown>>).map((m) => ({
              itemName: String(m.itemName ?? m.item_name ?? ''),
              quantity: Number(m.quantity ?? 1),
            })),
          })),
        );
      })
      .catch(() => { /* recipes unavailable */ });
  }, [setRecipeList]);

  if (!isCraftPanelOpen) {
    return null;
  }

  return (
    <div className="absolute top-0 left-0 z-20 w-72 h-full bg-gu-dark border-r border-gu-border flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gu-border">
        <h2 className="text-sm font-bold text-orange-400">🔧 Chế tạo</h2>
        <button
          onClick={toggleCraftPanel}
          className="text-gray-400 hover:text-white text-lg leading-none"
        >
          ✕
        </button>
      </div>

      {/* Recipe List */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <h3 className="text-xs text-gray-400 mb-2">Công thức ({recipeList.length})</h3>
        {recipeList.length === 0 ? (
          <p className="text-xs text-gray-600 italic">Đang tải công thức...</p>
        ) : (
          <div className="space-y-3">
            {recipeList.map((recipe) => (
              <div
                key={recipe.id}
                className="rounded border border-gray-700 bg-gray-900/30 p-3 text-xs"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-orange-300">{recipe.resultName}</span>
                  <span className={`text-[10px] ${recipe.successRate >= 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {recipe.successRate}%
                  </span>
                </div>

                {/* Materials */}
                <div className="space-y-1 mb-2">
                  {recipe.materials.map((mat, i) => (
                    <div key={i} className="flex justify-between text-[10px] text-gray-400">
                      <span>📦 {mat.itemName}</span>
                      <span>x{mat.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Gold */}
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-yellow-500">💰 {recipe.requiredGold} gold</span>
                  <button
                    onClick={() => handleCraft(recipe.id, recipe.resultName)}
                    disabled={craftingId === recipe.id}
                    className={`px-2 py-1 rounded border border-orange-500/50 text-orange-400 hover:bg-orange-500/20 transition-colors ${craftingId === recipe.id ? 'opacity-50 cursor-wait' : ''}`}
                    title="Craft this item"
                  >
                    {craftingId === recipe.id ? '⏳' : 'Chế tạo'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Craft Message */}
      {craftMessage && (
        <div className={`px-3 py-2 text-xs text-center border-t border-gu-border ${
          craftMessage.startsWith('✅') ? 'text-green-400 bg-green-950/20' : 'text-red-400 bg-red-950/20'
        }`}>
          {craftMessage}
        </div>
      )}

      {/* Footer */}
      <div className="px-3 py-2 text-[10px] text-gray-600 border-t border-gu-border">
        Nhấn C để đóng/mở
      </div>
    </div>
  );
}
