import type { ABCData, ABCSummary, ABCTableRow } from "@/types/abc";

const DEFAULT_THRESHOLDS = { a: 80, b: 95, c: 100 }

export const ABCAnalysisFrontend = (
  data: ABCData[],
  thresholds = DEFAULT_THRESHOLDS
): { table: ABCTableRow[]; summary: ABCSummary } => {
  if (!data.length) {
    return {
      table: [],
      summary: {
        totalValue: 0,
        A: { count: 0, valuePct: 0 },
        B: { count: 0, valuePct: 0 },
        C: { count: 0, valuePct: 0 },
      },
    }
  }

  // 1. Compute total value per product
  const enriched = data.map(d => ({
    ...d,
    totalValue: d.product.unitPrice * d.quantity,
  }))

  // 2. Sort descending
  const sorted = [...enriched].sort((a, b) => b.totalValue - a.totalValue)

  const totalValue = sorted.reduce((s, i) => s + i.totalValue, 0)
  let cumulative = 0

  // 3. Assign ABC category
  const table: ABCTableRow[] = sorted.map(p => {
    cumulative += (p.totalValue / totalValue) * 100

    let category: "A" | "B" | "C"
    if (cumulative <= thresholds.a) category = "A"
    else if (cumulative <= thresholds.b) category = "B"
    else category = "C"

    return { ...p, cumulative, category }
  })

  // 4. Summary
  const summarize = (cat: "A" | "B" | "C") => {
    const subset = table.filter(r => r.category === cat)
    const valuePct = totalValue
      ? (subset.reduce((s, r) => s + r.totalValue, 0) / totalValue) * 100
      : 0
    return { count: subset.length, valuePct }
  }

  const summary: ABCSummary = {
    totalValue,
    A: summarize("A"),
    B: summarize("B"),
    C: summarize("C"),
  }

  return { table, summary }
}