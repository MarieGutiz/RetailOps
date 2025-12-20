import { useInventoryStore } from "@/store/inventory/useInventoryStore"

export const useInventoryStatus = (productId?: string) => {
  return useInventoryStore((state) => {
    if (!productId) return false
    return state.inventory.some(
      (item) => item.productId === productId
    )
  })
}