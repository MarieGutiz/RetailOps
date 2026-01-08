// src/hooks/useSimulator.ts
import { analyzeABC } from "@/services/api/abc.api";
import { runABCAnalysis } from "@/services/sim/segmentation/runABCAnalysis";
import type { ABCData, AbcItemDto, AbcRequestDto, ABCResult } from "@/types/abc";
import type { Product } from "@/types/products";
import type { SimulatorABCOutput } from "@/types/simulator";
import { buildABCTableData } from "@/lib/abc/buildABCTableData";
import { useUserStore } from "@/store/user/useUserStore";

export function useSimulator() {
  const { user } = useUserStore();

  /**
   * Runs ABC simulation — locally for guests, via backend for registered users.
   */
  async function runSimulation(products: Product[]): Promise<ABCResult | ABCResult[]> {
    if (!products.length) {
      throw new Error("No products provided for simulation.");
    }

    //Guest users → local (frontend) ABC calculation
    if (user.userType === "Guest") {
      const abcData: ABCData[] = products.map((p) => ({
        product: p,
        quantity: (p as any).quantity ?? 1,
      }));

      return runABCAnalysis(abcData);
    }

    //Registered users → backend API call
    const items: AbcItemDto[] = products.map((p) => ({
      productName: p.name,
      salesValue: p.unitPrice * ((p as any).quantity ?? 1),
      demandFrequency: (p as any).quantity ?? 1, // keep it number for DTO compatibility
    }));

    const dto: AbcRequestDto = {
      items,
      username: user.username ?? "Guest",
      mode: "classic",
    };

    const res = await analyzeABC(dto);
    return res;
  }

  /**
   * Runs ABC simulation and prepares UI-friendly data
   */
  async function runABCSimulationForUI(
    products: Product[]
  ): Promise<SimulatorABCOutput> {

    // Guest users
    if (user.userType === "Guest") {
      const abcData = products.map((p) => ({
        product: p,
        quantity: (p as any).quantity ?? 1,
      }));

      const result = runABCAnalysis(abcData);
      const table = buildABCTableData(abcData);

      return { result, table };
    }

    // Registered users
    const rawResult = await runSimulation(products);

    // Backend may return different shape, so table is optional/future-proof
    return {
      result: rawResult as ABCResult,
      table: [],
    };
  }

  return { runSimulation , runABCSimulationForUI};
}
