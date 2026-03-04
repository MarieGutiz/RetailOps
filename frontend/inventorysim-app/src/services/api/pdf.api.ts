import type { NewsvendorPdfPayload } from "@/types/newsvendor-pdf-backend";
import api from "./api";
import type { EoqPdfPayload } from "@/types/eoq-pdf-backend";
import type { AbcPdfPayload } from "@/types/abc-pdf-backend";

/**
 * Base path for PDF reports
 * Matches backend: /api/reports
 */
const REPORTS_BASE = "/reports";

/* =========================================
   NEWSVENDOR PDF
========================================= */

export const generateNewsvendorPdf = async (
  payload: NewsvendorPdfPayload
): Promise<Blob> => {
  try {
    const response = await api.post(
      `${REPORTS_BASE}/newsvendor/pdf`,
      payload,
      {
        responseType: "blob", // Important for PDF download
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error generating Newsvendor PDF:", error);
    throw error;
  }
};

/* =========================================
   EOQ PDF
========================================= */

export const generateEoqPdf = async (
  payload: EoqPdfPayload
): Promise<Blob> => {
  try {
    const response = await api.post(
      `${REPORTS_BASE}/eoq/pdf`,
      payload,
      {
        responseType: "blob",
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error generating EOQ PDF:", error);
    throw error;
  }
};

/* =========================================
   ABC PDF
========================================= */

export const generateAbcPdf = async (
  payload: AbcPdfPayload
): Promise<Blob> => {
  try {
    const response = await api.post(
      `${REPORTS_BASE}/abc/pdf`,
      payload,
      {
        responseType: "blob",
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error generating ABC PDF:", error);
    throw error;
  }
};