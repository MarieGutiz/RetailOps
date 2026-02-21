import type { AbcRequestDto, AbcItemDto } from "@/types/abc-backend";
import type { AbcFormValues } from "@/views/ABCViews/AbcForms/props/Abc.schema";

export function buildAbcRequest(
  values: AbcFormValues,
  isAuthenticated: boolean
): AbcRequestDto {

  const items: AbcItemDto[] = values.items.map(item => ({
    product: {
      ...item.product,
      id:
        typeof item.product.id === "number"
          ? item.product.id
          : null, // remove UUIDs, backend expects Long
    },
    salesValue: item.salesValue,
    demandFrequency: item.demandFrequency,
  }));

  return {
    items,
    mode: values.mode,
    saveToHistory: isAuthenticated ? values.saveToHistory : false,
    username: isAuthenticated ? undefined : "guest",
  };
}