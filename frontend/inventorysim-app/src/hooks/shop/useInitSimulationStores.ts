import { useInventoryStore } from "@/store/inventory/useInventoryStore"
import { useProductStore } from "@/store/inventory/useProductStore"
import { useShopStore, type ShopMeta } from "@/store/shop/useShopStore"
import type { Product } from "@/types/products"
import { useEffect } from "react"

// export function useEnsureInventory() {
//   const shop = useShopStore(s => s.shop)
//   const initInventoryForShop =
//     useInventoryStore(s => s.initInventoryForShop)

//   useEffect(() => {
//     if (!shop) return
//     if (shop.kind === "AUTOGEN") return

//     initInventoryForShop(shop.id)
//   }, [shop?.id])
// }

// export function useInitSimulationStores(
//   shop: ShopMeta | null,
//   products?: Product[]
// ) {
//   const initInventory = useInventoryStore(s => s.initInventoryForShop)
//   const initProducts = useProductStore(s => s.initSimulationForShop)

//   useEffect(() => {
//     if (!shop) return
//     if (!products || products.length === 0) return

//     initInventory(shop.id)
//     initProducts({
//       id: shop.id,
//       name: shop.name,
//       products,
//       kind: "USER",
//     })
//   }, [shop?.id, products])
// }

export function useInitSimulationStores(
  shop: ShopMeta | null,
  products?: Product[]
) {
  const initInventory =
    useInventoryStore(s => s.initInventoryForShop);

  const initProducts =
    useProductStore(s => s.initSimulationForShop);

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
