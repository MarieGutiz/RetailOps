import { useSyncExternalStore } from "react"
import { usePrimeLayout } from "../components/PrimeLayoutProvider"
import type { PrimeLayoutController } from "../controllers/PrimeLayoutController"

export function usePrimeLayoutStore(selector: (layout: PrimeLayoutController) => any) {
  const layout = usePrimeLayout()
  return useSyncExternalStore(
    (listener) => layout.subscribe(listener),
    () => selector(layout)
  )
}