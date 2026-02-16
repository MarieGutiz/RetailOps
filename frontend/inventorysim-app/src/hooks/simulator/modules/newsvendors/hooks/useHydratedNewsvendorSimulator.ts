
import { useSimulationStore } from "@/store/simulations/useSimulationStore";
import { useState, useEffect } from "react";
import { useNewsvendorSimulator } from "./useNewsvendorSimulator";

/**
 * Hook that returns a simulator hydrated with previous simulation results if they exist.
 * Also exposes the last simulated product name.
 */

export function useHydratedNewsvendorSimulator(shopId: string, shopName: string) {
  const simulator = useNewsvendorSimulator(shopId, shopName);
  const newsvendorSimulations = useSimulationStore((s) => s.newsvendorSimulations);

  const [lastSimulatedProduct, setLastSimulatedProduct] = useState<string | null>(null);

  useEffect(() => {
    const shopSims = newsvendorSimulations[shopId];
    if (!shopSims) return;

    // Find the most recent simulation (by createdAt)
    const entries = Object.entries(shopSims);
    if (entries.length === 0) return;

    // Sort by createdAt descending
    const [latestProduct, latestSim] = entries
      .sort(([, a], [, b]) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    setLastSimulatedProduct(latestProduct);

    // Hydrate the simulator state without re-running if already hydrated
    if (!simulator.response && !simulator.lastRequest) {
      // Instead of running the API again, directly hydrate local state
      simulator.lastRequest = latestSim.request;
      simulator.response = latestSim.response;
      // Optionally fetch markers/pdf if needed, or leave null
    }
  }, [shopId, newsvendorSimulations, simulator]);

  return { simulator, lastSimulatedProduct };
}