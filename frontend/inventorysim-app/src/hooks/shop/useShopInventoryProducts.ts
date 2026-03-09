import { useInventoryStore } from '@/store/inventory/useInventoryStore';
import { useProductStore } from '@/store/inventory/useProductStore';
import { useSelectedShop } from './useSelectedShop';

/**
 * Returns products and inventory for the currently selected shop.
 * Safe: returns empty arrays if no shop is selected.
 */
export function useShopInventoryProducts() {
  const { selectedId: shopId } = useSelectedShop();

  // fallback if no shop selected
  const id = shopId ?? '';

  // get products and inventory only if current shop matches requested shop
  const products = useProductStore((s) => s.productsByShopId(id));
  const inventory = useInventoryStore((s) => s.inventoryByShopId(id));
  const loading = useInventoryStore((s) => s.loading);

  return { products, inventory, loading };
}
