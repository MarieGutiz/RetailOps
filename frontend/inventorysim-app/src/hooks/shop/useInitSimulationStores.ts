import { useInventoryStore } from '@/store/inventory/useInventoryStore';
import { useProductStore } from '@/store/inventory/useProductStore';
import { type ShopMeta } from '@/store/shop/useShopStore';
import type { Product } from '@/types/products';
import { useEffect } from 'react';

// Hook to intialize the inventory and pdct store for a given 
// shop, used when a shop is created.

export function useInitSimulationStores(
  shop: ShopMeta | null,
  products?: Product[]
) {
  const initInventory = useInventoryStore((s) => s.initInventoryForShop);

  const initProducts = useProductStore((s) => s.initSimulationForShop);

  useEffect(() => {
    if (!shop) return;
    if (!products || products.length === 0) return;

    initInventory(shop.id);

    initProducts({
      id: shop.id,
      name: shop.name,
      products,
      kind: shop.kind,
    });
  }, [shop?.id, products]);
}
