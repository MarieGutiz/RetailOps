import type { Product } from "./products";

export interface ABCResult {
  categoryA: Product[];
  categoryB: Product[];
  categoryC: Product[];
  summary?: {
    totalItems: number;
    totalValue: number;
  };
}
export interface ABCData{
  product: Product;
  quantity: number;
}

// For backend DTO compatibility
export interface AbcItemDto {
  productName: string;
  salesValue: number;
  demandFrequency: number;
}

export interface AbcRequestDto {
  items: AbcItemDto[];
  username?: string;
  mode?: 'classic' | 'multi';
}