
import { runFrontendABC, runShopABC } from "@/hooks/simulator/engines/frontendABC";
import type { ABCData, ABCSummary, ABCTableRow } from "@/types/abc";
import type { AbcResponseDto } from "@/types/abc-backend";
import type { Product } from "@/types/products";
import { type InventoryState, type AnalyticsState, type ShopABCState, type RunABCOptions, type ABCComputationSource, type ShopId, shopId } from "@/types/shop";
import type { SimulatorABCOutput, SimulatorABCResult } from "@/types/simulator";
import { extractBackendABC } from "@/utils/abc/extractBackendABC";
import { saveToStorage } from "@/utils/storage";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import {persist, createJSONStorage} from "zustand/middleware"


export type ShopSlice = {
  products: Product[]
  inventory?: InventoryState
  analytics?: AnalyticsState
  abc: ShopABCState
  hydrated: boolean
}


export type ShopStore = {
  shop: ShopId
  shops: Record<ShopId, ShopSlice>


  products: Product[];
  inventory?: InventoryState;
  analytics?: AnalyticsState;

  setShop: (shop: ShopId) => void;

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
      shop: shopId("FLORIST"),
      shops: {},

      products: [],
      inventory: undefined,
      analytics: undefined,

      hydratedByShop: {},

      abc: { loading: false },

      // --- setters ---
        /* ───────────── SHOP SWITCH ───────────── */
      setShop: (shop) =>
        set((state) => ({
          shop,
          shops: {
            ...state.shops,
            [shop]: state.shops[shop] ?? emptyShopSlice(),
          },
        })),


      //Import - prdcs, inventory, analytics
       /* ───────────── SETTERS (SCOPED) ───────────── */
      setProducts: (products) =>
        set((state) => ({
          shops: {
            ...state.shops,
            [state.shop]: {
              ...(state.shops[state.shop] ?? emptyShopSlice()),
              products,
            },
          },
        })),

      setInventory: (inventory) =>
        set((state) => ({
          shops: {
            ...state.shops,
            [state.shop]: {
              ...(state.shops[state.shop] ?? emptyShopSlice()),
              inventory,
            },
          },
        })),

      setAnalytics: (analytics) =>
        set((state) => ({
          shops: {
            ...state.shops,
            [state.shop]: {
              ...(state.shops[state.shop] ?? emptyShopSlice()),
              analytics,
            },
          },
        })),

      /* ───────────── RESETTERS ───────────── */
      resetABC: () =>
        set((state) => ({
          shops: {
            ...state.shops,
            [state.shop]: {
              ...(state.shops[state.shop] ?? emptyShopSlice()),
              abc: { loading: false },
            },
          },
        })),

      resetShop: () =>
        set((state) => ({
          shops: {
            ...state.shops,
            [state.shop]: emptyShopSlice(),
          },
        })),

      // --- main ABC runner ---      
      runABC: async ({
        executionMode,
        simulationType,
        scenario = "Baseline",
      }: RunABCOptions) => {

        const { shop, shops } = get()
        const current = shops[shop] ?? emptyShopSlice()

        if (executionMode === "BACKEND" && current.hydrated) return

        set((state) => ({
          shops: {
            ...state.shops,
            [shop]: {
              ...current,
              abc: {
                loading: true,
                executionMode,
                mode: simulationType,
              },
            },
          },
        }))

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

            output = await runShopABC(shop, simulationType)

            if ("items" in output.result) {
              const { products, inventory, analytics } =
                extractBackendABC(output.result as AbcResponseDto)

              set((state) => ({
                shops: {
                  ...state.shops,
                  [shop]: {
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
              [shop]: {
                ...state.shops[shop],
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
              [shop]: {
                ...current,
                hydrated: true, // prevent retry
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
const emptyShopSlice = (): ShopSlice => ({
  products: [],
  inventory: undefined,
  analytics: undefined,
  abc: { loading: false },
  hydrated: false,
})
