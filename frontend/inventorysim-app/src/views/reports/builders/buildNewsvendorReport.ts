import type { SimulationLogEntry } from "@/views/Overview/hooks/useSimulationBitacora";
import type { BaseReport } from "../types/report.types";

export const buildNewsvendorReport = (
  log: Extract<SimulationLogEntry, { type: "newsvendor" }>
): BaseReport => {
  const { data, request, shopId, createdAt } = log;

  const service = data.serviceLevel;
  const stockoutRisk = 1 - service;
  const overstockRisk = service;

  return {
    model: "newsvendor",
    shopId,
    generatedAt: new Date().toISOString(),

    header: {
      title: `Newsvendor Report - ${request.productName}`,
      subtitle: `Simulation from ${new Date(createdAt).toLocaleString()}`,
      context: `Target service level: ${data.serviceLevel}%`,
    },

    kpis: [
      {
        label: "Optimal Quantity (Q*)",
        value: data.optimalOrderQuantity,
        hint: "Profit-maximizing order quantity",
      },
      {
        label: "Expected Profit",
        value: data.expectedProfit,
        severity: data.expectedProfit > 0 ? "positive" : "warning",
      },
      {
        label: "Service Level Achieved",
        value: `${data.serviceLevel}%`,
      },
      {
        label: "Stockout Probability",
        value: `${stockoutRisk}%`,
        severity: stockoutRisk > 20 ? "critical" : "neutral",
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
          overstock: overstockRisk,
          understock: stockoutRisk,
        },
      },
      {
        title: "Interpretation",
        type: "text",
        payload:
          stockoutRisk > 20
            ? "High stockout probability. Consider increasing service level."
            : "Risk profile within acceptable operational range.",
      },
    ],
  };
};