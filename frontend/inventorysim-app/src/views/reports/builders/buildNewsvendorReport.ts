import type { SimulationLogEntry } from "@/views/Overview/hooks/useSimulationBitacora";
import type { BaseReport } from "../types/report.types";
import { useCurrency } from "@/views/simulator/newsvendorViews/forms/props/useCurrency";



export const buildNewsvendorReport = (
  log: Extract<SimulationLogEntry, { type: "newsvendor" }>,
   productOptions: {
    name: string;
    sku: string;
  }[]
): BaseReport => {

  const { data, request, shopId, createdAt } = log;
  const product = productOptions.find(
  p => p.name === log.request.productName
);

const sku = product?.sku ?? "N/A";
const productName = product?.name ?? log.request.productName;

  // Backend returns decimal probability (0–1)
  const service = data.serviceLevel;
  const stockoutRisk = 1 - service;

   // Format profit as currency
  // const { format } = useCurrency();
  // const formattedProfit = format(data.expectedProfit);

  return {
    model: "newsvendor",
    shopId,
    generatedAt: new Date().toISOString(),

    header: {
      title: "Newsvendor Analysis",
      subtitle: `${productName} (SKU: ${sku})`,
      context: `Simulation from ${new Date(createdAt).toLocaleString()} • Service level achieved: ${(service * 100).toFixed(2)}%`,
    },

    kpis: [
      {
        label: "Optimal Quantity (Q*)",
        value: Math.round(data.optimalOrderQuantity),
        hint: "Profit-maximizing order quantity",
      },
      {
        label: "Expected Profit",
        value: data.expectedProfit,
        severity: data.expectedProfit > 0 ? "positive" : "warning",
      },
      {
        label: "Service Level Achieved",
        value: `${(service * 100).toFixed(2)}%`,
      },
      {
        label: "Stockout Probability",
        value: `${(stockoutRisk * 100).toFixed(2)}%`,
        severity: stockoutRisk > 0.20 ? "critical" : "neutral",
      },
    ],

    sections: [
      {
        title: "Input Parameters",
        type: "table",
        payload: request,
      },
      {
        title: "Risk Distribution",
        type: "chart",
        payload: {
          mean: request.meanDemand,
          std: request.stdDeviation,
          serviceLevel: service, // decimal (0–1)
        },
      },
      {
        title: "Interpretation",
        type: "text",
        payload:
          stockoutRisk > 0.20
            ? "High stockout probability. Consider increasing service level to reduce unmet demand risk."
            : "Risk profile within acceptable operational range.",
      },
    ],
  };
};