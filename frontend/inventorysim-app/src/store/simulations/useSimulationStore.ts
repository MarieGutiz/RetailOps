import {create} from "zustand";
import type { NewsvendorRequest, NewsvendorResponse } from "@/types/newsvendor-backend";
import type { EoqResponse } from "@/types/eoq-backend";
import { persist, createJSONStorage } from "zustand/middleware";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { saveToStorage } from "@/utils/storage";


export interface NewsvendorSimulationEntry {
  request: NewsvendorRequest;
  response: NewsvendorResponse;
  profitCurve?: Record<number, number>;
  createdAt: string;
}

export interface EoqSimulationEntry {
  response: EoqResponse;
  createdAt: string;
}

interface SimulationStore {
  // shopId → productName → simulation
  newsvendorSimulations: Record<string, Record<string, NewsvendorSimulationEntry>>;
  eoqSimulations: Record<string, Record<string, EoqSimulationEntry>>;

  addNewsvendorSimulation: (
    shopId: string,
    product: string,
    entry: NewsvendorSimulationEntry
  ) => void;

  addEOQSimulation: (
    shopId: string,
    product: string,
    entry: EoqSimulationEntry
  ) => void;

  clearSimulationsForShop: (shopId: string) => void;
  clearSimulationsForProduct: (shopId: string, product: string) => void;
  clearAllSimulations: () => void;
}

export const useSimulationStore = create<SimulationStore>()(
  persist(
    (set) => ({
      newsvendorSimulations: {},
      eoqSimulations: {},

      // ─── Newsvendor ───
      addNewsvendorSimulation: (shopId, product, entry) =>
        set((state) => ({
          newsvendorSimulations: {
            ...state.newsvendorSimulations,
            [shopId]: {
              ...state.newsvendorSimulations[shopId],
              [product]: entry,
            },
          },
        })),

      // ─── EOQ ───
      addEOQSimulation: (shopId, product, entry) =>
        set((state) => ({
          eoqSimulations: {
            ...state.eoqSimulations,
            [shopId]: {
              ...state.eoqSimulations[shopId],
              [product]: entry,
            },
          },
        })),

      // ─── Clear ───
      clearSimulationsForShop: (shopId) =>
        set((state) => ({
          newsvendorSimulations: {
            ...state.newsvendorSimulations,
            [shopId]: {},
          },
          eoqSimulations: {
            ...state.eoqSimulations,
            [shopId]: {},
          },
        })),

      clearSimulationsForProduct: (shopId, product) =>
        set((state) => {
          const { [product]: _, ...remainingNewsvendor } =
            state.newsvendorSimulations[shopId] || {};
          const { [product]: __, ...remainingEOQ } =
            state.eoqSimulations[shopId] || {};

          return {
            newsvendorSimulations: {
              ...state.newsvendorSimulations,
              [shopId]: remainingNewsvendor,
            },
            eoqSimulations: {
              ...state.eoqSimulations,
              [shopId]: remainingEOQ,
            },
          };
        }),

      clearAllSimulations: () =>
        set(() => ({
          newsvendorSimulations: {},
          eoqSimulations: {},
        })),
    }),
    {
      name: "sim-storage", // 🔑 localStorage key
      storage: createJSONStorage(() => ({
        getItem: saveToStorage.getItem,
        setItem: saveToStorage.setItem,
        removeItem: saveToStorage.removeItem,
      })),
    }
  )
);


// 🛠 Devtools (only in development)
if (import.meta.env.MODE === "development") {
  mountStoreDevtool("sim store", useSimulationStore);
}

