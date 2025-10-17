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