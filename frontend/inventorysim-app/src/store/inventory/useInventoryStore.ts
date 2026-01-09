import { saveToStorage } from "@/utils/storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface InventoryItem {
  productId: string;
  quantity: number;
}

interface InventoryStore {
  inventory: InventoryItem[];
  loading: boolean;
  addToInventory: (productId: string, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromInventory: (productId: string) => void;
  clearInventory: () => void;
  setLoading: (loading: boolean) => void;
}

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set) => ({
      inventory: [],
      loading: false,

      setLoading: (loading) => set({ loading }),

      addToInventory: (productId, quantity) =>
        set((state) => {
          const existing = state.inventory.find(
            (item) => item.productId === productId
          );

          if (existing) {
            return {
              inventory: state.inventory.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            inventory: [...state.inventory, { productId, quantity }],
          };
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          inventory: state.inventory.map((item) =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          ),
        })),

      removeFromInventory: (productId) =>
        set((state) => ({
          inventory: state.inventory.filter(
            (item) => item.productId !== productId
          ),
        })),
      clearInventory: () => set({ inventory: [] }),
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
      }),

    }
  )
);
