import api from "@/services/api/api";
import type { AbcPdfPayload } from "@/types/abc-pdf-backend";
import type { EoqPdfPayload } from "@/types/eoq-pdf-backend";
import type { NewsvendorPdfPayload } from "@/types/newsvendor-pdf-backend";
import { toast } from "sonner";

const REPORTS_BASE = "/reports";

/**
 * Generic PDF generator
 */
async function generatePdf<T>(
  endpoint: string,
  payload: T
): Promise<Blob | null> {
  try {
    const response = await api.post(`${REPORTS_BASE}/${endpoint}`, payload, {
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    console.error(`Error generating ${endpoint} PDF:`, error);
    toast.error("PDF service unavailable or export failed", {
      position: "top-right",
    });
    return null;
  }
}

/**
 * Specific PDF generators
 */
export const generateNewsvendorPdf = (payload: NewsvendorPdfPayload) =>
  generatePdf<NewsvendorPdfPayload>("newsvendor/pdf", payload);

export const generateEoqPdf = (payload: EoqPdfPayload) =>
  generatePdf<EoqPdfPayload>("eoq/pdf", payload);

export const generateAbcPdf = (payload: AbcPdfPayload) =>
  generatePdf<AbcPdfPayload>("abc/pdf", payload);

/**
 * Download helper
 */
export const downloadPdf = (blob: Blob, filename: string) => {
  if (!blob) return;
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};