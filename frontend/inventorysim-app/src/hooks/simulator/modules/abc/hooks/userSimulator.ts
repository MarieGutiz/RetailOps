// src/hooks/useSimulator.ts
import type { Product } from "@/types/products";
import type { SimulatorABCOutput } from "@/types/simulator";
import { ABC_SCENARIOS } from "@/lib/abc/buildABCTableData";
import { useUserStore } from "@/store/user/useUserStore";
import { resolveABCMode, resolveBackendMode } from "@/hooks/simulator/engines/types/resolveABCMode";
import { runBackendABC } from "@/hooks/simulator/engines/backendABC";
import { useFeatureFlags } from "./useFeatureFlags";
import {  runShopABC } from "@/hooks/simulator/engines/frontendABC";
import { useShopStore } from "@/store/shop/useShopStore";
import { toast } from "sonner";

export function useSimulator() {
  // const { user } = useUserStore();
  // const { advancedABC } = useFeatureFlags();
  // const { shop } = useShopStore(); // shop-aware now

  // async function runABC(
  //   products: Product[],
  //   scenario: keyof typeof ABC_SCENARIOS
  // ): Promise<SimulatorABCOutput> {

  //   const executionMode = resolveABCMode(user.userType, scenario);

  //   switch (executionMode) {
  //     //Use with small samples
  //     case "FRONTEND":{
  //         // return runFrontendABC(products, scenario);
  //        console.log("run")
  //     }
  //     // Send samples to server to be process
  //     case "BACKEND": {
  //       const backendMode = resolveBackendMode(
  //         executionMode,
  //         { advanced: advancedABC }
  //       );

  //       return runBackendABC(products, user, backendMode);
  //     }
  //     //Placeholder shops
  //     case "BACKEND_PUBLIC": {
  //       const backendMode = resolveBackendMode(
  //         executionMode,
  //         { advanced: advancedABC }
  //       );
  //       if (!shop) {
  //         toast.error("Shop information is missing. Please select a shop to run the ABC analysis.");
  //         throw new Error("Shop information is required for BACKEND_PUBLIC mode");
  //       }
  //       return runShopABC(shop.name, backendMode);
  //     }

  //     default:
  //       throw new Error("Unsupported ABC execution mode");
  //   }
  // }

  // return { runABC };
}




