import type {
  AbcResponseDto,
} from "@/types/abc-backend";
import type { Product } from "@/types/products";
import type { InventoryState, AnalyticsState } from "@/types/shop";
import { v4 as uuidv4 } from "uuid";



export function extractBackendABC(response: AbcResponseDto): {
  products: Product[];
  inventory: InventoryState;
  analytics: AnalyticsState;
} {
  const productMap = new Map<string, Product>();

  const quantities: Record<string, number> = {};
  const demandFrequency: Record<string, number> = {};
  const salesValue: Record<string, number> = {};

  for (const item of response.items) {
    const { product } = item;

    // Use existing id if present, otherwise fallback to sku, otherwise generate uuid
    const key = product.id ?? product.sku ?? uuidv4();

    // 1. products
    if (!productMap.has(key)) {
      productMap.set(key, {
        ...product,
        id: product.id ?? uuidv4(), // generate fake id if missing
        source: product.source ?? "BACKEND",
      });
    }

    // 2. inventory + analytics
    quantities[key] = quantities[key] ?? 0; // backend ABC has no stock
    demandFrequency[key] = item.demandFrequency;
    salesValue[key] = item.salesValue;  
  }

  return {
    products: Array.from(productMap.values()),
    inventory: { quantities },
    analytics: { demandFrequency, salesValue },
  };
}