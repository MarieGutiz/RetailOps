import { fetchNewsvendorMarkers, fetchNormalPdf, simulateNewsvendor } from "@/services/api/newsvendor.api";
import { useApiErrorToast } from "@/services/api/useApiErrorToast";
import { useProductStore } from "@/store/inventory/useProductStore";
import { useSimulationStore } from "@/store/simulations/useSimulationStore";
import type { NewsvendorResponse, NewsvendorMarkers, NewsvendorRequest, NormalPdfRequest } from "@/types/newsvendor-backend";
import { getOrCreateSimId } from "@/utils/simulation";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";

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

 newsvendorSimulations: Record<string, Record<string, { request: NewsvendorRequest; response: NewsvendorResponse }>>;

}

export function useSimulator(shopId: string, shopName: string, productName?: string): UseNewsvendorSimulatorResult {
  const isAuthenticated = useProductStore((s) => s.isAuthenticated);
  const simId = useMemo(() => getOrCreateSimId(shopId), [shopId]);

  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [response, setResponse] = useState<NewsvendorResponse | null>(null);
  const [markers, setMarkers] = useState<NewsvendorMarkers | null>(null);
  const [pdf, setPdf] = useState<Record<number, number> | null>(null);
  const [lastRequest, setLastRequest] = useState<NewsvendorRequest | null>(null);

  const addNewsvendorSimulation = useSimulationStore((s) => s.addNewsvendorSimulation);
  const newsvendorSimulations = useSimulationStore((s) => s.newsvendorSimulations);

  useApiErrorToast(error, "Simulator Error");

  // ─────────── Load last persisted simulation for the product ───────────
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
      toast.error("Missing productName in request.");
      return;
    }

    try {
      setIsRunning(true);
      setError(null);

      const sanitizedRequest: NewsvendorRequest = {
        ...request,
        saveToHistory: isAuthenticated ? request.saveToHistory : false,
      };

      if (!isAuthenticated && request.saveToHistory) {
        toast.error("Register to save simulations to history.");
      }

      // ───────────── Core simulation ─────────────
      const res = await simulateNewsvendor(sanitizedRequest, simId, shopName);

      setLastRequest(request);
      setResponse(res);

      // Push to global store (persisted)
      addNewsvendorSimulation(shopId, request.productName, {
        request,
        response: res,
        profitCurve: undefined,
        createdAt: new Date().toISOString(),
      });

      // ───────────── Markers ─────────────
      const markerRes = await fetchNewsvendorMarkers({
        simId,
        meanDemand: request.meanDemand,
        orderQuantity: res.optimalOrderQuantity,
        criticalRatio: res.criticalRatio,
      });
      setMarkers(markerRes);

      // ───────────── PDF ─────────────
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
    error: error ? String(error) : null,
    response,
    markers,
    pdf,
    lastRequest,
    hasResult: !!response && !!lastRequest,
    run,
    newsvendorSimulations
  };
}

