import { shopSliceToMeta } from "@/store/shop/adapter";
import { useShopStore } from "@/store/shop/useShopStore";
import type { ShopSlice } from "@/types/shop";

// export function useSelectedShop() {
//   const shop = useShopStore((s) => s.shop); // ShopMeta
//   const shops = useShopStore((s) => s.shops);
//   const selectShop = useShopStore((s) => s.setShop);

//   const selectedSlice: ShopSlice | null = shop ? shops[shop.id] ?? null : null;
//   const selectedId = shop?.id ?? null;

//   return { selectedId, shop, selectedSlice, selectShop };
// }


export function useSelectedShop() {
  const shop = useShopStore((s) => s.shop);          // ShopMeta | null
  const shops = useShopStore((s) => s.shops);
  const setShop = useShopStore((s) => s.setShop);

  const selectedId = shop?.id ?? null;

  const selectedSlice: ShopSlice | null =
    selectedId ? shops[selectedId] ?? null : null;

  const normalizedShop =
    selectedId && selectedSlice
      ? shopSliceToMeta(selectedId, selectedSlice)
      : null;

  return {
    selectedId,
    shop: normalizedShop,
    selectedSlice,
    selectShop: setShop, // expects ShopMeta
  };
}
