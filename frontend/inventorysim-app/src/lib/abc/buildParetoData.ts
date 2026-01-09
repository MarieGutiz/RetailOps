import type { ABCTableRow, ParetoPoint } from "@/types/abc"

export const buildParetoData = (rows: ABCTableRow[]): ParetoPoint[] => {
  return rows.map((row) => ({
    name: row.product.name,
    metric: row.totalValue,
    cumulativePct: row.cumulative,
    category: row.category,
  }))
}

export const tooltipParetoLabels: Record<string, string> = {
  metric: "Total Value",
  cumulativePct: "Cumulative contribution",
}