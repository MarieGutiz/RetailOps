// src/hooks/useSimulator.ts
import { useUserPolicy } from "@/context/UserPolicyContext";
import { runABCAnalysis } from "@/services/sim/simulatorService";
import type { ABCResult } from "@/types";
import type { Product } from "@/types/products";
import axios from "axios";

export function useSimulator() {
  const { userType } = useUserPolicy();

  async function runSimulation(products: Product[]): Promise<ABCResult> {
    if (userType === "registered") {
      const res = await axios.post<ABCResult>("/api/simulator/abc", products);
      return res.data;
    } else {
      return runABCAnalysis(products);
    }
  }

  return { runSimulation };
}
