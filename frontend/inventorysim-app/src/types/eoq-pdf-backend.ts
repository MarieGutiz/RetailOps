import type { EoqCurveResponse, EoqResponse } from "./eoq-backend";
import type { ProductSimulationRequestDto } from "./pdf-backend";

export interface EoqRequestPdfDto
  extends ProductSimulationRequestDto {
  demand: number;       // Annual demand (D)
  cost: number;         // Setup cost (S)
  holdingCost: number;  // Holding cost (H)
}



export interface EoqPdfPayload {
  request: EoqRequestPdfDto;
  response: EoqResponse;
  curve: EoqCurveResponse;
  shopName: string;
}