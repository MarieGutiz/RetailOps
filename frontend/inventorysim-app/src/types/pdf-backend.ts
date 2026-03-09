export type SimulationType = 'NEWSVENDOR' | 'EOQ' | 'CLASSIC' | 'MULTI'; //where classic and muti are ABC sim types

export interface SimulationRequestDto {
  model: SimulationType;
  shopId: string;
  shopName: string;
  createdAt: string;
  // ISO string (LocalDateTime → string in JSON)
}

export interface ProductSimulationRequestDto extends SimulationRequestDto {
  productName: string;
  sku: string;
}
