import { useSimulationBase } from '@/hooks/simulator/useSimulationBase';
import { simulateEoq, fetchEoqCurve } from '@/services/api/eoq.api';
import { useApiErrorToast } from '@/services/api/useApiErrorToast';
import { useSimulationStore } from '@/store/simulations/useSimulationStore';
import type {
  EoqResponse,
  EoqCurveResponse,
  EoqRequest,
} from '@/types/eoq-backend';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

//This hook manages the state and logic for the EOQ sim, including running simulations,
//fetching the cost curve data, and persisting the last simulation result in a 
// global store(in the simulation store) for later retrieval.

interface UseEoqSimulatorResult {
  simId: string;
  isRunning: boolean;
  error: string | null;

  response: EoqResponse | null;
  curve: EoqCurveResponse | null;

  lastRequest: EoqRequest | null;

  hasResult: boolean;

  run: (request: EoqRequest) => Promise<void>;

  eoqSimulations: Record<
    string,
    Record<string, { request: EoqRequest; response: EoqResponse }>
  >;
}

export function useEoqSimulator(
  shopId: string,
  shopName: string,
  productName?: string
): UseEoqSimulatorResult {
  const { simId, isRunning, error, setIsRunning, setError, sanitizeRequest } =
    useSimulationBase<EoqRequest>(shopId, 'EOQ Simulator Error');

  const [response, setResponse] = useState<EoqResponse | null>(null);
  const [curve, setCurve] = useState<EoqCurveResponse | null>(null);
  const [lastRequest, setLastRequest] = useState<EoqRequest | null>(null);

  const addEoqSimulation = useSimulationStore((s) => s.addEOQSimulation);
  const eoqSimulations = useSimulationStore((s) => s.eoqSimulations);

  // ─────────── Hydrate last persisted simulation ───────────
  useEffect(() => {
    if (!productName) return;

    const lastSim = eoqSimulations[shopId]?.[productName];

    if (lastSim) {
      setResponse(lastSim.response);
      setLastRequest(lastSim.request);
    }
  }, [shopId, productName, eoqSimulations]);

  const run = async (request: EoqRequest) => {
    if (!request.productName) {
      toast.error('Missing productName in request.');
      return;
    }

    try {
      setIsRunning(true);
      setError(null);

      const sanitizedRequest = sanitizeRequest(request);

      // ───────── Core EOQ Simulation ─────────
      const res = await simulateEoq(sanitizedRequest, simId, shopName);
      console.log('response eoq ' + res);
      setLastRequest(request);
      setResponse(res);

      // Persist in global store
      addEoqSimulation(shopId, request.productName, {
        request,
        response: res,
        createdAt: new Date().toISOString(),
      });

      // ───────── Cost Curve ─────────
      const curveRes = await fetchEoqCurve(sanitizedRequest, simId, shopName);

      setCurve(curveRes);
    } catch (err) {
      useApiErrorToast(error, 'EOQ Simulator Error');
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
    curve,
    lastRequest,

    hasResult: !!response,

    run,
    eoqSimulations,
  };
}
