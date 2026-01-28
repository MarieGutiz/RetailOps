import { useShopStore } from "@/store/shop/useShopStore";
import type { ShopId } from "@/types/shop";
import { useState, useEffect } from "react";

export function useSelectedShop(initialId: ShopId | null = null) {
  const [selectedId, setSelectedId] = useState<ShopId | null>(initialId);

  const shop = useShopStore((s) => (selectedId ? s.shops[selectedId] ?? null : null));

  // Clear selection if the shop was deleted
  useEffect(() => {
    if (selectedId && !shop) {
      setSelectedId(null);
    }
  }, [selectedId, shop]);

  const selectShop = (id: ShopId | null) => {
    setSelectedId(id);
  };

  return { selectedId, shop, selectShop };
}
