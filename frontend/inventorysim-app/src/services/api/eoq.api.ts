import type { EoqCurveResponse, EoqRequest, EoqResponse } from "@/types/eoq-backend";
import api from "./api";

/**
 * Base path for simulator module
 * Matches backend: /api/simulator/eoq
 */
const SIMULATOR_BASE = "/simulator";
const EOQ_BASE = `${SIMULATOR_BASE}/eoq`;

/**
 * Run EOQ calculation
 * → returns optimal EOQ and parameters used
 *
 * If user is logged in and saveToHistory = true,
 * backend can persist the simulation.
 */
export const simulateEoq = async (
  data: EoqRequest,
  simId: string,
  shopName: string
): Promise<EoqResponse> => {
  try {
    const response = await api.post(
      EOQ_BASE,
      data,
      {
        params: { simId, shopName },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error simulating EOQ:", error);
    throw error;
  }
};


/**
 * Fetch EOQ cost curve
 * → returns ordering cost, holding cost, total cost + optimal quantity
 */
export const fetchEoqCurve = async (
  data: EoqRequest,
  simId: string,
  shopName: string
): Promise<EoqCurveResponse> => {
  try {
    const response = await api.post(
      `${EOQ_BASE}/curve`,
      data,
      {
        params: { simId, shopName },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching EOQ curve:", error);
    throw error;
  }
};
