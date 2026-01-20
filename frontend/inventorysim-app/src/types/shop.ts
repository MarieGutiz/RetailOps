import type { ABCExecutionMode } from "@/hooks/simulator/engines/types/resolveABCMode";
import type { ABC_SCENARIOS } from "@/lib/abc/buildABCTableData";
import type { SimulationType } from "./abc-backend";
import type { ABCSummary, ABCTableRow } from "./abc";

export type ShopType = "FLORIST" | "CAFETERIA";

export type ShopId = string & { readonly brand: unique symbol };

export type ABCComputationSource = "FRONTEND" | "BACKEND";

export type InventoryState = {
  quantities: Record<string, number>; // productId -> quantity
};

export type AnalyticsState = {
  demandFrequency?: Record<string, number>; // productId -> frequency
  salesValue?: Record<string, number>;      // productId -> value
};

export interface ShopABCState {
  loading: boolean;
  error?: string;

  executionMode?: ABCComputationSource;
  mode?: SimulationType;

  table?: ABCTableRow[];
  summary?: ABCSummary;
}

export type RunABCOptions = {
  executionMode: ABCExecutionMode;
  simulationType?: SimulationType;
  scenario?: keyof typeof ABC_SCENARIOS;
};

export function shopId(value: string): ShopId {
  return value as ShopId;
}
