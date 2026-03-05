import type { AbcPdfPayload } from "@/types/abc-pdf-backend";
import type { SimulationLogEntry } from "@/views/Overview/hooks/useSimulationBitacora";
import { mapAbcModeToPdfModel } from "./abc-pdf-mapper";

export const mapLogToAbcPdfPayload = (
  log: Extract<SimulationLogEntry, { type: "abc" }>,
  shopName?: string
): AbcPdfPayload => {
  const pdfModel = mapAbcModeToPdfModel(log.request.mode);

  return {
    request: {
      model: pdfModel,     //fix           // PDF-level model
      shopId: log.shopId,
      shopName: shopName ?? "Shop",
      createdAt: log.createdAt,

      mode: log.request.mode,         // original abc mode (classic/multi)
      items: log.request.items ?? [], // original input items
    },
    shopName: shopName ?? "Shop",
  };
};