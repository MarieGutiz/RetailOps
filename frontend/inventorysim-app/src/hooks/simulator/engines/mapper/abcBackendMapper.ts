import type { ABCTableRow } from "@/types/abc";
import type { AbcItemResultDto, AbcResponseDto } from "@/types/abc-backend";
import type { Product } from "@/types/products";

export function mapAbcResponseToTable(
  response: AbcResponseDto,
  products?: Product[]
): ABCTableRow[] {

  return response.items.map(item => {
    const product =
      products?.find(p => p.sku === item.sku)
      ?? floristItemToProduct(item);

    return {
      product,
      quantity: 1,
      totalValue: item.salesValue,
      cumulative: Number(item.cumulativePct),
      category: item.category,
    };
  });
}


// helper to convert item to Product
export function floristItemToProduct(item: AbcItemResultDto): Product {
  if (item.unitPrice == null || item.unitCost == null) {
    throw new Error(`Florist item ${item.sku} is missing pricing information`);
  }

  return {
    sku: item.sku,
    name: item.productName,
    unitPrice: item.unitPrice,
    unitCost: item.unitCost,
    source: "FLORIST",
  };
}


