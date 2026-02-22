import type { AbcRequestDto, AbcItemDto } from "@/types/abc-backend";
import type { AbcFormValues } from "@/views/ABCViews/AbcForms/props/Abc.schema";

export function buildAbcRequest(
  values: AbcFormValues,
  isAuthenticated: boolean
): AbcRequestDto {
  const items: AbcItemDto[] = values.items
    .filter(
      (item) =>
        Number.isFinite(item.salesValue) &&
        item.salesValue > 0 &&
        Number.isFinite(item.demandFrequency) &&
        item.demandFrequency >= 0
    )
    .map((item) => ({
      product: {
        id: null, // backend doesn’t care
        name: item.product.name,
        sku: item.product.sku ?? undefined,
        category: item.product.category ?? undefined,
        unitPrice: item.product.unitPrice ?? 0,
        unitCost: item.product.unitCost ?? 0,
      },
      
      salesValue: item.salesValue,
      demandFrequency: item.demandFrequency,
    }));

  if (items.length === 0) {
    throw new Error("No valid items to submit.");
  }

  return {
    items,
    mode: values.mode,
    saveToHistory: isAuthenticated ? values.saveToHistory : false,
    username: isAuthenticated ? undefined : "guest",
  };
}