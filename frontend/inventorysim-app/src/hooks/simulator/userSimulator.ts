// src/hooks/useSimulator.ts
import { useUserPolicy } from "@/context/UserPolicyContext";
import api from "@/services/api";
import { runABCAnalysis } from "@/services/sim/runABCAnalysis";
import type { ABCData, AbcItemDto, AbcRequestDto, ABCResult } from "@/types/abc";
import type { Product } from "@/types/products";

export function useSimulator() {
  const { userType } = useUserPolicy();

   /**
   * Runs ABC simulation — locally for guests, via backend for registered users.
   */
   async function runSimulation(products: Product[]): Promise<ABCResult | ABCResult[]> {
    //  Guest users → local ABC
    if (userType === "guest") {
      const abcData: ABCData[] = products.map((p) => ({
        product: p,
        quantity: (p as any).quantity ?? 1,
      }));
      return runABCAnalysis(abcData);
    }

    //  Registered users → backend ABC
    const items: AbcItemDto[] = products.map((p) => ({
      productName: p.name,
      salesValue: p.unitPrice * ((p as any).quantity ?? 1),
      demandFrequency: (p as any).quantity ?? 1, // now number
    }));
    let username = "" // <-- obtain from local storage*
    const dto: AbcRequestDto = {
      items,
      username: username ?? "guest",
      mode: "classic",
    };

    const res = await api.post<ABCResult[]>("/api/abc/analyze", dto);
    return res.data;
  }

  return { runSimulation };
}
