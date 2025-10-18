// src/hooks/useSimulator.ts
import { useUserPolicy } from "@/context/UserPolicyContext";
import api from "@/services/api";
import { runABCAnalysis } from "@/services/sim/simulatorService";
import type { ABCResult } from "@/types/sim";
import type { Product } from "@/types/products";

export function useSimulator() {
  const { userType } = useUserPolicy();

  async function runSimulation(products: Product[]): Promise<ABCResult> {
    if (userType === "registered") {
      const res = await api.post<ABCResult>("/api/simulator/abc", products);
      return res.data;
    } else {
      return runABCAnalysis(products);
    }
  }

  return { runSimulation };
}
