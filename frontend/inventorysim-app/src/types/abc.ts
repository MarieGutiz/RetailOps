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

export interface ABCTableRow {
  product: Product;
  quantity: number;
  totalValue: number;
  cumulative: number;
  category: "A" | "B" | "C";
}

export interface ABCCategorySummary {
  count: number
  valuePct: number
}


export interface ABCSummary {
  totalValue: number
  A: ABCCategorySummary
  B: ABCCategorySummary
  C: ABCCategorySummary
}


export interface ParetoPoint {
  name: string
  metric: number
  cumulativePct: number
  category: "A" | "B" | "C"
  categoryContributionPct?: number
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

//Delta

export type ABCDelta = {
  A: number
  B: number
  C: number
} | null
