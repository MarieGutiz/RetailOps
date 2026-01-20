
import { runFrontendABC, runShopABC } from "@/hooks/simulator/engines/frontendABC";
import type { ABCData, ABCSummary, ABCTableRow } from "@/types/abc";
import type { AbcResponseDto } from "@/types/abc-backend";
import type { Product } from "@/types/products";
import { type ShopType, type InventoryState, type AnalyticsState, type ShopABCState, type RunABCOptions, type ABCComputationSource, type ShopId, shopId } from "@/types/shop";
import type { SimulatorABCOutput, SimulatorABCResult } from "@/types/simulator";
import { extractBackendABC } from "@/utils/abc/extractBackendABC";
import { saveToStorage } from "@/utils/storage";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import {persist, createJSONStorage} from "zustand/middleware"

type ShopStore = {
  shop: ShopId;

  shops: Record<
    ShopId,
    {
      products: Product[];
      inventory?: InventoryState;
      analytics?: AnalyticsState;
    }
  >;


  products: Product[];
  inventory?: InventoryState;
  analytics?: AnalyticsState;

  abc: ShopABCState;
  hydratedByShop: Partial<Record<ShopId, boolean>>;

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
       setShop: (shop) =>
        set({
          shop,
          abc: { loading: false },
        }),


      //Import - prdcs, inventory, analytics
      setProducts: (products) =>
        set((state) => ({
          shops: {
            ...state.shops,
            [state.shop]: {
              ...state.shops[state.shop],
              products,
            },
          },
        })),

      setInventory: (inventory) =>
        set((state) => ({
          shops: {
            ...state.shops,
            [state.shop]: {
              ...state.shops[state.shop],
              inventory,
            },
          },
        })),

      setAnalytics: (analytics) =>
        set((state) => ({
          shops: {
            ...state.shops,
            [state.shop]: {
              ...state.shops[state.shop],
              analytics,
            },
          },
        })),

      resetABC: () =>
        
        set({
          abc: {
            loading: false,
            error: undefined,
            table: undefined,
            summary: undefined,
            executionMode: undefined,
            mode: undefined,
          },
        }),

        resetShop: () =>
          set({
            products: [],
            inventory: undefined,
            analytics: undefined,
            abc: { loading: false },
          }),

      // --- main ABC runner ---      
      runABC: async ({
        executionMode,
        simulationType,
        scenario = "Baseline",
      }: RunABCOptions) => {

        const { shop, hydratedByShop } = get();

          if (
            executionMode === "BACKEND" &&
            hydratedByShop[shop]
          ) {
            return;
          }
        
        const storeExecutionMode: ABCComputationSource =
          executionMode === "FRONTEND" ? "FRONTEND" : "BACKEND";

        set({
          abc: {
            loading: true,
            error: undefined,
            executionMode: storeExecutionMode,
            mode: simulationType,
          },
        });

        try {
          let output: SimulatorABCOutput;

          /* ───────────────── FRONTEND ABC ───────────────── */
          if (executionMode === "FRONTEND") {
            const { products, inventory } = get();
            if (!inventory) {
              throw new Error("Inventory data missing for frontend ABC");
            }

            const abcData: ABCData[] = products.map((p) => {
              const key = p.id ?? p.sku ?? p.name;
              if (!key) {
                throw new Error(
                  `Product missing identifiers: ${JSON.stringify(p)}`
                );
              }

              return {
                product: { ...p, source: p.source ?? "LOCAL" },
                quantity: inventory.quantities[key] ?? 0,
              };
            });

            output = runFrontendABC(abcData, scenario);
          }

          /* ───────────────── BACKEND ABC ───────────────── */
          else {
            if (!simulationType) {
              throw new Error("Backend simulation type required");
            }

            const { shop } = get();
            output = await runShopABC(shop, simulationType);

            //Check
            if ("items" in output.result) {
              const { products, inventory, analytics } =
                extractBackendABC(output.result as AbcResponseDto);

              set((state) => ({
                shops: {
                  ...state.shops,
                  [state.shop]: {
                    products,
                    inventory,
                    analytics,
                  },
                },
                hydratedByShop: {
                  ...state.hydratedByShop,
                  [state.shop]: true,
                },
              }));
            }
          }

          /* ───────────────── COMMON ABC STATE ───────────────── */

          const sortedTable = sortABCTable(output.table);
          const normalizedSummary = normalizeSummary(output.result);

          set({
            abc: {
              loading: false,
              table: sortedTable,
              summary: normalizedSummary,
              executionMode: storeExecutionMode,
              mode: simulationType,
            },
          });
        } catch (err) {
          set({
            abc: {
              loading: false,
              error:
                err instanceof Error ? err.message : "ABC execution failed",
            },
          });
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

