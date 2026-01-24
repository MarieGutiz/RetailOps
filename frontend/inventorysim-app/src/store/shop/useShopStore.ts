
import { runFrontendABC, runShopABC } from "@/hooks/simulator/engines/frontendABC";
import type { ABCData, ABCSummary, ABCTableRow } from "@/types/abc";
import type { AbcResponseDto } from "@/types/abc-backend";
import type { Product } from "@/types/products";
import { type InventoryState, type AnalyticsState, type ShopABCState, type RunABCOptions, type ShopId, shopId } from "@/types/shop";
import type { SimulatorABCOutput, SimulatorABCResult } from "@/types/simulator";
import { extractBackendABC } from "@/utils/abc/extractBackendABC";
import { saveToStorage } from "@/utils/storage";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import {persist, createJSONStorage} from "zustand/middleware"
import { useInventoryStore } from "../inventory/useInventoryStore";
import { useProductStore } from "../inventory/useProductStore";

//Name your shop
type CreateShopInput = {
  name: string;
};


export type ShopSlice = {
  products: Product[]
  inventory?: InventoryState
  analytics?: AnalyticsState
  abc: ShopABCState
  hydrated: boolean
}

export interface ShopMeta {
  id: ShopId;
  name: string;
  createdAt?: number;
  lastUpdated?: number;
  lastSavedAt?: number;
}
export type ShopStore = {
  shop: ShopMeta | null;        // current shop metadata
  
  shops: Record<ShopId, ShopSlice>


  products: Product[];
  inventory?: InventoryState;
  analytics?: AnalyticsState;

  setShop: (shopMeta: ShopMeta) => void;
  createShop: (input: CreateShopInput) => ShopMeta;


  setProducts: (products: Product[]) => void;
  setInventory: (inventory: InventoryState) => void;
  setAnalytics: (analytics: AnalyticsState) => void;

  runABC: (opts: RunABCOptions) => Promise<void>;
  resetABC: () => void;
  resetShop: () => void;
};

export const useShopStore = create<ShopStore>()(
  persist(
    (set, get) => ({
      shop: null,   // start null, user must select
      shops: {},

      products: [],
      inventory: undefined,
      analytics: undefined,

      hydratedByShop: {},

      abc: { loading: false },

      // --- setters ---
        /* ───────────── SHOP SWITCH ───────────── */
       // --- Switch shop ---
      setShop: (shopMeta: ShopMeta) =>
        set((state) => ({
          shop: shopMeta,
          shops: {
            ...state.shops,
            [shopMeta.id]: state.shops[shopMeta.id] ?? emptyShopSlice(shopMeta),
          },
        })),

      // --- Create user shop ---
      createShop: ({ name }): ShopMeta => {
        const id = shopId(name.toUpperCase().replace(/\s+/g, "_"));
        const newShop: ShopMeta = {
          id,
          name,
          createdAt: Date.now(),
          lastUpdated: Date.now(),
          lastSavedAt: Date.now(),
        };

        set((state) => {
          if (state.shops[id]) return state; // avoid duplicates
          return {
            shops: {
              ...state.shops,
              [id]: emptyShopSlice(newShop),
            },
            shop: newShop,
          };
        });

        // Reset dependent stores
        useProductStore.getState().initForShop(newShop);
        useInventoryStore.getState().initInventoryForShop(id);

        return newShop;
      },
  


      //Import - prdcs, inventory, analytics
       /* ───────────── SETTERS (SCOPED) ───────────── */
       setProducts: (products) => {
        const shopId = get().shop?.id;
        if (!shopId) return;
        set((state) => ({
          shops: {
            ...state.shops,
            [shopId]: {
              ...(state.shops[shopId] ?? emptyShopSlice()),
              products,
            },
          },
        }));
      },

      setInventory: (inventory) => {
        const shopId = get().shop?.id;
        if (!shopId) return;
        set((state) => ({
          shops: {
            ...state.shops,
            [shopId]: {
              ...(state.shops[shopId] ?? emptyShopSlice()),
              inventory,
            },
          },
        }));
      },

      setAnalytics: (analytics) => {
        const shopId = get().shop?.id;
        if (!shopId) return;
        set((state) => ({
          shops: {
            ...state.shops,
            [shopId]: {
              ...(state.shops[shopId] ?? emptyShopSlice()),
              analytics,
            },
          },
        }));
      },

      /* ───────────── RESETTERS ───────────── */
      resetABC: () => {
        const shopId = get().shop?.id;
        if (!shopId) return;
        set((state) => ({
          shops: {
            ...state.shops,
            [shopId]: {
              ...(state.shops[shopId] ?? emptyShopSlice()),
              abc: { loading: false },
            },
          },
        }));
      },

      resetShop: () => {
        const shopId = get().shop?.id;
        if (!shopId) return;
        set((state) => ({
          shops: {
            ...state.shops,
            [shopId]: emptyShopSlice(get().shop!),
          },
        }));
      },

      // --- main ABC runner ---      
      runABC: async ({
        executionMode,
        simulationType,
        scenario = "Baseline",
      }: RunABCOptions) => {

        const shopMeta = get().shop;
        if (!shopMeta) return;
        const shopId = shopMeta.id;
        const current = get().shops[shopId] ?? emptyShopSlice(shopMeta);

        if (executionMode === "BACKEND" && current.hydrated) return

         set((state) => ({
          shops: {
            ...state.shops,
            [shopId]: {
              ...current,
              abc: { loading: true, executionMode, mode: simulationType },
            },
          },
        }));


        try {
          let output: SimulatorABCOutput;

          /* ───────────────── FRONTEND ABC ───────────────── */
          if (executionMode === "FRONTEND") {
            if (!current.inventory) {
              throw new Error("Inventory missing for frontend ABC")
            }

            const abcData: ABCData[] = current.products.map((p) => ({
              product: { ...p, source: p.source ?? "LOCAL" },
              quantity:
                current.inventory!.quantities[p.id ?? p.sku ?? p.name!] ?? 0,
            }))

            output = runFrontendABC(abcData, scenario)
          }

          /* ───────────────── BACKEND ABC ───────────────── */
          else {
            if (!simulationType) {
              throw new Error("Backend simulation type required");
            }

            output = await runShopABC(shopId, simulationType)

            if ("items" in output.result) {
              const { products, inventory, analytics } =
                extractBackendABC(output.result as AbcResponseDto)

              set((state) => ({
                shops: {
                  ...state.shops,
                  [shopId]: {
                    ...current,
                    products,
                    inventory,
                    analytics,
                    hydrated: true,
                  },
                },
              }))
            }
          }

          set((state) => ({
            shops: {
              ...state.shops,
              [shopId]: {
                ...state.shops[shopId],
                abc: {
                  loading: false,
                  table: sortABCTable(output.table),
                  summary: normalizeSummary(output.result),
                  executionMode,
                  mode: simulationType,
                },
              },
            },
          }))
        } catch (err) {
          set((state) => ({
            shops: {
              ...state.shops,
              [shopId]: {
                ...current,
                hydrated: false, // prevent retry
                abc: {
                  loading: false,
                  error:
                    err instanceof Error
                      ? err.message
                      : "ABC execution failed",
                },
              },
            },
          }))
        }
    },

        }),
        {
          name: "shop-storage", // localStorage key
          storage: createJSONStorage(() => ({
            getItem: (name) => saveToStorage.getItem(name),
            setItem: (name, value) => saveToStorage.setItem(name, value),
            removeItem: (name) => saveToStorage.removeItem(name),
          })),

          // --- Persist only stable state ---
          partialize: (state) => ({
            shop: state.shop,
            shops: Object.fromEntries(
              Object.entries(state.shops).map(([id, shop]) => [
                id,
                {
                  products: shop.products,
                  inventory: shop.inventory,
                  analytics: shop.analytics,
                  hydrated: shop.hydrated,
                  // persist only table/summary if you want, not error/loading
                  abc: {
                    table: shop.abc.table,
                    summary: shop.abc.summary,
                  },
                },
              ])
            ),
          }),
        }
      )
    );

