
import { runFrontendABC, runShopABC } from "@/hooks/simulator/engines/frontendABC";
import type { ABCData, ABCSummary, ABCTableRow } from "@/types/abc";
import type { AbcResponseDto } from "@/types/abc-backend";
import type { Product } from "@/types/products";
import { type InventoryState, type AnalyticsState, type ShopABCState, type RunABCOptions, type ShopId, shopId, type ShopLifecycle, type ShopSlice, type AutogenShopLifecycle, type UserShopLifecycle, type AutogenShopSlice } from "@/types/shop";
import type { SimulatorABCOutput, SimulatorABCResult } from "@/types/simulator";
import { extractBackendABC } from "@/utils/abc/extractBackendABC";
import { saveToStorage } from "@/utils/storage";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"
import { useInventoryStore } from "../inventory/useInventoryStore";
import { useProductStore } from "../inventory/useProductStore";
import { toast } from "sonner";
import { shopSliceToMeta } from "./adapter";

//Name your shop
type CreateShopInput = {
  name: string;
};

// export type ShopSlice = {
//   products: Product[]
//   inventory?: InventoryState
//   analytics?: AnalyticsState
//   abc: ShopABCState
//   hydrated: boolean
//   lifecycle: ShopLifecycle
//   kind: "USER" | "AUTOGEN"
// }
// --- Shop metadata ---
export type UserShopMeta = {
  id: ShopId;
  name: string;
  kind: "USER";
  lifecycle: UserShopLifecycle;
  createdAt: number;
  lastUpdated: number;
  lastSavedAt: number;
};

export type AutogenShopMeta = {
  id: ShopId;
  name: string;
  kind: "AUTOGEN";
  lifecycle: AutogenShopLifecycle;

  createdAt: number;
  lastUpdated: number;
  lastSavedAt: number;
};

export type ShopMeta = UserShopMeta | AutogenShopMeta;

