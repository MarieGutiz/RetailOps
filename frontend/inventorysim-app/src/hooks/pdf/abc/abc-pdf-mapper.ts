import type { SimulationType as AbcMode } from "@/types/abc-backend";
import type { SimulationType as PdfSimulationType } from "@/types/pdf-backend";

export const mapAbcModeToPdfModel = (mode: AbcMode): PdfSimulationType => {
  switch (mode) {
    case "classic":
      return "CLASSIC";
    case "multi":
      return "MULTI";
    default:
      throw new Error(`Unsupported ABC mode: ${mode}`);
  }
};