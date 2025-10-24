import { useIsMobile } from '@/hooks/use-mobile'
import React, { createContext, useContext, useMemo } from 'react'
import { PrimeLayoutController } from '../PrimeLayoutController'

type PrimeLayoutProviderProps = {
  controller?: PrimeLayoutController
  children: React.ReactNode
}

const PrimeLayoutContext = createContext<PrimeLayoutController | null>(null)

export const usePrimeLayout = () => {
  const ctx = useContext(PrimeLayoutContext)
  if (!ctx) throw new Error("usePrimeLayout must be used within PrimeLayoutProvider")
  return ctx
}

export function PrimeLayoutProvider({ controller, children }: PrimeLayoutProviderProps) {
  const layout = useMemo(() => controller ?? new PrimeLayoutController(), [controller])
  return (
    <PrimeLayoutContext.Provider value={layout}>
      {children}
    </PrimeLayoutContext.Provider>
  )
}