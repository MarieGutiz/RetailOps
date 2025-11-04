"use client"

import React, { createContext, useContext, useMemo, useEffect } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { PrimeLayoutController } from "../controllers/PrimeLayoutController"
import PrimeMenu from "./PrimeMenu"
import { usePrimeLayoutStore } from "../hooks/usePrimeLayout"

const PrimeLayoutContext = createContext<PrimeLayoutController | null>(null)

export function usePrimeLayout() {
  const ctx = useContext(PrimeLayoutContext)
  if (!ctx) throw new Error("usePrimeLayout must be used within <PrimeLayoutProvider>")
  return ctx
}

/** Provider that bridges your class controller and the SidebarProvider (clean + logical) */
export function PrimeLayoutProvider({
  controller,
  children,
}: {
  controller?: PrimeLayoutController
  children: React.ReactNode
}) {
  const isMobile = useIsMobile()
  const layout = useMemo(() => controller ?? new PrimeLayoutController(), [controller])

  useEffect(() => {
    layout.setIsMobile(isMobile)
  }, [layout, isMobile])

  return (
    <PrimeLayoutContext.Provider value={layout}>
      <PrimeLayoutContent>{children}</PrimeLayoutContent>
    </PrimeLayoutContext.Provider>
  )
}

function PrimeLayoutContent({ children }: { children: React.ReactNode }) {
  const layout = usePrimeLayout()
  const open = usePrimeLayoutStore(l => l.open)
  // const side = usePrimeLayoutStore(l => l.side)
  // const variant = layout.getVariant()

  return (
    <SidebarProvider
      open={open}
      onOpenChange={(v) => layout.setOpen(v)}
      style={layout.getSidebarStyle()}
    >
      <PrimeMenu controller={layout} />
        <SidebarInset>{children}</SidebarInset>
      
    </SidebarProvider>
    )
}