//


if (import.meta.env.MODE === "development") {
  mountStoreDevtool("ShopStore", useShopStore);
}

//Helper function
function sortABCTable(table: ABCTableRow[]): ABCTableRow[] {
  return [...table].sort((a, b) => b.totalValue - a.totalValue);
}

//Normalize the summary

function normalizeSummary(result: SimulatorABCResult): ABCSummary | undefined {
  if (!result?.summary) return undefined;

  // Frontend ABCResult
  if ("categoryA" in result) {
    const totalValue = result.summary.totalValue ?? 0;
    return {
      totalValue,
      A: { count: result.categoryA.length, valuePct: (totalValue ? (result.categoryA.reduce((sum, p) => sum + (p.unitPrice ?? 0), 0) / totalValue) * 100 : 0) },
      B: { count: result.categoryB.length, valuePct: (totalValue ? (result.categoryB.reduce((sum, p) => sum + (p.unitPrice ?? 0), 0) / totalValue) * 100 : 0) },
      C: { count: result.categoryC.length, valuePct: (totalValue ? (result.categoryC.reduce((sum, p) => sum + (p.unitPrice ?? 0), 0) / totalValue) * 100 : 0) },
    };
  }

  // Backend AbcResponseDto
  if ("items" in result) {
    return {
      totalValue: result.summary.totalValue,
      A: { count: result.summary.a.count, valuePct: result.summary.a.valuePct },
      B: { count: result.summary.b.count, valuePct: result.summary.b.valuePct },
      C: { count: result.summary.c.count, valuePct: result.summary.c.valuePct },
    };
  }

  return undefined;
}

//Prevent the "undefined" bug
// Prevent the "undefined" bug
const emptyShopSlice = (shopMeta?: ShopMeta): ShopSlice & { id?: ShopId; label?: string } => ({
  id: shopMeta?.id,
  label: shopMeta?.name,
  products: [],
  inventory: undefined,
  analytics: undefined,
  abc: { loading: false },
  hydrated: false,
});
