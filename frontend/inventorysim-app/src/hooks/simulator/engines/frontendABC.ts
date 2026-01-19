import { ABC_SCENARIOS } from "@/lib/abc/buildABCTableData";
import api from "@/services/api/api";
import type { ABCData } from "@/types/abc";
import type { SimulationType, AbcResponseDto } from "@/types/abc-backend";
import type { ShopType } from "@/types/shop";
import type { SimulatorABCOutput } from "@/types/simulator";
import { mapAbcResponseToTable } from "./mapper/abcBackendMapper";
import { ABCAnalysisFrontend } from "@/services/domain/segmentation/ABCAnalysisFrontend";

//Flat ABC
export function runFrontendABC(
  items: ABCData[],
  scenario: keyof typeof ABC_SCENARIOS
): SimulatorABCOutput {

  
  // 1 Run frontend ABC analysis
  const { table, summary } = ABCAnalysisFrontend(items, ABC_SCENARIOS[scenario]);

  // 2 Wrap into AbcResponseDto to satisfy SimulatorABCResult
  const result: AbcResponseDto = {
    items: table.map((row, index) => ({
      product: row.product,
      salesValue: row.totalValue,
      rank: index + 1,
      cumulativePct: row.cumulative,
      abcCategoryType: row.category,
      demandFrequency:  1,
    
    })),
    summary: {
      totalValue: summary.totalValue,
      a: summary.A,
      b: summary.B,
      c: summary.C,
    },
  };

  // 3 Optionally, if you want a separate table for the frontend UI
  const tableForFrontend = mapAbcResponseToTable(result);

  return { result, table: tableForFrontend };

}

/**
 * 
 * @param shop "Florist"| "Cafeteria"
 * @param simulationType "classic" | "multi"
 * @returns 
 */
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
