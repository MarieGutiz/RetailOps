import { useCallback, useEffect, useMemo, useState } from "react"
import { useInventoryStore } from "@/store/inventory/useInventoryStore"
import type { ABCData } from "@/types/abc"
import { useProductStore } from "@/store/inventory/useProductStore"
import { buildABCTableData } from "@/lib/abc/buildABCTableData"

 
/**
 * 
 * Hook to get ABC input data from inventory and products
 * @return ABCData[]
 * 
 */
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

/**
 * 
 * @param abcInput 
 * @returns the ABC summary data grouped by category A, B, C
 */

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

// Assign colors based on ABC category
export const useABCColors = () => {
  const colors = {
    A: {
      bg: "bg-emerald-100",
      hover: "hover:bg-emerald-200",
      active: "bg-emerald-200",
    },
    B: {
      bg: "bg-amber-100",
      hover: "hover:bg-amber-200",
      active: "bg-amber-200",
    },
    C: {
      bg: "bg-rose-100",
      hover: "hover:bg-rose-200",
      active: "bg-rose-200",
    },
  };
  return { colors };
};

// Change background color of elements based on hovered ABC category
export const useABCHover = () => {
  const [hoveredCategory, setHoveredCategory] = useState<"A" | "B" | "C" | null>(null);

  const onHover = useCallback((category: "A" | "B" | "C" | null) => {
    setHoveredCategory(category);
  }, []);

  return {
    hoveredCategory,
    onHover,
  };
};


// Simulate loading state when ABC input changes
export function useLoadABC(delay = 800) {
  const setLoading = useInventoryStore((s) => s.setLoading)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => {
      setLoading(false)
    }, delay)

    return () => clearTimeout(t)
  }, [setLoading, delay])
}

// Impact label for each category
export const impactLabel: Record<"A" | "B" | "C", string> = {
  A: "High impact",
  B: "Medium impact",
  C: "Low impact",
}
