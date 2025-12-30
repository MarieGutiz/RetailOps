import { useMemo } from "react"
import { useInventoryStore } from "@/store/inventory/useInventoryStore"
import type { ABCData } from "@/types/abc"
import { useProductStore } from "@/store/inventory/useProductStore"
import { buildABCTableData } from "@/lib/abc/buildABCTableData"

export const useABCInput = (): ABCData[] => {
  const products = useProductStore(s => s.products)
  const inventory = useInventoryStore(s => s.inventory)

  return useMemo(() => {
    return inventory
      .map(item => {
        const product = products.find(
          p => String(p.id) === item.productId
        )
        if (!product) return null

        return { product, quantity: item.quantity }
      })
      .filter(Boolean) as ABCData[]
  }, [inventory, products])
}


export const useABCSummary = (abcInput: ABCData[]) => {
  return useMemo(() => {
    if (!abcInput.length) return null

    const rows = buildABCTableData(abcInput)
    const totalValue = rows.reduce((s, r) => s + r.totalValue, 0)

    const byCategory = {
      A: rows.filter(r => r.category === "A"),
      B: rows.filter(r => r.category === "B"),
      C: rows.filter(r => r.category === "C"),
    }

    const percent = (rows: typeof byCategory.A) =>
      totalValue === 0
        ? 0
        : (rows.reduce((s, r) => s + r.totalValue, 0) / totalValue) * 100

    return {
      totalValue,
      A: { count: byCategory.A.length, valuePct: percent(byCategory.A) },
      B: { count: byCategory.B.length, valuePct: percent(byCategory.B) },
      C: { count: byCategory.C.length, valuePct: percent(byCategory.C) },
    }
  }, [abcInput])
}
