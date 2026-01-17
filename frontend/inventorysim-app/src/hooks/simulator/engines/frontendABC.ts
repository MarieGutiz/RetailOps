import { ABC_SCENARIOS, buildABCTableData } from "@/lib/abc/buildABCTableData";
import api from "@/services/api/api";
import { runABCAnalysis } from "@/services/sim/segmentation/runABCAnalysis";
import type { ABCData } from "@/types/abc";
import type { SimulationType, AbcResponseDto } from "@/types/abc-backend";
import type { ShopType } from "@/types/shop";
import type { SimulatorABCOutput } from "@/types/simulator";
import { mapAbcResponseToTable } from "./mapper/abcBackendMapper";

export function runFrontendABC(
  items: ABCData[],
  scenario: keyof typeof ABC_SCENARIOS
): SimulatorABCOutput {

  const table = buildABCTableData(
    items,
    ABC_SCENARIOS[scenario]
  );

  const result = runABCAnalysis(items);

  return { result, table };
}


export async function runShopABC(
  shop: ShopType,
  simulationType: SimulationType
): Promise<SimulatorABCOutput> {

  const { data } = await api.get<AbcResponseDto>(
    `/simulations/${shop.toLowerCase()}/abc?mode=${simulationType.toUpperCase()}`
  );

  const table = mapAbcResponseToTable(data);

  return {
    result: data,
    table,
  };
}
