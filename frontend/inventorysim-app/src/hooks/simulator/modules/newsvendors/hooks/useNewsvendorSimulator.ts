import { useSimulationBase } from '@/hooks/simulator/useSimulationBase';
import {
  simulateNewsvendor,
  fetchNewsvendorMarkers,
  fetchNormalPdf,
} from '@/services/api/newsvendor.api';
import { useSimulationStore } from '@/store/simulations/useSimulationStore';
import type {
  NewsvendorResponse,
  NewsvendorMarkers,
  NewsvendorRequest,
  NormalPdfRequest,
} from '@/types/newsvendor-backend';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';


//This hook manages the state and logic for the newsvendor sim, including runnin simulations,
//fetching markers and pdf (prob density fx) data. 
//It also persists the last simulation result in a global store(in the simulation store) for later retrieval.

interface UseNewsvendorSimulatorResult {
  simId: string;
  isRunning: boolean;
  error: string | null;

  response: NewsvendorResponse | null;
  markers: NewsvendorMarkers | null;
  pdf: Record<number, number> | null;

  lastRequest: NewsvendorRequest | null;

  hasResult: boolean;

  run: (request: NewsvendorRequest) => Promise<void>;

  newsvendorSimulations: Record<
    string,
    Record<string, { request: NewsvendorRequest; response: NewsvendorResponse }>
  >;
}

export function useNewsvendorSimulator(
  shopId: string,
  shopName: string,
  productName?: string
): UseNewsvendorSimulatorResult {
  const { simId, isRunning, error, setIsRunning, setError, sanitizeRequest } =
    useSimulationBase<NewsvendorRequest>(shopId, 'Newsvendor Simulator Error');

  const [response, setResponse] = useState<NewsvendorResponse | null>(null);
  const [markers, setMarkers] = useState<NewsvendorMarkers | null>(null);
  const [pdf, setPdf] = useState<Record<number, number> | null>(null);
  const [lastRequest, setLastRequest] = useState<NewsvendorRequest | null>(
    null
  );

  const addNewsvendorSimulation = useSimulationStore(
    (s) => s.addNewsvendorSimulation
  );
  const newsvendorSimulations = useSimulationStore(
    (s) => s.newsvendorSimulations
  );

  // ─────────── Hydrate last persisted simulation ───────────
  useEffect(() => {
    if (!productName) return;

    const lastSim = newsvendorSimulations[shopId]?.[productName];

    if (lastSim) {
      setResponse(lastSim.response);
      setLastRequest(lastSim.request);
    }
  }, [shopId, productName, newsvendorSimulations]);

  const run = async (request: NewsvendorRequest) => {
    if (!request.productName) {
      toast.error('Missing productName in request.');
      return;
    }

    try {
      setIsRunning(true);
      setError(null);

      const sanitizedRequest = sanitizeRequest(request);

      // ───────── Core Simulation ─────────
      const res = await simulateNewsvendor(sanitizedRequest, simId, shopName);

      setLastRequest(request);
      setResponse(res);

      // Persist to global store
      addNewsvendorSimulation(shopId, request.productName, {
        request,
        response: res,
        profitCurve: undefined,
        createdAt: new Date().toISOString(),
      });

      // ───────── Markers ─────────
      const markerRes = await fetchNewsvendorMarkers({
        simId,
        meanDemand: request.meanDemand,
        orderQuantity: res.optimalOrderQuantity,
        criticalRatio: res.criticalRatio,
      });

      setMarkers(markerRes);

      // ───────── PDF ─────────
      const pdfRequest: NormalPdfRequest = {
        mean: request.meanDemand,
        stdDev: request.stdDeviation,
        min: Math.max(0, request.meanDemand - 4 * request.stdDeviation),
        max: request.meanDemand + 4 * request.stdDeviation,
        step: Math.max(1, request.stdDeviation / 10),
      };

      const pdfRes = await fetchNormalPdf(pdfRequest, simId);
      setPdf(pdfRes);
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
    markers,
    pdf,
    lastRequest,
    hasResult: !!response && !!lastRequest,
    run,
    newsvendorSimulations,
  };
}
