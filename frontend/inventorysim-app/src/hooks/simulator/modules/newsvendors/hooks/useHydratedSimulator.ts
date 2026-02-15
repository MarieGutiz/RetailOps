import { useSimulator } from "@/hooks/simulator/userSimulator";
import { useSimulationStore } from "@/store/simulations/useSimulationStore";
import { useState, useEffect } from "react";

/**
 * Hook that returns a simulator hydrated with previous simulation results if they exist.
 * Also exposes the last simulated product name.
 */
export function useHydratedSimulator(shopId: string, shopName: string) {
  const simulator = useSimulator(shopId, shopName);
  const newsvendorSimulations = useSimulationStore((s) => s.newsvendorSimulations);

  const [lastSimulatedProduct, setLastSimulatedProduct] = useState<string | null>(null);

  useEffect(() => {
    // Try to find the last simulated product for this shop
    const shopSims = newsvendorSimulations[shopId];
    if (shopSims) {
      const lastProduct = Object.keys(shopSims).pop(); // pick the most recent key
      if (lastProduct) {
        const lastSim = shopSims[lastProduct];
        setLastSimulatedProduct(lastProduct);

        // Hydrate the simulator without re-running
        if (!simulator.response && !simulator.lastRequest) {
          simulator.run(lastSim.request).catch(() => {});
        }
      }
    }
  }, [shopId, newsvendorSimulations, simulator]);

  return { simulator, lastSimulatedProduct };
}
