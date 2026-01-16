import type { ABCTableRow } from "@/types/abc";
import type { AbcResponseDto } from "@/types/abc-backend";

export function mapAbcResponseToTable(
  response: AbcResponseDto
): ABCTableRow[] {

  return response.items.map(item => ({
    product: item.product,
    quantity: 1,
    totalValue: item.salesValue,
    cumulative: Number(item.cumulativePct),
    category: item.abcCategoryType,
  }));
}


// helper to convert item to Product


