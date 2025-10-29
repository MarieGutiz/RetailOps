"use client"

import React, { createContext, useContext, useMemo, useEffect, useSyncExternalStore } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { PrimeLayoutController } from "../controllers/PrimeLayoutController"
import PrimeMenu from "./PrimeMenu"
import SidebarResizer from "./SidebarResizer"

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

  // always use same instance
  const layout = useMemo(() => controller ?? new PrimeLayoutController(), [controller])

  // React reactivity through `useSyncExternalStore`
  const open = useSyncExternalStore(
    (listener) => layout.subscribe(listener),
    () => layout.open
  )

  useEffect(() => {
    layout.setIsMobile(isMobile)
  }, [layout, isMobile])

  return (
    <PrimeLayoutContext.Provider value={layout}>
      <SidebarProvider open={open}
      onOpenChange={(v) => layout.setOpen(v)}
      style={layout.getSidebarStyle()}>
        <PrimeMenu variant={layout.variant} side={layout.side} />
         {!layout.isMobile && layout.draggable && <SidebarResizer />}
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </PrimeLayoutContext.Provider>
  )
}
