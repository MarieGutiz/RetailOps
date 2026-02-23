import { useSimulationStore } from "@/store/simulations/useSimulationStore";
import { useMemo } from "react";

export type SimulationLogEntry =
  | {
      type: "newsvendor";
      shopId: string;
      product: string;
      sku: string;
      createdAt: string;
      data: any;
    }
  | {
      type: "eoq";
      shopId: string;
      product: string;
      sku: string;
      createdAt: string;
      data: any;
    }
  | {
      type: "abc";
      shopId: string;
      simId: string;
      createdAt: string;
      data: any;
    };

export const useSimulationBitacora = (shopId?: string) => {
  const {
    newsvendorSimulations,
    eoqSimulations,
    abcSimulations,
  } = useSimulationStore();

  return useMemo(() => {
    if (!shopId) return [];

    const logs: SimulationLogEntry[] = [];

    // Newsvendor
    const nv = newsvendorSimulations[shopId] ?? {};
    Object.entries(nv).forEach(([sku, entry]) => {
      logs.push({
        type: "newsvendor",
        shopId,
        sku,
        product: entry.request.productName,
        createdAt: entry.createdAt,
        data: entry.response,
      });
    });

    // EOQ
    const eoq = eoqSimulations[shopId] ?? {};
    Object.entries(eoq).forEach(([sku, entry]) => {
      logs.push({
        type: "eoq",
        shopId,
        sku,
        product: entry.request.productName,
        createdAt: entry.createdAt,
        data: entry.response,
      });
    });

    // ABC
    const abc = abcSimulations[shopId] ?? {};
    Object.entries(abc).forEach(([simId, entry]) => {
      logs.push({
        type: "abc",
        shopId,
        simId,
        createdAt: entry.createdAt,
        data: entry.response,
      });
    });

    // Sort newest first
    return logs.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
  }, [shopId, newsvendorSimulations, eoqSimulations, abcSimulations]);
};