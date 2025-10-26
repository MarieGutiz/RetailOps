"use client"

import React, { createContext, useContext, useMemo, useEffect } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { PrimeLayoutController } from "../controllers/PrimeLayoutController"
import PrimeMenu from "./PrimeMenu"

type PrimeLayoutProviderProps = {
  controller?: PrimeLayoutController
  children: React.ReactNode
}

/** Context gives access to the PrimeLayoutController instance anywhere */
const PrimeLayoutContext = createContext<PrimeLayoutController | null>(null)

export function usePrimeLayout() {
  const ctx = useContext(PrimeLayoutContext)
  if (!ctx) throw new Error("usePrimeLayout must be used within <PrimeLayoutProvider>")
  return ctx
}

/** Provider that wires your layout controller + Shadcn sidebar system */
export function PrimeLayoutProvider({ controller, children }: PrimeLayoutProviderProps) {
  const isMobile = useIsMobile()

  // ensure we reuse the same controller across renders
  const layout = useMemo(() => controller ?? new PrimeLayoutController(), [controller])

  // keep controller updated with current mobile state
  useEffect(() => {
    layout.setIsMobile(isMobile)
  }, [layout, isMobile])

  return (
    <PrimeLayoutContext.Provider value={layout}>
      <SidebarProvider style={layout.getSidebarStyle()}>
          <PrimeMenu variant="inset" />
        <SidebarInset style={layout.getMainStyle()}>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </PrimeLayoutContext.Provider>
  )
}
