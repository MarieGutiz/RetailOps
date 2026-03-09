import { useApiErrorToast } from '@/services/api/useApiErrorToast';
import { useShopStore } from '@/store/shop/useShopStore';
import { shopId, type AutogenShopLifecycle, type ShopId } from '@/types/shop';
import { useEffect, useMemo, useRef, useState } from 'react';

// Hook to watch multiple shops and detect backend errors.

export type AutogenLibraryId = 'FLORIST' | 'CAFETERIA';

/**
 * Ensures AUTOGEN shops exist in the store.
 */
export function useEnsureAutogenShops(libraries: AutogenLibraryId[]) {
  const setShop = useShopStore((s) => s.setShop);

  useEffect(() => {
    libraries.forEach((lib) => {
      const id = shopId(lib) as ShopId;
      const slice = useShopStore.getState().shops[id];
      const now = Date.now();
      if (!slice) {
        setShop({
          id,
          name: lib,
          kind: 'AUTOGEN',
          lifecycle: 'CREATED',
          createdAt: now,
          lastUpdated: now,
          lastSavedAt: now,
        });
      }
    });
  }, [libraries, setShop]);
}

/**
 * Watches AUTOGEN shops and triggers backend ABC fetch.
 */

export type AutogenAvailabilityEntry = {
  lib: AutogenLibraryId;
  lifecycle: 'CREATED' | 'IMPORTING' | 'READY' | 'FAILED';
  unavailable: boolean;
  available: boolean;
  loading: boolean;
};

export type AutogenAvailabilityResult = {
  unavailable: boolean;
  checking: boolean;
  perLibrary: AutogenAvailabilityEntry[];
};

export function useAutogenAvailability(
  libraries: AutogenLibraryId[],
  enabled: boolean
): AutogenAvailabilityResult {
  const shopStore = useShopStore();
  const [armed, setArmed] = useState(false);
  const fetchedRef = useRef<Set<ShopId>>(new Set());
  const errorRef = useRef<unknown>(null);

  // Arm after delay to avoid instant fetch
  useEffect(() => {
    if (!enabled || libraries.length === 0) return;
    const t = setTimeout(() => setArmed(true), 500);
    return () => clearTimeout(t);
  }, [enabled, libraries]);

  // Prepare slices
  const slices = useMemo(() => {
    return libraries
      .map((lib) => {
        const id = shopId(lib) as ShopId;
        const slice = shopStore.shops[id];

        if (!slice || slice.kind !== 'AUTOGEN') return null;

        // Narrow lifecycle here
        const lifecycle = slice.lifecycle as AutogenShopLifecycle;

        return { lib, id, slice, lifecycle };
      })
      .filter(Boolean) as {
      lib: AutogenLibraryId;
      id: ShopId;
      slice: (typeof shopStore.shops)[ShopId];
      lifecycle: AutogenShopLifecycle;
    }[];
  }, [libraries, shopStore.shops]);

  // Trigger backend ABC fetch
  useEffect(() => {
    if (!armed) return;

    slices.forEach(({ id, slice, lifecycle }) => {
      const hydrated = slice?.hydrated ?? false;
      const shouldFetch =
        (!hydrated || lifecycle === 'CREATED' || lifecycle === 'IMPORTING') &&
        !fetchedRef.current.has(id);

      if (!shouldFetch) return;

      fetchedRef.current.add(id);

      shopStore
        .runABC({
          executionMode: 'BACKEND',
          simulationType: 'classic',
          shopId: id,
        })
        .catch((err) => {
          errorRef.current = slice?.abc?.error ?? err;
        });
    });
  }, [armed, slices, shopStore]);

  // Show toast
  useApiErrorToast(errorRef.current, 'Autogen Shop');

  // Build availability
  const perLibrary = slices.map(({ lib, slice, lifecycle }) => {
    const abcLoading = slice?.abc?.loading ?? false;
    const abcError = slice?.abc?.error;
    return {
      lib,
      lifecycle,
      unavailable: armed && (lifecycle === 'FAILED' || !!abcError),
      available: armed && lifecycle === 'READY',
      loading: abcLoading,
    };
  });

  return {
    unavailable: perLibrary.some((r) => r.unavailable),
    checking: armed && perLibrary.some((r) => r.loading),
    perLibrary,
  };
}
