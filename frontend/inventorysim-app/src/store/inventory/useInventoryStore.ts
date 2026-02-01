import { saveToStorage } from "@/utils/storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mountStoreDevtool } from 'simple-zustand-devtools';


type InventoryMeta = {
  shopId: string;        // ownership, not display
  lastUpdated: number;   // local edits
  lastSavedAt: number;   // backend sync
};


export interface InventoryItem {
  productId: string;
  quantity: number;
}

interface InventoryStore {
  //Associated shop metadata
  shopMeta: InventoryMeta | null;
  initInventoryForShop: (shopId: string) => void  

  inventory: InventoryItem[];
  loading: boolean;

  addToInventory: (productId: string, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromInventory: (productId: string) => void;
  clearInventory: () => void;
  setLoading: (loading: boolean) => void;

  isDirty: () => boolean
  markSaved: () => void;

  isProductInInventory: (productId: string) => boolean
  //By Shop
  clearInventoryByShop: (shopId: string)=> void;
  inventoryByShopId: (shopId:string) => InventoryItem[]

}

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      inventory: [],
      loading: false,
      shopMeta: null,


      setLoading: (loading) => set({ loading }),

      // initInventoryForShop: (shopId) => {
      //   const now = Date.now()

      //   set({
      //     shopMeta: {
      //       shopId,
      //       lastUpdated: now,
      //       lastSavedAt: now,
      //     },
      //     inventory: [],
      //   })
      // },
      initInventoryForShop: (shopId) => {
        const { shopMeta } = get();

        // same shop → do nothing
        if (shopMeta?.shopId === shopId) return;

        const now = Date.now();

        set({
          shopMeta: {
            shopId,
            lastUpdated: now,
            lastSavedAt: now,
          },
          inventory: [],
        });
      },


      addToInventory: (productId, quantity) =>
        set((state) => {
          if (!state.shopMeta) {
          if (import.meta.env.MODE === "development") {
            console.warn("Inventory mutation without initialized shop")
          }
          return state
        }

         if (quantity <= 0) return state

          const now = Date.now()

          const existing = state.inventory.find(
            (item) => item.productId === productId
          )

          const inventory = existing
            ? state.inventory.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            : [...state.inventory, { productId, quantity }]

          return {
            inventory,
            shopMeta: {
              ...state.shopMeta,
              lastUpdated: now,
            },
          }
        }),

       inventoryByShopId: (shopId: string) => {
        const { shopMeta, inventory } = get();
        if (!shopMeta || shopMeta.shopId !== shopId) return [];
        return inventory;
      },

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (!state.shopMeta) {
          if (import.meta.env.MODE === "development") {
            console.warn("Inventory mutation without initialized shop")
          }
          return state
        }

          const now = Date.now()

          return {
            inventory: state.inventory.map((item) =>
              item.productId === productId
                ? { ...item, quantity }
                : item
            ),
            shopMeta: {
              ...state.shopMeta,
              lastUpdated: now,
            },
          }
        }),


      removeFromInventory: (productId) =>
        set((state) => {
          if (!state.shopMeta) {
          if (import.meta.env.MODE === "development") {
            console.warn("Inventory mutation without initialized shop")
          }
          return state
        }


          const now = Date.now()
          return {
            inventory: state.inventory.filter(
              (item) => item.productId !== productId
            ),
            shopMeta: {
              ...state.shopMeta,
              lastUpdated: now,
            },
          }
        }),

      clearInventory: () =>
        set((state) => {
          if (!state.shopMeta) return state // guard

          const now = Date.now()
          return {
            inventory: [],
            shopMeta: {
              ...state.shopMeta,
              lastUpdated: now,
            },
          }
        }),


      markSaved: () => {
        const { shopMeta } = get()
        if (!shopMeta) return
        set({
          shopMeta: {
            ...shopMeta,
            lastSavedAt: Date.now(),
          },
        })
      },

      isDirty: () => {
        const { shopMeta } = get()
        if (!shopMeta) return false
        return shopMeta.lastUpdated > shopMeta.lastSavedAt
        },

        clearInventoryByShop: (shopId: string) => {
          const { shopMeta } = get();
          if (!shopMeta || shopMeta.shopId !== shopId) return;

          set({ inventory: [], shopMeta: null });
        },


      isProductInInventory: (productId) => {
      const { inventory, shopMeta } = get()

      if (!shopMeta) return false

      return inventory.some(
        (item) => item.productId === productId
      )
      },
      
      }),      
    
    {
      name: "inventory-store",
      storage: createJSONStorage(() => ({
        getItem: saveToStorage.getItem,
        setItem: saveToStorage.setItem,
        removeItem: saveToStorage.removeItem,
        })),
      // exclude loading from persistence
      partialize: (state) => ({
        inventory: state.inventory,
        shopMeta: state.shopMeta,
      }),

    }
    
  )
  
);


// Devtools
if (import.meta.env.MODE === "development") {
  mountStoreDevtool('Inventory Store', useInventoryStore);
}