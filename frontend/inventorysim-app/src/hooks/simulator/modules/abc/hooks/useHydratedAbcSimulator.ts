import { useSimulationStore } from "@/store/simulations/useSimulationStore";
import { useAbcSimulator } from "./useAbcSimulator";

/**
 * Hydrates the ABC simulator with the last persisted simulation
 * for the given shopId
 */
export function useHydratedAbcSimulator(shopId: string) {
  const simulator = useAbcSimulator(shopId);

  const lastAbcSimId = useSimulationStore(
    (s) => s.lastAbcSimId[shopId] ?? null
  );

  return {
    simulator,
    lastSimulatedRunId: lastAbcSimId,
  };
}