// export interface ShopMeta {
//   id: ShopId;
//   name: string;
//   createdAt?: number;
//   lastUpdated?: number;
//   lastSavedAt?: number;
//   lifecycle: ShopLifecycle;
//   kind: "USER" | "AUTOGEN";
// }
export type ShopStore = {
  shop: ShopMeta | null;        // current shop metadata

  shops: Record<ShopId, ShopSlice>


  products: Product[];
  // inventory?: InventoryState;
  // analytics?: AnalyticsState;

  setShop: (shopMeta: ShopMeta) => void;
  createShop: (input: CreateShopInput) => UserShopMeta;


  setProducts: (products: Product[]) => void;
  setInventory: (inventory: InventoryState) => void;
  setAnalytics: (analytics: AnalyticsState) => void;

  runABC: (opts: RunABCOptions) => Promise<void>;
  resetABC: () => void;
  resetShop: () => void;
  
  // selectShop(id: ShopId | null): void;
  deleteUserShop: (id: ShopId) => void;
  ensureAutogenShop: (id: ShopId, name: string) => void;
  ensureAndSelectAutogenShop: (id: ShopId, label: string) => void;

};
//The store creates ShopMeta.
export const useShopStore = create<ShopStore>()(
  persist(
    (set, get) => ({
      shop: null,   // start null, user must select
      shops: {},

      products: [],
      // inventory: undefined,
      // analytics: undefined,
      // abc: { loading: false },

      // --- setters ---
      /* ───────────── SHOP SWITCH ───────────── */
      // setShop: (shopMeta: ShopMeta) =>
      //   set((state) => {
      //     const existingSlice = state.shops[shopMeta.id];

      //     // AUTOGEN shops are idempotent
      //     if (shopMeta.kind === "AUTOGEN") {
      //       return {
      //         shop: shopMeta,
      //         shops: existingSlice
      //           ? state.shops // already exists → do nothing
      //           : {
      //               ...state.shops,
      //               [shopMeta.id]: emptyShopSlice(shopMeta),
      //             },
      //       };
      //     }

      //     // USER shop: slice must already exist
      //     return {
      //       shop: shopMeta,
      //     };
      //   }
      // ),
      setShop: (shopMeta: ShopMeta) =>
          set((state) => {
          const slice = state.shops[shopMeta.id];

          if (!slice) {
            console.warn("Attempted to select non-existing shop", shopMeta.id);
            return state;
          }

          // Always normalize meta from slice
          const normalized = shopSliceToMeta(shopMeta.id, slice);

          return { shop: normalized };

        }),


      // --- Create user shop ---
      createShop: ({ name }): UserShopMeta => {
        const normalized = name.trim().toUpperCase();
        const id = shopId(normalized.replace(/\s+/g, "_"));

        const exists = Object.values(get().shops).some(
          (s) => s.kind === "USER" && s.label === normalized
        );

        if (exists) {
          throw new Error(`Shop "${name}" already exists`);
        }

        const meta: UserShopMeta = {
          id,
          name: normalized,
          kind: "USER",
          lifecycle: "CREATED",
          createdAt: Date.now(),
          lastUpdated: Date.now(),
          lastSavedAt: Date.now(),
        };

        set((state) => ({
          shop: meta,
          shops: {
            ...state.shops,
            [id]: emptyShopSlice(meta),
          },
        }));

        useProductStore.getState().initForShop(meta);
        useInventoryStore.getState().initInventoryForShop(id);

        return meta;
      },


      //Import - prdcs, inventory, analytics
      /* ───────────── SETTERS (SCOPED) ───────────── */
      setProducts: (products) => {
        const currentShop = get().shop;
        if (!currentShop) return;

        set((state) => {
          const slice = state.shops[currentShop.id] ?? emptyShopSlice(currentShop);

          // Determine new lifecycle
          let newLifecycle = slice.lifecycle

          if (slice.kind === "USER") {
            if (products.length === 0 && slice.products.length > 0) {
              newLifecycle = "CREATED"
            } else if (slice.lifecycle === "CREATED") {
              newLifecycle = "IMPORTING"
            }
          }


          return {
            shops: {
              ...state.shops,
              [currentShop.id]: {
                ...slice,
                products,
                lifecycle: newLifecycle,
              },
            },
          };
        });


      },

      setInventory: (inventory) => {
        const currentShop = get().shop;
        if (!currentShop) return;

        set((state) => {
          const slice = state.shops[currentShop.id] ?? emptyShopSlice(currentShop);

          return {
            shops: {
              ...state.shops,
              [currentShop.id]: {
                ...slice,
                inventory,
                // Advance lifecycle from CREATED → IMPORTING when inventory is added
                lifecycle: slice.lifecycle === "CREATED" ? "IMPORTING" : slice.lifecycle,
              },
            },
          };
        });

      },

      setAnalytics: (analytics) => {
        const currentShop = get().shop;
        if (!currentShop) return;
        set((state) => ({
          shops: {
            ...state.shops,
            [currentShop.id]: {
              ...(state.shops[currentShop.id] ?? emptyShopSlice(currentShop)),
              analytics,
            },
          },
        }));
      },

      /* ───────────── RESETTERS ───────────── */
      resetABC: () => {
        const current = get().shop;
        if (!current) return;
        const slice = get().shops[current.id];
        if (!slice) return;

        set((state) => ({
          shops: {
            ...state.shops,
            [current.id]: { ...slice, abc: { loading: false, table: [], summary: undefined, error: undefined } },
          },
        }));


      },

      resetShop: () => {
        const currentShop = get().shop;
        if (!currentShop) return;

        set((state) => ({
          shops: {
            ...state.shops,
            [currentShop.id]: emptyShopSlice(get().shop!),
          },
        }));
      },

      // deleteShop: (id: ShopId) => {
      //   set((state) => {
      //     const slice = state.shops[id];
      //     if (!slice || slice.kind === "AUTOGEN") return state;

      //     return {
      //       shops: {
      //         ...state.shops,
      //         [id]: {
      //           ...slice,
      //           lifecycle: "DELETED",
      //         },
      //       },
      //       shop: state.shop?.id === id ? null : state.shop,
      //     };
      //   });
      // },

    //   deleteUserShop: (id: ShopId) => {
    //   set((state) => {
    //     const slice = state.shops[id];
    //     if (!slice || slice.kind !== "USER") return state;

    //     const { [id]: _, ...remaining } = state.shops;

    //     return {
    //       shops: remaining,
    //       shop: state.shop?.id === id ? null : state.shop,
    //     };
    //     });

    //     useProductStore.getState().clearProductsByShop(id);
    //     useInventoryStore.getState().clearInventoryByShop(id);

    //    toast.success("Shop deleted");
    // },

      deleteUserShop: (id: ShopId) => {
        set((state) => {
          const slice = state.shops[id];
          if (!slice || slice.kind !== "USER") return state;

          const { [id]: __deleted, ...remaining } = state.shops;

          return {
            shops: remaining,
            shop: state.shop?.id === id ? null : state.shop,
          };
        });

        // Hard cleanup in other stores
        useProductStore.getState().clearProductsByShop(id);
        useInventoryStore.getState().clearInventoryByShop(id);

        toast.success("Shop deleted permanently");
      },



      // --- main ABC runner ---      
      runABC: async ({
        executionMode,
        simulationType,
        shopId: explicitShopId,
        scenario = "Baseline",
      }: RunABCOptions) => {

       const currentShopMeta = explicitShopId
          ? undefined
          : get().shop;

        if (!explicitShopId && !currentShopMeta) return;

        const shopSlice = explicitShopId
          ? get().shops[explicitShopId]
          : get().shops[currentShopMeta!.id]; // safe because we returned above

        if (!shopSlice) return;


        const shopId = explicitShopId ?? currentShopMeta!.id;

        // if (!meta) return;

        // const shopId = meta.id;
        const current = shopSlice;

        if (executionMode === "BACKEND" && current.hydrated) return;

        const importing =
          current.kind === "USER"
            ? ("IMPORTING" as UserShopLifecycle)
            : ("IMPORTING" as AutogenShopLifecycle);


              set((state) => ({
                shops: {
                  ...state.shops,
                  [shopId]: {
                    ...current,
                    lifecycle: importing,
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
                    lifecycle: "READY",
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
                lifecycle: "FAILED", // mark lifecycle as FAILED
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
      
     // --- ENSURE AUTOGEN SHOP EXISTS ---
    ensureAutogenShop: (id: ShopId, label: string) => {
      set((state) => {
        // If shop already exists, do nothing
        if (state.shops[id]) return state;

        // Create a new AUTOGEN slice
        const now = Date.now();

        const newSlice: AutogenShopSlice = {
          kind: "AUTOGEN",
          lifecycle: "CREATED", // always valid CommonLifecycle
          products: [],
          inventory: undefined,
          analytics: undefined,
          abc: { loading: false },
          hydrated: false,
          label, // label is always provided

          createdAt: now,
          lastUpdated: now,
          lastSavedAt: now,

        };

        return {
          shops: {
            ...state.shops,
            [id]: newSlice,
          },
        };
      });
    },

    // --- ENSURE AND SELECT AUTOGEN SHOP ---
    ensureAndSelectAutogenShop: (id: ShopId, label: string) => {
      set((state) => {
        // Ensure shop slice exists
        let slice = state.shops[id] as AutogenShopSlice | undefined;

        const now = Date.now()

        if (!slice) {
          slice = {
            kind: "AUTOGEN",
            lifecycle: "CREATED",
            products: [],
            inventory: undefined,
            analytics: undefined,
            abc: { loading: false },
            hydrated: false,
            label,

            createdAt: now,
            lastUpdated: now,
            lastSavedAt: now,

          };
          state.shops[id] = slice;
        }

        // Set current shop using full ShopMeta
        // Set current shop using full AutogenShopMeta
        state.shop = {
          kind: "AUTOGEN",
          id,
          name: slice.label ?? label,
          lifecycle: slice.lifecycle,
          createdAt: slice.createdAt,
          lastUpdated: slice.lastUpdated,
          lastSavedAt: slice.lastSavedAt,
        };


        return state;
      });
    },




      // ensureAutogenShop: (id: ShopId, label: string) => {
      //   set((state) => {
      //     if (state.shops[id]) return state;

      //     return {
      //       shops: {
      //         ...state.shops,
      //         [id]: {
      //           kind: "AUTOGEN",
      //           lifecycle: "CREATED",
      //           products: [],
      //           inventory: undefined,
      //           analytics: undefined,
      //           abc: { loading: false },
      //           hydrated: false,
      //           label,
      //         },
      //       },
      //     };
      //   });
      // }
      



    }),
    {
      name: "shop-storage", // localStorage key
      storage: createJSONStorage(() => ({
        getItem: (name) => saveToStorage.getItem(name),
        setItem: (name, value) => saveToStorage.setItem(name, value),
        removeItem: (name) => saveToStorage.removeItem(name),
      })),

      // --- Persist only stable state ---
      // partialize: (state) => ({
      //   // shop: state.shop,
      //   // shops: Object.fromEntries(
      //   //   Object.entries(state.shops).map(([id, shop]) => [
      //   //     id,
      //   //     {
      //   //       kind: shop.kind,
      //   //       lifecycle: shop.lifecycle,
      //   //       label: shop.label,
      //   //       products: shop.products,
      //   //       inventory: shop.inventory,
      //   //       analytics: shop.analytics,
      //   //       hydrated: shop.hydrated,
      //   //       abc: {
      //   //         table: shop.abc.table,
      //   //         summary: shop.abc.summary,
      //   //       },
      //   //     },
      //   //   ])
      //   // ),
      //     shop: state.shop?.kind === "USER" ? state.shop : null,
      //     shops: Object.fromEntries(
      //       Object.entries(state.shops).filter(
      //         ([, shop]) => shop.kind === "USER"
      //       )
      //     ),
      // }),
      partialize: (state) => ({
        shop: state.shop,
        shops: Object.fromEntries(
          Object.entries(state.shops).map(([id, shop]) => [
            id,
            {
              kind: shop.kind,
              lifecycle: shop.lifecycle,
              label: shop.label,
              products: shop.products,
              inventory: shop.inventory,
              analytics: shop.analytics,
              hydrated: shop.hydrated,
              autogenHydrated: shop.kind === "AUTOGEN" ? shop.hydrated : undefined,
              abc: shop.abc,
              createdAt: shop.createdAt,
              lastUpdated: shop.lastUpdated,
              lastSavedAt: shop.lastSavedAt,
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
const emptyShopSlice = (meta: ShopMeta): ShopSlice => {

  const now = Date.now()

  if (meta.kind === "USER") {
    return {
      kind: "USER",
      lifecycle: meta.lifecycle,
      products: [],
      inventory: undefined,
      analytics: undefined,
      abc: { loading: false },
      hydrated: false,
      label: meta.name, // automatically use shop name

      createdAt: meta.createdAt ?? now,
      lastUpdated: meta.lastUpdated ?? now,
      lastSavedAt: meta.lastSavedAt ?? now,
    };
  } else {
    return {
      kind: "AUTOGEN",
      lifecycle: meta.lifecycle as AutogenShopLifecycle,
      products: [],
      inventory: undefined,
      analytics: undefined,
      abc: { loading: false },
      hydrated: false,
      label: meta.name, // automatically use shop name

      createdAt: meta.createdAt ?? now,
      lastUpdated: meta.lastUpdated ?? now,
      lastSavedAt: meta.lastSavedAt ?? now,
    };
  }
};

