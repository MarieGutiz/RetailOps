import type { NewsvendorMarkers, NewsvendorMarkersRequest, NewsvendorRequest, NewsvendorResponse, NormalPdfRequest } from "@/types/newsvendor-backend";
import api from "./api";


/**
 * Base path for simulator module
 * Matches backend: /api/simulator/newsvendor
 */
const SIMULATOR_BASE = "/simulator";
const NEWSVENDOR_BASE = `${SIMULATOR_BASE}/newsvendor`
/**
 * Run a single Newsvendor simulation
 * → returns optimal Q, expected profit, service level, CR
 */
//Check if loggin -> saveToHistory
export const simulateNewsvendor = async (
  data: NewsvendorRequest,
  simId: string,
  shopName: string
): Promise<NewsvendorResponse> => {
  try {
    const response = await api.post(
      NEWSVENDOR_BASE,
      data,
      {
        params: { simId, shopName },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error simulating Newsvendor:", error);
    throw error;
  }
};

/**
 * Batch simulation
 * → Q vs expected profit (for profit curve)
 */
export const batchNewsvendorSimulation = async (
  data: NewsvendorMarkersRequest,
  simId: string,
  shopName: string,
  minQ: number,
  maxQ: number
): Promise<Record<number, number>> => {
  try {
    const response = await api.post(
      `${NEWSVENDOR_BASE}/batch`,
      data,
      {
        params: { simId, shopName, minQ, maxQ },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error running batch Newsvendor simulation:", error);
    throw error;
  }
};

/**
 * Normal PDF for demand distribution overlay
 * → demand (x) vs density (y)
 */
export const fetchNormalPdf = async (
  data: NormalPdfRequest,
  simId: string
): Promise<Record<number, number>> => {
  try {
    const response = await api.post(
       `${NEWSVENDOR_BASE}/pdf`,
      data,
      {
        params: { simId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching normal PDF:", error);
    throw error;
  }
};

/**
 * Profit distribution for a fixed order quantity Q
 * → histogram: profit → frequency
 */
export const fetchProfitDistribution = async (
  data: NewsvendorRequest,
  orderQuantity: number,
  simId: string,
  shopName: string
): Promise<Record<number, number>> => {
  try {
    const response = await api.post(
        `${NEWSVENDOR_BASE}/profit-distribution`,
      data,
      {
        params: { orderQuantity, simId, shopName },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching profit distribution:", error);
    throw error;
  }
};

/**
 * Markers for charts
 * → mean demand, selected Q, critical ratio
 */
export const fetchNewsvendorMarkers = async (
  data: NewsvendorMarkersRequest
): Promise<NewsvendorMarkers> => {
  try {
    const response = await api.post(
        `${NEWSVENDOR_BASE}/markers`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Newsvendor markers:", error);
    throw error;
  }
};
