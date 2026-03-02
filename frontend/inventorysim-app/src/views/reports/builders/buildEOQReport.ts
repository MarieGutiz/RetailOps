import type { SimulationLogEntry } from "@/views/Overview/hooks/useSimulationBitacora";
import type { BaseReport, ReportParameter } from "../types/report.types";
import type { EoqCurveResponse } from "@/types/eoq-backend";

export const buildEOQReport = (
  log: Extract<SimulationLogEntry, { type: "eoq" }>,
  productOptions: { name: string; sku: string }[],
  curve: EoqCurveResponse | null,
  formatCurrency: (value: number) => string,
  formatDate:(dateString: string | Date) =>string,
  shopName: string = "Shop"
): BaseReport => {
  const { data, request, shopId, createdAt } = log;

  const product = productOptions.find(
    p => p.name === request.productName
  );

  const sku = product?.sku ?? "N/A";
  const productName = product?.name ?? request.productName;

  const orderingVsHoldingRatio =
    data.orderingCost / (data.holdingCostTotal || 1);

  /* ---------------------------
     Parameter Section (Bridge)
  ---------------------------- */

  const parameters: ReportParameter[] = [
    {
      label: "Annual Demand (D)",
      value: request.demand,
    },
    {
      label: "Setup Cost (S)",
      value: request.cost,
      isCurrency: true,
    },
    {
      label: "Holding Cost (H)",
      value: request.holdingCost,
      isCurrency: true,
    },
  ];

  /* ---------------------------
     Interpretation Logic
  ---------------------------- */

  const interpretation =
    orderingVsHoldingRatio > 1
      ? "Ordering costs outweigh holding costs. Increasing order quantities reduces total cost exposure by minimizing setup frequency."
      : orderingVsHoldingRatio < 1
      ? "Holding costs dominate ordering costs. Smaller and more frequent replenishments help reduce capital lock-in."
      : "Ordering and holding costs are balanced. The EOQ reflects an equilibrium between setup frequency and inventory carrying cost.";

  /* ---------------------------
     Final Report
  ---------------------------- */

  return {
    model: "eoq",
    shopId,
    generatedAt: formatDate(new Date()),

    header: {
    title: "Economic Order Quantity (EOQ) Analysis",
    subtitle: `${productName} (SKU: ${sku}) — ${shopName}`,
    context: `Run on ${formatDate(createdAt)} • Optimal cost-minimizing replenishment policy`,
  },

    kpis: [
      {
        label: "Economic Order Quantity (Q*)",
        value: Math.round(data.eoq),
        hint: "Optimal order size minimizing total inventory cost",
      },
      {
        label: "Total Annual Cost",
        value: formatCurrency(data.totalCost),
      },
      {
        label: "Ordering Cost",
        value: formatCurrency(data.orderingCost),
      },
      {
        label: "Holding Cost",
        value: formatCurrency(data.holdingCostTotal),
      },
      {
        label: "Number of Orders / Year",
        value: data.numberOfOrders.toFixed(2),
      },
      {
        label: "Cycle Time",
        value: `${data.cycleTime.toFixed(2)} periods`,
      },
    ],

    sections: [
      {
        type: "parameters",
        title: "Input Parameters",
        payload: parameters,
      },

      ...(curve
        ? [
            {
              type: "chart" as const,
              title: "EOQ Cost Curve",
              payload: {
                type: "eoqCurve" as const,
                optimalQuantity: curve.optimalQuantity,
                points: curve.curvePoints,
              },
            },
          ]
        : []),

      {
        type: "text",
        title: "Cost Structure Interpretation",
        payload: interpretation,
      },
    ],
  };
};