import type { Product } from "./products"

export interface InventoryRow {
  product:Product,
  quantity: number
  inventoryValue: number   // unitCost * quantity
  revenue: number         // unitPrice * quantity
  totalProfit: number     // (unitPrice - unitCost) * quantity

  abcClass?: "A" | "B" | "C"  
  categoryContributionPct?: number // cumulative %
}

export interface InventoryTotals {
  totalQuantity: number
  inventoryValue: number
  revenue: number
  totalProfit: number
}

// Inventory Base for the backend
export interface InventoryItemBase {
  product: Product;

  salesValue?: number;
  demandFrequency?: number;
}
