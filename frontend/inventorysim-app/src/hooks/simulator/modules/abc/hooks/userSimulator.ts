import { fetchNewsvendorMarkers, fetchNormalPdf, simulateNewsvendor } from "@/services/api/newsvendor.api";
import type { NewsvendorResponse, NewsvendorMarkers, NewsvendorRequest, NormalPdfRequest } from "@/types/newsvendor-backend";
import { getOrCreateSimId } from "@/utils/simulation";
import { useState, useMemo } from "react";

interface UseNewsvendorSimulatorResult {
  simId: string;
  isRunning: boolean;
  error: string | null;

  response: NewsvendorResponse | null;
  markers: NewsvendorMarkers | null;
  pdf: Record<number, number> | null;

  hasResult: boolean;

  run: (request: NewsvendorRequest) => Promise<void>;
}
//Use as
//const { shop } = useSelectedShop();
//const simulator = useSimulator(shop!.id, shop!.name);

export function useSimulator(
  shopId: string,
  shopName: string
): UseNewsvendorSimulatorResult {
  const simId = useMemo(() => getOrCreateSimId(shopId), [shopId]);

  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [response, setResponse] = useState<NewsvendorResponse | null>(null);
  const [markers, setMarkers] = useState<NewsvendorMarkers | null>(null);
  const [pdf, setPdf] = useState<Record<number, number> | null>(null);

  const run = async (request: NewsvendorRequest) => {
    try {
      setIsRunning(true);
      setError(null);

      /* ───────────── Core simulation ───────────── */
      const res = await simulateNewsvendor(
        request,
        simId,
        shopName
      );

      setResponse(res);

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
      setError("Newsvendor simulation failed");
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

    hasResult: !!response,
    run,
  };
}
