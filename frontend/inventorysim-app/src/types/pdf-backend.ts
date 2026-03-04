
export type SimulationType =
  | "NEWSVENDOR"
  | "EOQ"
  | "ABC_CLASSIC"
  | "ABC_MULTI";


  export interface SimulationRequestDto {
  model: SimulationType;
  shopId: string;
  shopName: string;
  createdAt: string; 
  // ISO string (LocalDateTime → string in JSON)
}

export interface ProductSimulationRequestDto
  extends SimulationRequestDto {
  productName: string;
  sku: string;
}
  