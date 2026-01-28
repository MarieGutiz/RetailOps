// hooks/useShopProducts.ts
import { useApiErrorToast } from "@/services/api/useApiErrorToast";
import { useShopStore } from "@/store/shop/useShopStore";
import { type ShopId } from "@/types/shop";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

interface UseShopProductsOptions {
  enabled?: boolean;
  simulationType?: "classic" | "multi";
  forceBackend?: boolean; 
}

export function useShopProducts(
 id: ShopId | null,
options?: UseShopProductsOptions
) {
  const { enabled = true, simulationType = "classic", forceBackend = false } = options ?? {};

  const [localError, setLocalError] = useState<unknown>(null);

  const { runABC, shopSlice } = useShopStore(
    useShallow((s) => ({
      runABC: s.runABC,
      shopSlice: id ? s.shops[id] : undefined,
    }))
  );

  // Safe defaults if shop not initialized yet
  const products = shopSlice?.products ?? [];
  const inventory = shopSlice?.inventory;
  const analytics = shopSlice?.analytics;
  const abc = shopSlice?.abc ?? { loading: false };
  const hydrated = shopSlice?.hydrated ?? false;
  const lifecycle = shopSlice?.lifecycle ?? "CREATED";


  // ------------------- Run BACKEND ABC once per shop -------------------
  // useEffect(() => {
  //   if (!id) return;
  //   if (!enabled) return;
  //   if (hydrated && !options?.forceBackend) return;
  //   if (hydrated) return;

  //   runABC({
  //     executionMode: "BACKEND",
  //     simulationType,
  //   }).catch((err) => {
  //     const msg = err instanceof Error ? err.message : String(err);
  //     setLocalError(msg);
  //     console.error(`Failed to load sim shop ${id}:`, err);
  //   });
  // }, [id, enabled, hydrated, simulationType, forceBackend, runABC]);

      // Run BACKEND ABC if shop is CREATED or IMPORTING, or if forced
  // ------------------- Run BACKEND ABC when needed -------------------
//   useEffect(() => {
//   if (!id || !enabled || !shopSlice) return;

//   const { hydrated, lifecycle } = shopSlice;
//   const shouldRunBackend =
//     ["CREATED", "IMPORTING"].includes(lifecycle) && (!hydrated || forceBackend);

//   if (!shouldRunBackend) return;

//   (async () => {
//     try {
//       await runABC({
//         executionMode: "BACKEND",
//         simulationType,
//         shopId: id,
//       });
//     } catch (err) {
//       const msg = err instanceof Error ? err.message : String(err);
//       setLocalError(msg);
//       console.error(`Failed to load simulation for shop ${id}:`, err);
//     }
//   })();
// }, [id, enabled, shopSlice, simulationType, forceBackend, runABC]);
  useEffect(() => {
    if (!id || !enabled || !shopSlice) return;
    if (hydrated && !forceBackend) return;

    (async () => {
      try {
        await runABC({
          executionMode: "BACKEND",
          simulationType,
          shopId: id,
        });
      } catch (err) {
        setLocalError(err);
        console.error(`Failed to load shop ${id}`, err);
      }
    })();
  }, [id, enabled, hydrated, forceBackend, simulationType, runABC]);


  // ------------------- Show toast on error -------------------
    useApiErrorToast(localError ?? abc.error, id ? `Shop: ${id}` : undefined);


  return {
    products,
    inventory,
    analytics,

    summary: abc.summary,
    table: abc.table,

    loading: enabled && abc.loading,
    error: localError ?? abc.error,
    hydrated,
    lifecycle
  };
}

//Helper for getting ship by "id"
export const useCurrentShopSlice = (id: ShopId) =>
  useShopStore((s) => s.shops[id]);
