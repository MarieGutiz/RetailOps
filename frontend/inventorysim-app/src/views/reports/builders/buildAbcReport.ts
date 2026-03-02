import type { AbcResponseDto } from "@/types/abc-backend";
import type { SimulationLogEntry } from "@/views/Overview/hooks/useSimulationBitacora";
import type { BaseReport, ReportKPI } from "../types/report.types";

export const buildAbcReport = (
  log: Extract<SimulationLogEntry, { type: "abc" }>,
  formatCurrency: (value: number) => string,
  formatDate:(dateString: string | Date) =>string,
  shopName: string = "Shop"
): BaseReport => {
  const { request, data, shopId, createdAt } = log;

  const { summary, items } = data as AbcResponseDto;

  // KPIs
  const kpis: ReportKPI[] = [
    { label: "Total Inventory Value", value: formatCurrency(summary.totalValue) },
    { label: "A Items Count", value: summary.a.count, hint: `${summary.a.valuePct.toFixed(1)}% of total value` },
    { label: "B Items Count", value: summary.b.count, hint: `${summary.b.valuePct.toFixed(1)}% of total value` },
    { label: "C Items Count", value: summary.c.count, hint: `${summary.c.valuePct.toFixed(1)}% of total value` },
  ];

  // Build input parameters for card
  const parameterData = [
    { label: "Mode", value: request.mode },
    { label: "Number of Items", value: request.items?.length ?? 0 },
  ];

  // Section: Item distribution table
  const itemTableData = items.map(i => ({
    "Product": i.product.name,
    "SKU": i.product.sku,
    "Sales Value": formatCurrency(i.salesValue),
    "Demand Frequency": i.demandFrequency,
    "ABC Category": i.abcCategoryType,
    "Rank": i.rank,
    "Cumulative %": `${i.cumulativePct.toFixed(2)}%`,
  }));

  return {
    model: "abc",
    shopId,
    generatedAt: formatDate(new Date()),

    header: {
      title: "ABC Inventory Analysis",
      subtitle: `Mode: ${request.mode} — Shop: ${shopName}`,
      context: `Simulation from ${formatDate(createdAt)}`,
    },

    kpis,

    sections: [
      {
        title: "Input Parameters",
        type: "parameters",
        payload: parameterData,
      },
      {
        title: "ABC Summary Table",
        type: "table",
        payload: itemTableData,
      },
      {
        title: "Interpretation",
        type: "text",
        payload: `Category A items are high-value and should receive priority management. B items are moderate value; C items are low-value, low-frequency inventory.`,
      },
    ],
  };
};