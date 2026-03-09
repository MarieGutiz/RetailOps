// hooks/useShopProducts.ts
import { useApiErrorToast } from '@/services/api/useApiErrorToast';
import { useShopStore } from '@/store/shop/useShopStore';
import { type ShopId } from '@/types/shop';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

//Hook to manage shop prdcts, inventory and analytics data, includng loading and error states.
//It also hydrates data by calling the bckend if needed based on the shop lifecycle and provided options.

interface UseShopProductsOptions {
  enabled?: boolean;
  simulationType?: 'classic' | 'multi';
  forceBackend?: boolean;
}

export function useShopProducts(
  id: ShopId | null,
  options?: UseShopProductsOptions
) {
  const {
    enabled = true,
    simulationType = 'classic',
    forceBackend = false,
  } = options ?? {};

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
  const lifecycle = shopSlice?.lifecycle ?? 'CREATED';

  useEffect(() => {
    if (!id || !enabled || !shopSlice) return;
    if (hydrated && !forceBackend) return;

    (async () => {
      try {
        await runABC({
          executionMode: 'BACKEND',
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
    lifecycle,
  };
}

//Helper for getting ship by "id"
export const useCurrentShopSlice = (id: ShopId) =>
  useShopStore((s) => s.shops[id]);
