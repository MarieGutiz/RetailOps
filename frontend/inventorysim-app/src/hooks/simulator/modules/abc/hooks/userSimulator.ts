import { fetchNewsvendorMarkers, fetchNormalPdf, simulateNewsvendor } from "@/services/api/newsvendor.api";
import { useApiErrorToast } from "@/services/api/useApiErrorToast";
import { useProductStore } from "@/store/inventory/useProductStore";
import type { NewsvendorResponse, NewsvendorMarkers, NewsvendorRequest, NormalPdfRequest } from "@/types/newsvendor-backend";
import { getOrCreateSimId } from "@/utils/simulation";
import { useState, useMemo } from "react";
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
}

export function useSimulator(
  shopId: string,
  shopName: string
): UseNewsvendorSimulatorResult {
  const isAuthenticated = useProductStore((s) => s.isAuthenticated);

  const simId = useMemo(() => getOrCreateSimId(shopId), [shopId]);

  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const [response, setResponse] = useState<NewsvendorResponse | null>(null);
  const [markers, setMarkers] = useState<NewsvendorMarkers | null>(null);
  const [pdf, setPdf] = useState<Record<number, number> | null>(null);

  const [lastRequest, setLastRequest] = useState<NewsvendorRequest | null>(null);
 
  useApiErrorToast(error, "Simulator Error");

  const run = async (request: NewsvendorRequest) => {
    
    try {
       console.log("Simulator running with request:", request); 
      setIsRunning(true);
      setError(null);

      const sanitizedRequest: NewsvendorRequest = {
      ...request,
      saveToHistory: isAuthenticated ? request.saveToHistory : false,
    };

    if (!isAuthenticated && request.saveToHistory) {
      toast.error("Register to save simulations to history.");
    }


      /* ───────────── Core simulation ───────────── */
      const res = await simulateNewsvendor(
        sanitizedRequest,
        simId,
        shopName
      );
      console.log("Response ", res)
      // Set last request first
      setLastRequest(request);

      // Then set response
      setResponse(res);
      //Watch markers

      console.log("Sending markers request:", {
      meanDemand: request.meanDemand,
      orderQuantity: res.optimalOrderQuantity,
      criticalRatio: res.criticalRatio,
    });


      /* ───────────── Markers for charts ───────────── */
      const markerRes = await fetchNewsvendorMarkers({
        simId,
        meanDemand: request.meanDemand,
        orderQuantity: res.optimalOrderQuantity,
        criticalRatio: res.criticalRatio,
      });

      setMarkers(markerRes);


      /* ───────────── Normal PDF overlay ───────────── */
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
  };
}
