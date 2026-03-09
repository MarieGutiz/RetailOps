import { useSimulationBase } from '@/hooks/simulator/useSimulationBase';
import { simulateAbc } from '@/services/api/abc.api';
import { useSimulationStore } from '@/store/simulations/useSimulationStore';
import type { AbcResponseDto, AbcRequestDto } from '@/types/abc-backend';
import { v4 as uuidv4 } from 'uuid'; // for unique sim IDs
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';


//This hook manages the state and logic for the ABC sim, including running simulations,
// global store(in the simulation store) for later retrieval.

interface UseAbcSimulatorResult {
  simId: string | null;
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

export function useAbcSimulator(shopId: string): UseAbcSimulatorResult {
  const {
    simId: baseSimId,
    isRunning,
    error,
    setIsRunning,
    setError,
    sanitizeRequest,
  } = useSimulationBase<AbcRequestDto>(shopId, 'ABC Simulator Error');

  const [response, setResponse] = useState<AbcResponseDto | null>(null);
  const [lastRequest, setLastRequest] = useState<AbcRequestDto | null>(null);
  const [simId, setSimId] = useState<string | null>(null);

  const addAbcSimulation = useSimulationStore((s) => s.addAbcSimulation);
  const setLastAbcSimId = useSimulationStore((s) => s.setLastAbcSimId);
  const abcSimulations = useSimulationStore((s) => s.abcSimulations);
  const lastAbcSimId = useSimulationStore(
    (s) => s.lastAbcSimId[shopId] ?? null
  );

  // ───────── Hydrate last persisted simulation ─────────
  useEffect(() => {
    if (!lastAbcSimId) return;

    const lastSim = abcSimulations[shopId]?.[lastAbcSimId];
    if (lastSim) {
      setResponse(lastSim.response);
      setLastRequest(lastSim.request);
      setSimId(lastAbcSimId);
    }
  }, [shopId, abcSimulations, lastAbcSimId]);

  // ───────── Run new simulation ─────────
  const run = async (request: AbcRequestDto) => {
    if (!request.items || request.items.length === 0) {
      toast.error('No items provided in the ABC request.');
      return;
    }

    try {
      setIsRunning(true);
      setError(null);

      const sanitizedRequest = sanitizeRequest(request);

      const res = await simulateAbc(sanitizedRequest, baseSimId, shopId);
      const newSimId = uuidv4(); // unique ID for this run

      setLastRequest(request);
      setResponse(res);
      setSimId(newSimId);

      // Persist in global store
      addAbcSimulation(shopId, newSimId, {
        request,
        response: res,
        createdAt: new Date().toISOString(),
      });

      setLastAbcSimId(shopId, newSimId);
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
