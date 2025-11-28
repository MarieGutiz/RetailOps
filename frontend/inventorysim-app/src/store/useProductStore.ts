import api from "@/services/api/api";
import type { Product } from "@/types/products";
import { saveToStorage } from "@/utils/storage";
import toast from "react-hot-toast";
import { create } from "zustand";
import {persist, createJSONStorage} from "zustand/middleware"
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { isTokenValid } from "@/utils/auth";


interface ProductState {
  products: Product[];
  isAuthenticated: boolean;
  addProduct: (product: Product) => void;
  removeProduct: (name: string) => void;
  clearProducts: () => void;
  syncToBackend: () => Promise<void>;
  setAuthenticated: (value: boolean) => void;
  initAuth: () => void;
}
/**
 * Zustand store for managing product state and authentication status
 */
export const useProductStore = create<ProductState>()(
    persist(
         (set, get) => ({
    products: [],
    isAuthenticated: false,
     initAuth: () => {
        const token = saveToStorage.getItem("token");
        set({ isAuthenticated: isTokenValid(token) });
      },
    addProduct: (product: Product) => {
        const { products, isAuthenticated } = get();

         // Limit guest users to 10 products
        if (!isAuthenticated && products.length >= 10) {
          alert("Guest users can only add up to 10 products.");
          toast.error(`Guest users can only add up to 10 products.\n
             You can get register to have full experience`)
          return;
        }

        // Add or replace product
        const updated = [
          ...products.filter((p) => p.name !== product.name),
          product,
        ];
        set({ products: updated });
    },
    removeProduct: (name: string) => {
        set((state) => ({
            products: state.products.filter((product) => product.name !== name),
        }));
    },
    clearProducts: () => {
        set({ products: [] });
    },
    syncToBackend: async () => {
        const { products, isAuthenticated } = get();
        if (!isAuthenticated || products.length === 0) return;

        try {
          await api.post("/api/products/bulk", products);//test end point
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