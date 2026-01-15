// src/types/abc-backend.ts
import type { InventoryItemBase } from "@/types/inventory";

export interface AbcItemDto extends InventoryItemBase {}

export type ABCCategory = "A" | "B" | "C";

export interface AbcItemResultDto {
  productName: string;
  sku?: string;

  salesValue: number;
  unitPrice?: number;
  unitCost?: number;

  rank: number;
  cumulativePct: number;
  category: ABCCategory;
}

export interface AbcCategorySummary {
  count: number;
  valuePct: number;
}

export interface AbcSummaryDto {
  totalValue: number;

  a: AbcCategorySummary;
  b: AbcCategorySummary;
  c: AbcCategorySummary;
}


export interface AbcResponseDto {
  items: AbcItemResultDto[];
  summary: AbcSummaryDto;
}


export type SimulationType = "classic" | "multi" | "florist";

export interface AbcRequestDto {
  items?: AbcItemDto[];   // optional for florist
  username?: string;      // optional for public
  mode: SimulationType;
}