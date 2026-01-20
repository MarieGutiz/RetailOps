// hooks/useShopProducts.ts
import { useShopStore } from "@/store/shop/useShopStore";
import type { ShopId } from "@/types/shop";
import { useEffect } from "react";

export function useShopProducts(
  id: ShopId, 
  simulationType: "classic" | "multi" = "classic"
) {
  const shop = useShopStore((s) => s.shop); // current selected shop
  const runABC = useShopStore((s) => s.runABC);
  const abcState = useShopStore((s) => s.abc);

  // Grab per-shop data
  const shopData = useShopStore((s) => s.shops[id] ?? {});
  const products = shopData.products ?? [];
  const analytics = shopData.analytics;
  const inventory = shopData.inventory;
  const hydrated = useShopStore((s) => s.hydratedByShop[id] ?? false);

  useEffect(() => {
    // If already hydrated, skip
    if (hydrated) return;

    runABC({
      executionMode: "BACKEND",
      simulationType,
    }).catch((err) => {
      console.error(`Failed to load backend ABC for shop ${id}:`, err);
    });
  }, [id, simulationType, hydrated, runABC]);

  return {
    products,
    analytics,
    inventory,
    summary: abcState.summary,
    loading: abcState.loading,
    error: abcState.error,
  };
}