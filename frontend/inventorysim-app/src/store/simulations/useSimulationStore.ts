import {create} from "zustand";
import type { NewsvendorRequest, NewsvendorResponse } from "@/types/newsvendor-backend";
import type { EoqRequest, EoqResponse } from "@/types/eoq-backend";
import { persist, createJSONStorage } from "zustand/middleware";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { saveToStorage } from "@/utils/storage";
import type { AbcRequestDto, AbcResponseDto } from "@/types/abc-backend";

// ─── Simulation Entry Types ───

export interface NewsvendorSimulationEntry {
  request: NewsvendorRequest;
  response: NewsvendorResponse;
  profitCurve?: Record<number, number>;
  createdAt: string;
}

export interface EoqSimulationEntry {
  response: EoqResponse;
  request: EoqRequest;
  createdAt: string;
}

export interface AbcSimulationEntry {
  request: AbcRequestDto;
  response: AbcResponseDto;
  createdAt: string;
}

// ─── Store Interface ───
interface SimulationStore {
  // shopId → productName → simulation
  newsvendorSimulations: Record<string, Record<string, NewsvendorSimulationEntry>>;
  eoqSimulations: Record<string, Record<string, EoqSimulationEntry>>;
  
  // ABC simulations: shopId → simId → simulation
  abcSimulations: Record<string, Record<string, AbcSimulationEntry>>;
  lastAbcSimId: Record<string, string>; // shopId → last simulation ID



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

  // new ABC methods
  addAbcSimulation: (shopId: string,
     simId: string,
     entry: AbcSimulationEntry) => void;

  setLastAbcSimId: (shopId: string, simId: string) => void;

  clearSimulationsForShop: (shopId: string) => void;
  clearSimulationsForProduct: (shopId: string, product: string) => void;
  clearAllSimulations: () => void;
}

export const useSimulationStore = create<SimulationStore>()(
  persist(
    (set) => ({
      newsvendorSimulations: {},
      eoqSimulations: {},
      abcSimulations: {},
      lastAbcSimId: {},


      // ─── Newsvendor ───
      addNewsvendorSimulation: (shopId, product, entry) =>
        set((state) => ({
          newsvendorSimulations: {
            ...state.newsvendorSimulations,
            [shopId]: {
              ...(state.newsvendorSimulations[shopId] ?? {}),
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
              ...(state.eoqSimulations[shopId] ?? {}),
              [product]: entry,
            },
          },
        })),

     // ─── ABC ───
      addAbcSimulation: (shopId, simId, entry) =>
        set((state) => ({
          abcSimulations: {
            ...state.abcSimulations,
            [shopId]: {
              ...(state.abcSimulations[shopId] ?? {}),
              [simId]: entry,
            },
          },
        })),

      setLastAbcSimId: (shopId, simId) =>
        set((state) => ({
          lastAbcSimId: {
            ...state.lastAbcSimId,
            [shopId]: simId,
          },
        })),


      // ─── Clear ───
      clearSimulationsForShop: (shopId) =>
        set((state) => ({
          newsvendorSimulations: { ...state.newsvendorSimulations, [shopId]: {} },
          eoqSimulations: { ...state.eoqSimulations, [shopId]: {} },
          abcSimulations: { ...state.abcSimulations, [shopId]: {} },
        })),

      clearSimulationsForProduct: (shopId, product) =>
        set((state) => {
          const { [product]: _, ...remainingNewsvendor } = state.newsvendorSimulations[shopId] ?? {};
          const { [product]: __, ...remainingEOQ } = state.eoqSimulations[shopId] ?? {};
          const { [product]: ___, ...remainingABC } = state.abcSimulations[shopId] ?? {};

          return {
            newsvendorSimulations: { ...state.newsvendorSimulations, [shopId]: remainingNewsvendor },
            eoqSimulations: { ...state.eoqSimulations, [shopId]: remainingEOQ },
            abcSimulations: { ...state.abcSimulations, [shopId]: remainingABC },
          };
        }),

      clearAllSimulations: () =>
        set(() => ({
          newsvendorSimulations: {},
          eoqSimulations: {},
          abcSimulations: {},
        })),
    }),

    {
      name: "sim-storage", // localStorage key
      storage: createJSONStorage(() => ({
        getItem: saveToStorage.getItem,
        setItem: saveToStorage.setItem,
        removeItem: saveToStorage.removeItem,
      })),
    }
  )
);


//  Devtools (only in development)
if (import.meta.env.MODE === "development") {
  mountStoreDevtool("sim store", useSimulationStore);
}

