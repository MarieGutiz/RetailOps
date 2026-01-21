// hooks/useShopProducts.ts
import { useApiErrorToast } from "@/services/api/useApiErrorToast";
import { useShopStore } from "@/store/shop/useShopStore";
import type { ShopId } from "@/types/shop";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";


export function useShopProducts(
  id: ShopId,
  simulationType: "classic" | "multi" = "classic"
) {
  const [localError, setLocalError] = useState<unknown>(null);

  const { runABC, shopSlice, ensureShop } = useShopStore(
    useShallow((s) => ({
      runABC: s.runABC,
      shopSlice: s.shops[id],
      ensureShop: s.setShop, // reuse initializer
    }))
  );

  /* ───────────── ENSURE SHOP EXISTS ───────────── */
  useEffect(() => {
    ensureShop(id);
  }, [id, ensureShop]);

  // Safe defaults
  const products = shopSlice?.products ?? [];
  const inventory = shopSlice?.inventory;
  const analytics = shopSlice?.analytics;
  const abc = shopSlice?.abc ?? { loading: false };
  const hydrated = shopSlice?.hydrated ?? false;

  /* ───────────── RUN BACKEND ABC ONCE ───────────── */
  useEffect(() => {
    if (!shopSlice || hydrated) return;

    runABC({
      executionMode: "BACKEND",
      simulationType,
    }).catch((err) => {
      setLocalError(err);
      console.error(`Failed to load ABC for shop ${id}:`, err);
    });
  }, [shopSlice, hydrated, simulationType, runABC, id]);

  /* ───────────── ERROR TOAST ───────────── */
  useApiErrorToast(localError ?? abc.error, `Shop: ${id}`);

  return {
    products,
    inventory,
    analytics,

    summary: abc.summary,
    table: abc.table,

    loading: abc.loading,
    error: abc.error,
  };
}

//Helper for getting ship by "id"
export const useCurrentShopSlice = (id: ShopId) =>
  useShopStore((s) => s.shops[id]);
