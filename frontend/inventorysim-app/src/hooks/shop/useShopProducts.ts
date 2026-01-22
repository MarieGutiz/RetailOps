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

  const { runABC, shopSlice } = useShopStore(
    useShallow((s) => ({
      runABC: s.runABC,
      shopSlice: s.shops[id],
    }))
  );

  // Safe defaults if shop not initialized yet
  const products = shopSlice?.products ?? [];
  const inventory = shopSlice?.inventory;
  const analytics = shopSlice?.analytics;
  const abc = shopSlice?.abc ?? { loading: false };
  const hydrated = shopSlice?.hydrated ?? false;

  // ------------------- Run BACKEND ABC once per shop -------------------
  useEffect(() => {
    if (hydrated) return;

    runABC({
      executionMode: "BACKEND",
      simulationType,
    }).catch((err) => {
      const msg = err instanceof Error ? err.message : String(err);
      setLocalError(msg);
      console.error(`Failed to load sim shop ${id}:`, err);
    });
  }, [hydrated, id, simulationType, runABC]);

  // ------------------- Show toast on error -------------------
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
