import { useShopStore } from "@/store/shop/useShopStore";
import type { ShopSlice } from "@/types/shop";

export function useSelectedShop() {
  const shop = useShopStore((s) => s.shop); // ShopMeta
  const shops = useShopStore((s) => s.shops);
  const selectShop = useShopStore((s) => s.setShop);

  const selectedSlice: ShopSlice | null = shop ? shops[shop.id] ?? null : null;
  const selectedId = shop?.id ?? null;

  return { selectedId, shop, selectedSlice, selectShop };
}
