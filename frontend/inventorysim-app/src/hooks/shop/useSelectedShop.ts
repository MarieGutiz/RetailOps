import { shopSliceToMeta } from '@/store/shop/adapter';
import { useShopStore } from '@/store/shop/useShopStore';
import type { ShopSlice } from '@/types/shop';

// Hook to get the currently selected shop and its data slice from the shop store.
// Very important hook for accessing shop data accross the whole app!

export function useSelectedShop() {
  const shop = useShopStore((s) => s.shop); // ShopMeta | null
  const shops = useShopStore((s) => s.shops);
  const setShop = useShopStore((s) => s.setShop);

  const selectedId = shop?.id ?? null;

  const selectedSlice: ShopSlice | null = selectedId
    ? (shops[selectedId] ?? null)
    : null;

  const normalizedShop =
    selectedId && selectedSlice
      ? shopSliceToMeta(selectedId, selectedSlice)
      : null;

  //     const shopName =
  // selectedSlice && "name" in selectedSlice
  //   ? selectedSlice.name
  //   : undefined;
  const shopName = normalizedShop?.name;

  return {
    selectedId,
    shop: normalizedShop,
    selectedSlice,
    selectShop: setShop, // expects ShopMeta
    shopName,
  };
}
