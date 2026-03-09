import { useSimulationStore } from '@/store/simulations/useSimulationStore';
import { useState, useEffect } from 'react';
import { useEoqSimulator } from './useEoqSimulator';

// This hook wraps the EOQ sim with logic to fetch and hydrate the last simulation result for a given
// shop and prdct. It checks the global sim store(simulationStore) for the last EOQ sim result for the 
// shop+product, and if found, it populates the EOQ sim state with that result.
//  This allows users to see their last simulation result immediately when they return to the EOQ sim page,
//  without having to re-run the simulation thus the server is not called.
//  The hook also returns the product name of the last simulated product for display purposes.


export function useHydratedEoqSimulator(shopId: string, shopName: string) {
  const simulator = useEoqSimulator(shopId, shopName);
  const eoqSimulations = useSimulationStore((s) => s.eoqSimulations);

  const [lastSimulatedProduct, setLastSimulatedProduct] = useState<
    string | null
  >(null);

  useEffect(() => {
    const shopSims = eoqSimulations[shopId];
    if (!shopSims) return;

    const entries = Object.entries(shopSims);
    if (entries.length === 0) return;

    // Find the latest simulation by createdAt
    const [latestProduct, latestSim] = entries.sort(
      ([, a], [, b]) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    setLastSimulatedProduct(latestProduct);

    // Hydrate the simulator state without calling the API
    if (!simulator.response && !simulator.lastRequest) {
      simulator.lastRequest = latestSim.request;
      simulator.response = latestSim.response;
      simulator.curve = null; // optional: fetch curve later if needed
    }
  }, [shopId, eoqSimulations, simulator]);

  return { simulator, lastSimulatedProduct };
}
