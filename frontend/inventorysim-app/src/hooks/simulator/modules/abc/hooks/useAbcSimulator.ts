import { useSimulationBase } from "@/hooks/simulator/useSimulationBase";
import { simulateAbc } from "@/services/api/abc.api";
import { useSimulationStore } from "@/store/simulations/useSimulationStore";
import type { AbcResponseDto, AbcRequestDto } from "@/types/abc-backend";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface UseAbcSimulatorResult {
  simId: string;
  isRunning: boolean;
  error: string | null;

  response: AbcResponseDto | null;
  lastRequest: AbcRequestDto | null;

  hasResult: boolean;

  run: (request: AbcRequestDto) => Promise<void>;

  abcSimulations: Record<
    string,
    Record<string, { request: AbcRequestDto; response: AbcResponseDto }>
  >;
}

export function useAbcSimulator(
  shopId: string,
  shopName: string,
  productName?: string
): UseAbcSimulatorResult {

  const {
    simId,
    isRunning,
    error,
    setIsRunning,
    setError,
    sanitizeRequest,
  } = useSimulationBase<AbcRequestDto>(shopId, "ABC Simulator Error");

  const [response, setResponse] = useState<AbcResponseDto | null>(null);
  const [lastRequest, setLastRequest] = useState<AbcRequestDto | null>(null);

  const addAbcSimulation = useSimulationStore((s) => s.addAbcSimulation);
  const abcSimulations = useSimulationStore((s) => s.abcSimulations);

  // ─────────── Hydrate last persisted simulation ───────────
  useEffect(() => {
    if (!productName) return;

    const lastSim = abcSimulations[shopId]?.[productName];
    if (lastSim) {
      setResponse(lastSim.response);
      setLastRequest(lastSim.request);
    }
  }, [shopId, productName, abcSimulations]);

  const run = async (request: AbcRequestDto) => {
    if (!request.items || request.items.length === 0) {
      toast.error("No items provided in the ABC request.");
      return;
    }

    try {
      setIsRunning(true);
      setError(null);

      const sanitizedRequest = sanitizeRequest(request);

      const res = await simulateAbc(sanitizedRequest, simId, shopName);

      setLastRequest(request);
      setResponse(res);

      // Persist in global store
      if (productName) {
        addAbcSimulation(shopId, productName, {
          request,
          response: res,
          createdAt: new Date().toISOString(),
        });
      }

    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setIsRunning(false);
    }
  };

  return {
    simId,
    isRunning,
    error,

    response,
    lastRequest,

    hasResult: !!response,

    run,
    abcSimulations,
  };
}
