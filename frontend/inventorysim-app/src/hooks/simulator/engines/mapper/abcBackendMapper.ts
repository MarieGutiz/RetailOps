import type { ABCTableRow } from '@/types/abc';
import type { AbcResponseDto } from '@/types/abc-backend';


// This function maps the response from the ABC bckend to the format used by the frontend
// table componnet

export function mapAbcResponseToTable(response: AbcResponseDto): ABCTableRow[] {
  return response.items.map((item) => ({
    product: item.product,
    quantity: 1,
    totalValue: item.salesValue,
    cumulative: Number(item.cumulativePct),
    category: item.abcCategoryType,
    demandFrequency: item.demandFrequency,
  }));
}

// helper to convert item to Product
