// src/hooks/useSimulator.ts
import { analyzeABC } from "@/services/api/abc.api";
import { useUserPolicy } from "@/context/UserPolicyContext";
import { runABCAnalysis } from "@/services/sim/runABCAnalysis";
import type { ABCData, AbcItemDto, AbcRequestDto, ABCResult } from "@/types/abc";
import type { Product } from "@/types/products";

export function useSimulator() {
  const { userType, username } = useUserPolicy();

  /**
   * Runs ABC simulation — locally for guests, via backend for registered users.
   */
  async function runSimulation(products: Product[]): Promise<ABCResult | ABCResult[]> {
    if (!products.length) {
      throw new Error("No products provided for simulation.");
    }

    //Guest users → local (frontend) ABC calculation
    if (userType === "guest") {
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
      username: username ?? "guest",
      mode: "classic",
    };

    const res = await analyzeABC(dto);
    return res;
  }

  return { runSimulation };
}
