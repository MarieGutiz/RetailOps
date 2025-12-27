import { useMemo } from "react"
import { useInventoryStore } from "@/store/inventory/useInventoryStore"
import type { ABCData } from "@/types/abc"
import { useProductStore } from "@/store/inventory/useProductStore"

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
