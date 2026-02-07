

export interface NewsvendorRequest {
  productId: string;
  productName: string;

  meanDemand: number;
  stdDeviation: number;

  price: number;
  cost: number;
  salvageValue: number;

  simulationRuns: number;

  saveToHistory: boolean;
  username?: string; // optional, backend defaults to "guest"
}

export interface NewsvendorResponse {
  product: string;

  criticalRatio: number;
  optimalOrderQuantity: number;

  expectedProfit: number;
  serviceLevel: number;
}


export interface NormalPdfRequest {
  mean: number;
  stdDev: number;

  min: number;
  max: number;

  step: number;
}


export interface NewsvendorMarkersRequest {
  simId: string;

  meanDemand: number;
  orderQuantity: number;

  criticalRatio: number;
}


export interface NewsvendorMarkers {
  meanDemand: number;
  orderQuantity: number;
  criticalRatio: number;
}
