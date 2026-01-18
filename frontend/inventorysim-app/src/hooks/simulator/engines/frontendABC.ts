import { ABC_SCENARIOS } from "@/lib/abc/buildABCTableData";
import api from "@/services/api/api";
import type { ABCData, ABCSummary, ABCTableRow } from "@/types/abc";
import type { SimulationType, AbcResponseDto, AbcItemResultDto, AbcSummaryDto } from "@/types/abc-backend";
import type { ShopType } from "@/types/shop";
import type { SimulatorABCOutput } from "@/types/simulator";
import { mapAbcResponseToTable } from "./mapper/abcBackendMapper";
import type { Product } from "@/types/products";
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

//For the shops generated
//Extractint the Product[] from the JSON
export function extractProductsFromAbc(
  items: AbcItemResultDto[]
): Product[] {
  const map = new Map<string, Product>();

  for (const { product } of items) {
    const key = product.id ?? product.sku;
    if (!key) continue;

    if (!map.has(key)) {
      map.set(key, {
        ...product,
        source: product.source ?? "BACKEND",
      });
    }
  }

  return Array.from(map.values());
}


//Extract summary 

function backendSummaryToStore(
  summary: AbcSummaryDto
): ABCSummary {
  return {
    totalValue: summary.totalValue,
    A: summary.a,
    B: summary.b,
    C: summary.c,
  };
}


//Map to ABC tableRow
function backendAbcToTable(
  items: AbcItemResultDto[]
): ABCTableRow[] {
  return items.map((item) => ({
    product: item.product,
    quantity: item.demandFrequency, // frontend abstraction
    totalValue: item.salesValue,
    cumulative: item.cumulativePct,
    category: item.abcCategoryType,
  }));
}
