import type { ABCExecutionMode } from "@/hooks/simulator/engines/types/resolveABCMode";
import type { ABC_SCENARIOS } from "@/lib/abc/buildABCTableData";
import type { SimulationType } from "./abc-backend";
import type { ABCSummary, ABCTableRow } from "./abc";
import type { Product } from "./products";

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
  shopId: ShopId,
  scenario?: keyof typeof ABC_SCENARIOS;
};

export function shopId(value: string): ShopId {
  return value as ShopId;
}

// shopLifecycle.ts
// export type ShopLifecycle =
//   | "CREATED"     // shop exists, no products yet
//   | "IMPORTING"   // user is choosing templates
//   | "READY"      // products exist, simulation allowed
//   | "FAILED"     // shop setup failed
//   | "DELETED";    // shop has been deleted
    
  //Differentiate btween shops

  // --- Lifecycles ---
type CommonLifecycle = "CREATED" | "IMPORTING" | "READY" | "FAILED";

export type UserShopLifecycle = CommonLifecycle | "DELETED";
export type AutogenShopLifecycle = CommonLifecycle;

// Union type for convenience
export type ShopLifecycle = UserShopLifecycle | AutogenShopLifecycle;

// --- Shop slice ---
export type UserShopSlice = {
  kind: "USER";
  lifecycle: UserShopLifecycle;
  products: Product[];
  inventory?: InventoryState;
  analytics?: AnalyticsState;
  abc: ShopABCState;
  hydrated: boolean;
  label?: string;
};

export type AutogenShopSlice = {
  kind: "AUTOGEN";
  lifecycle: AutogenShopLifecycle;
  products: Product[];
  inventory?: InventoryState;
  analytics?: AnalyticsState;
  abc: ShopABCState;
  hydrated: boolean;
  label?: string;
};

export type ShopSlice = UserShopSlice | AutogenShopSlice;


