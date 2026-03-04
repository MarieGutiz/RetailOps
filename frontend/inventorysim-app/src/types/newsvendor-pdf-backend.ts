import type { NewsvendorResponse } from "./newsvendor-backend";
import type { ProductSimulationRequestDto } from "./pdf-backend";

export interface NewsvendorRequestPdfDto
  extends ProductSimulationRequestDto {
    meanDemand: number;
    stdDeviation: number;
    price: number;
    cost: number;
    salvageValue: number;
    penalty: number;
}

export interface NewsvendorPdfPayload {
  request: NewsvendorRequestPdfDto;
  response: NewsvendorResponse;
}