// src/types/abc-backend.ts
import type { InventoryItemBase } from "@/types/inventory";
import type { Product } from "./products";

export interface AbcItemDto extends InventoryItemBase {}

export type ABCCategory = "A" | "B" | "C";

export interface AbcItemResultDto {
  product: Product;

  salesValue: number;  

  rank: number;
  cumulativePct: number;
  abcCategoryType: ABCCategory;
  demandFrequency: number;
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


export type SimulationType = "classic" | "multi" ;

export interface AbcRequestDto {
  items?: AbcItemDto[];   
  username?: string;      // optional for public
  mode: SimulationType;
  saveToHistory?:boolean;
}

//Selectable item for form
export interface AbcSelectableItem {
  product: Product;
  quantity: number;
  sku?: string;
  category?: string;
  salesValue: number;      // required
  demandFrequency: number; // required
}

