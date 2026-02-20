import { useSimulationStore } from "@/store/simulations/useSimulationStore";
import { useState, useEffect } from "react";
import { useAbcSimulator } from "./useAbcSimulator";

/**
 * Hydrates the ABC simulator with the last persisted simulation
 * for the given shopId and optional productName.
 */
export function useHydratedAbcSimulator(shopId: string, shopName: string) {
  const simulator = useAbcSimulator(shopId, shopName);
  const abcSimulations = useSimulationStore((s) => s.abcSimulations);

  const [lastSimulatedProduct, setLastSimulatedProduct] = useState<string | null>(null);

  useEffect(() => {
    const shopSims = abcSimulations[shopId];
    if (!shopSims) return;

    const entries = Object.entries(shopSims);
    if (entries.length === 0) return;

    // Find the latest simulation by createdAt
    const [latestProduct, latestSim] = entries
      .sort(
        ([, a], [, b]) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];

    setLastSimulatedProduct(latestProduct);

    // Hydrate the simulator state without calling the API
    if (!simulator.response && !simulator.lastRequest) {
      simulator.lastRequest = latestSim.request;
      simulator.response = latestSim.response;
    }
  }, [shopId, abcSimulations, simulator]);

  return { simulator, lastSimulatedProduct };
}
