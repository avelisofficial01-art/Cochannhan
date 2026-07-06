import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { fetchWithAuth } from '../api/client.js';

interface ShopItemPayload {
  id: string;
  itemId: string;
  price: number;
  stock: number | null;
  itemName: string;
  itemType: string;
  itemDescription: string | null;
  itemSprite: string | null;
}

export default function ShopPanel(): React.ReactElement | null {
  const {
    isShopOpen,
    activeShopNpc,
    toggleShop,
    inventorySlots,
    setInventorySlots,
    profile,
    setProfile,
  } = useGameStore();

  const [shopItems, setShopItems] = useState<ShopItemPayload[]>([]);
  const [itemTemplates, setItemTemplates] = useState<Record<string, { sellPrice: number }>>({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchItemTemplates = async () => {
    try {
      const res = await fetchWithAuth('/api/inventory/items');
      const json = await res.json();
      if (json.success && json.data) {
        const list = json.data as Array<{ id: string; sellPrice: number }>;
        const map: Record<string, { sellPrice: number }> = {};
        for (const t of list) {
          map[t.id] = { sellPrice: t.sellPrice };
        }
        setItemTemplates(map);
      }
    } catch (err) {
      console.error('[ShopPanel] Failed to fetch item templates:', err);
    }
  };

  const fetchShop = async () => {
    if (!activeShopNpc) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetchWithAuth(`/api/shop/${activeShopNpc.id}`);
      const json = await res.json();
      if (json.success && json.data) {
        setShopItems(json.data.items || []);
      } else {
        setShopItems([]);
      }
    } catch {
      setErrorMsg('Không thể tải danh sách cửa hàng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isShopOpen && activeShopNpc) {
      void fetchShop();
      void fetchItemTemplates();
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isShopOpen, activeShopNpc]);

  if (!isShopOpen || !activeShopNpc) return null;

  const handleBuy = async (itemId: string, itemName: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await fetchWithAuth('/api/shop/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          npcId: activeShopNpc.id,
          itemId,
          quantity: 1,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setSuccessMsg(`✅ Mua thành công 1x ${itemName}!`);
        // Update store inventory
        setInventorySlots(json.data.inventory);
        // Update store gold
        if (profile) {
          setProfile({ ...profile, gold: json.data.gold });
        }
        // Refresh shop items to update stock
        void fetchShop();
      } else {
        setErrorMsg(`❌ ${json.message || 'Mua thất bại.'}`);
      }
    } catch {
      setErrorMsg('❌ Lỗi kết nối mạng.');
    }
  };

  const handleSell = async (itemId: string, itemName: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await fetchWithAuth('/api/shop/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          quantity: 1,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setSuccessMsg(`✅ Bán thành công 1x ${itemName}!`);
        // Update store inventory
        setInventorySlots(json.data.inventory);
        // Update store gold
        if (profile) {
          setProfile({ ...profile, gold: json.data.gold });
        }
        // Refresh shop items to update stock (if any)
        void fetchShop();
      } else {
        setErrorMsg(`❌ ${json.message || 'Bán thất bại.'}`);
      }
    } catch {
      setErrorMsg('❌ Lỗi kết nối mạng.');
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 w-[640px] h-[480px] bg-slate-900/95 border border-amber-500/50 rounded-2xl flex flex-col shadow-2xl backdrop-blur-md overflow-hidden text-white">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-950/80 border-b border-amber-500/30 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🛒</span>
          <div>
            <h2 className="text-md font-bold text-amber-400">{activeShopNpc.name === 'Thợ rèn' ? 'Tiệm Rèn Bắc Nguyên' : 'Tập Hóa Thương Nhân'}</h2>
            <p className="text-[10px] text-gray-400">Giao dịch mua bán vật phẩm, linh dược và binh khí</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-amber-950/40 border border-amber-700/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold text-yellow-400 text-xs shadow-inner">
            <span>💰</span>
            <span>{profile?.gold ?? 0} vàng</span>
          </div>
          <button
            onClick={() => toggleShop(false)}
            className="text-gray-400 hover:text-red-400 text-xl font-bold transition-colors leading-none"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Main split content */}
      <div className="flex-1 flex min-h-0 bg-slate-900/50">
        {/* Left Side: Shop list */}
        <div className="flex-1 border-r border-slate-800 flex flex-col p-4 min-h-0">
          <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2.5">Cửa Hàng Bán</h3>
          <div className="flex-1 overflow-y-auto pr-1 space-y-3.5">
            {loading ? (
              <p className="text-xs text-gray-500 italic py-8 text-center">Đang tải vật phẩm...</p>
            ) : shopItems.length === 0 ? (
              <p className="text-xs text-gray-500 italic py-8 text-center">Không bán vật phẩm nào.</p>
            ) : (
              shopItems.map((item) => {
                const canAfford = (profile?.gold ?? 0) >= item.price;
                return (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl flex items-center justify-between gap-3 text-xs hover:border-slate-700/80 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-orange-300 truncate">{item.itemName}</span>
                        {item.stock !== null && (
                          <span className="text-[9px] bg-red-950/80 text-red-400 border border-red-900/50 px-1 py-0.2 rounded">
                            Còn: {item.stock}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5" title={item.itemDescription || ''}>
                        {item.itemDescription || 'Không có mô tả.'}
                      </p>
                      <div className="text-[10px] text-yellow-500 font-medium mt-1">
                        Giá: {item.price} vàng
                      </div>
                    </div>
                    <button
                      onClick={() => handleBuy(item.itemId, item.itemName)}
                      disabled={!canAfford || (item.stock !== null && item.stock <= 0)}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg shadow transition-all ${
                        canAfford && (item.stock === null || item.stock > 0)
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95'
                          : 'bg-slate-800 text-gray-500 cursor-not-allowed opacity-50'
                      }`}
                    >
                      Mua
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Player inventory (sellable items) */}
        <div className="flex-1 flex flex-col p-4 min-h-0">
          <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2.5">Hành Trang Của Bạn</h3>
          <div className="flex-1 overflow-y-auto pr-1 space-y-3.5">
            {inventorySlots.length === 0 ? (
              <p className="text-xs text-gray-500 italic py-8 text-center">Túi đồ trống.</p>
            ) : (
              inventorySlots.map((slot) => {
                const sellPrice = itemTemplates[slot.itemId]?.sellPrice ?? 0;
                const canSell = sellPrice > 0;

                return (
                  <div
                    key={slot.id}
                    className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl flex items-center justify-between gap-3 text-xs hover:border-slate-700/80 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-200 truncate">{slot.itemName}</span>
                        <span className="text-[10px] text-gray-400 font-mono">x{slot.quantity}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-gray-500 mt-1">
                        <span>Ô #{slot.slot}</span>
                        <span className="text-emerald-500 font-medium">
                          {canSell ? `Bán: ${sellPrice} vàng` : 'Không thể bán'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSell(slot.itemId, slot.itemName)}
                      disabled={!canSell}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg shadow transition-all ${
                        canSell
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95'
                          : 'bg-slate-800 text-gray-500 cursor-not-allowed opacity-50'
                      }`}
                    >
                      Bán x1
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Messages / Alerts */}
      {(successMsg || errorMsg) && (
        <div className={`px-6 py-3 text-xs text-center border-t shrink-0 font-medium transition-all ${
          successMsg 
            ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400' 
            : 'bg-red-950/40 border-red-500/20 text-red-400'
        }`}>
          {successMsg || errorMsg}
        </div>
      )}

      {/* Footer hint */}
      <div className="px-6 py-2 bg-slate-950/40 border-t border-slate-800 text-[9px] text-gray-500 text-center shrink-0">
        Mở cuộc đối thoại với NPC để giao dịch lại bất kỳ lúc nào.
      </div>
    </div>
  );
}
