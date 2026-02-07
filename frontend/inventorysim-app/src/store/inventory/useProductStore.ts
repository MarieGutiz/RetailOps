import api from "@/services/api/api";
import type { Product } from "@/types/products";
import { saveToStorage } from "@/utils/storage";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { isTokenValid } from "@/utils/auth";


 type UserShopMeta = {
  id: string;
  name: string;
  createdAt: number;
  lastUpdated: number;
  lastSavedAt: number;
  kind: "USER"
};


interface ProductState {
  shopMeta: UserShopMeta | null;//can be null until a shop is created

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
  initSimulationForShop: (shop: { id: string; name: string; products?: Product[] , kind?:string}) => void

  renameShop: (name: string) => void;
  markSaved: () => void;

  // Loading
  setLoading: (value: boolean) => void;
  //By Shop
  
  productsByShopId: (shopId: string) => Product[];
  clearProductsByShop: (shopId: string) => void;

}
/**
 * Zustand store for managing product state and authentication status
 */
export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      shopMeta: null,
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
        if (!shopMeta) {
          toast.error("Please create a shop before adding products.");
          return;
        }

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
        set({
          products: updated,
          shopMeta: {
            ...shopMeta,
            lastUpdated: Date.now(),
          },

        });
      },

      removeProduct: (name: string) => {
        const { shopMeta } = get();
        if (!shopMeta) return;

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
        if (!shopMeta) return;
        set({
          products: [],
          shopMeta: {
            ...shopMeta,
            lastUpdated: Date.now(),
          },
        });
      },
      // Shop metadata
      initForShop: (shop) => {
        // if ((shop as any).kind === "AUTOGEN") {
        //   console.warn("ProductStore cannot be initialized for AUTOGEN shops");
        //   return;
        // } //Not anymore
        const now = Date.now()

        set({
          shopMeta: {
            id: shop.id,
            name: shop.name,
            createdAt: now,
            lastUpdated: now,
            lastSavedAt: now,
            kind: "USER"
          },
          products: [],
        })
      },

       initSimulationForShop: (shop) => {
        const now = Date.now();
        set({
          shopMeta: {
            id: shop.id,
            name: shop.name,
            createdAt: now,
            lastUpdated: now,
            lastSavedAt: now,
            kind: "USER",
          },
          products: shop.products ?? [],
        });
      },

      renameShop: (name: string) => {
        const { shopMeta } = get();
        if (!shopMeta) return;

        set({
          shopMeta: {
            ...shopMeta,
            name,
            lastUpdated: Date.now(),
          },
        });
      },
      markSaved: () => {
        const { shopMeta } = get();
        if (!shopMeta) return;

        set({
          shopMeta: {
            ...shopMeta,
            lastSavedAt: Date.now(),
          },
        });
      },


      clearProductsByShop: (shopId: string) => {
        const { shopMeta } = get();
        if (!shopMeta || shopMeta.id !== shopId) return;

        set({ products: [], shopMeta: null });
      },
      
        productsByShopId: (shopId: string) => {
        const { shopMeta, products } = get();
        if (!shopMeta || shopMeta.id !== shopId) return [];
        return products;
      },
      

      syncToBackend: async () => {
        const { products, isAuthenticated, shopMeta } = get();
        if (!isAuthenticated || products.length === 0 || !shopMeta) return;

        try {
         // await api.post("/products/bulk", products);//test end point
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