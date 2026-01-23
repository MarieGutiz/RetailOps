import api from "@/services/api/api";
import type { Product } from "@/types/products";
import { saveToStorage } from "@/utils/storage";
import toast from "react-hot-toast";
import { create } from "zustand";
import {persist, createJSONStorage} from "zustand/middleware"
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { isTokenValid } from "@/utils/auth";


export type UserShopMeta = {
  id: string;
  name: string;
  createdAt: number;
  lastUpdated: number;
  lastSavedAt: number;
};


interface ProductState {
  shopMeta: UserShopMeta;//metadata about the shop

  products: Product[];
  loading: boolean;

  // Product actions
  addProduct: (product: Product) => void;
  removeProduct: (name: string) => void;
  clearProducts: () => void;
  syncToBackend: () => Promise<void>;

  // Auth awareness (kept intentionally)
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  initAuth: () => void;

   // Shop metadata
  initForShop: (shop: { id: string; name: string }) => void
  renameShop: (name: string) => void;
  markSaved: () => void;

  // Loading
  setLoading: (value: boolean) => void;
}
/**
 * Zustand store for managing product state and authentication status
 */
export const useProductStore = create<ProductState>()(
    persist(
         (set, get) => ({
          shopMeta: {
            id: "USER_SHOP",
            name: "My Shop",
            createdAt: Date.now(),
            lastUpdated: Date.now(),
            lastSavedAt: Date.now(),
          },
          products: [],
          isAuthenticated: false,
          loading: false,

    setLoading: (value: boolean) => {
        set({ loading: value });
    },

     initAuth: () => {
        const token = saveToStorage.getItem("token");
        set({ isAuthenticated: isTokenValid(token) });
      },

    addProduct: (product: Product) => {
        const { products, isAuthenticated, shopMeta } = get();

         // Limit guest users to 10 products
        if (!isAuthenticated && products.length >= 10) {
          // alert("Guest users can only add up to 10 products.");

          toast.error(`Guest users can only add up to 10 products.\n
             You can get register to have full experience`)
          return;
        }

        // Add or replace product
        const updated = [
          ...products.filter((p) => p.name !== product.name),
          product,
        ];
        set({ products: updated,
          shopMeta: {
            ...shopMeta,
            lastUpdated: Date.now(),
          },

         });
    },

    removeProduct: (name: string) => {
      const { shopMeta } = get();

        set((state) => ({
            products: state.products.filter((product) => product.name !== name),
            shopMeta: {
            ...shopMeta,
            lastUpdated: Date.now(),
          },

        }));
    },

    clearProducts: () => {
      const { shopMeta } = get();
        set({ products: [],
          shopMeta: {
            ...shopMeta,
            lastUpdated: Date.now(),
          },
         });
    },
     // Shop metadata
     initForShop: (shop) => {
        const now = Date.now()

        set({
          shopMeta: {
            id: shop.id,
            name: shop.name,
            createdAt: now,
            lastUpdated: now,
            lastSavedAt: now,
          },
          products: [],
        })
      },

      renameShop: (name: string) => {
        set({
          shopMeta: {
            ...get().shopMeta,
            name,
            lastUpdated: Date.now(),
          },
        });
      },
      markSaved: () => {
        const { shopMeta } = get();
        set({
          shopMeta: {
            ...shopMeta,
            lastSavedAt: Date.now(),
          },
        });
      },

    
    syncToBackend: async () => {
        const { products, isAuthenticated } = get();
        if (!isAuthenticated || products.length === 0) return;

        try {
          await api.post("/products/bulk", products);//test end point
          get().markSaved();

          console.log("Products synced to backend");
        } catch (err) {
          console.error("Failed to sync:", err);
        }
    },
    setAuthenticated: (value: boolean) => {
        set({ isAuthenticated: value });
    },
}),
  {
    name: "product-storage", // key for localStorage
    storage: createJSONStorage(() => ({
    getItem: saveToStorage.getItem,
    setItem: saveToStorage.setItem,
    removeItem: saveToStorage.removeItem,
    })),
    }
    )
);

if (import.meta.env.MODE === "development") {
  mountStoreDevtool("ProductStore", useProductStore);
}