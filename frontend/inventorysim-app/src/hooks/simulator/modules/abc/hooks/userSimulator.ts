// src/hooks/useSimulator.ts
import type { Product } from "@/types/products";
import type { SimulatorABCOutput } from "@/types/simulator";
import { ABC_SCENARIOS } from "@/lib/abc/buildABCTableData";
import { useUserStore } from "@/store/user/useUserStore";
import { resolveABCMode, resolveBackendMode } from "@/hooks/simulator/engines/types/resolveABCMode";
import { runFrontendABC } from "@/hooks/simulator/engines/frontendABC";
import { runFloristABC } from "@/hooks/simulator/engines/floristABC";
import { runBackendABC } from "@/hooks/simulator/engines/backendABC";
import { useFeatureFlags } from "./useFeatureFlags";

export function useSimulator() {
  const { user } = useUserStore();
  const { advancedABC } = useFeatureFlags();

  async function runABC(
    products: Product[],
    scenario: keyof typeof ABC_SCENARIOS
  ): Promise<SimulatorABCOutput> {

    const executionMode = resolveABCMode(user.userType, scenario);

    switch (executionMode) {
      case "FRONTEND":
        return runFrontendABC(products, scenario);

      case "BACKEND": {
        const backendMode = resolveBackendMode(
          executionMode,
          { advanced: advancedABC }
        );
        return runBackendABC(products, user, backendMode);
      }

      case "BACKEND_PUBLIC": {
        const backendMode = resolveBackendMode(
          executionMode,
          { advanced: advancedABC }
        );
        return runFloristABC(backendMode);
      }
    }
  }

  return { runABC };
}


