
export interface EoqRequest {
  productId: number;
  demand: number;        // d
  cost: number;          // c
  holdingCost: number;   // h
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