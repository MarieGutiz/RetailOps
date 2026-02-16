

export interface EoqRequest {
  productName: string;         // optional if using ID instead
  demand: number;               // D
  cost: number;                 // Setup cost S
  holdingCost: number;          // Holding cost H
  saveToHistory: boolean;
  username?: string;
}

export interface EoqResponse {
  product: string;
  demand: number;        
  setupCost: number;     
  holdingCost: number;   
  eoq: number;
}

export interface EoqCurvePoint {
  quantity: number;        // Q
  orderingCost: number;    // Ordering cost at this Q
  holdingCost: number;     // Holding cost at this Q
  totalCost: number;       // Total cost at this Q
}

export interface EoqCurveResponse {
  optimalQuantity: number;      // EOQ Q*
  curvePoints: EoqCurvePoint[]; // List of points for plotting
}