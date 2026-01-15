import { ABC_SCENARIOS, buildABCTableData } from "@/lib/abc/buildABCTableData";
import { runABCAnalysis } from "@/services/sim/segmentation/runABCAnalysis";
import type { ABCData } from "@/types/abc";
import type { Product } from "@/types/products";
import type { SimulatorABCOutput } from "@/types/simulator";

export function runFrontendABC(
  products: Product[],
  scenario: keyof typeof ABC_SCENARIOS
): SimulatorABCOutput {

  const abcData: ABCData[] = products.map(p => ({
    product: p,
    quantity: (p as any).quantity ?? 1,
  }));

  const table = buildABCTableData(
    abcData,
    ABC_SCENARIOS[scenario]
  );

  const result = runABCAnalysis(abcData);

  return { result, table };
}
