"use client"

import * as React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { PrimeLayoutProvider } from "./components/PrimeLayoutProvider"
import { PrimeLayoutController } from "./PrimeLayoutController"

type PrimeLayoutOptions = {
  sidebarDefaultOpen?: boolean
  sidebarCollapsible?: "offcanvas" | "icon" | "none"
  sidebarVariant?: "sidebar" | "floating" | "inset"
}

type PrimeLayoutProps = {
  children: React.ReactNode
  options?: PrimeLayoutOptions
}

export function PrimeLayout({ children, options }: PrimeLayoutProps) {
  const isMobile = useIsMobile()
  const controller = React.useMemo(
    () => new PrimeLayoutController(options?.sidebarDefaultOpen),
    []
  )
  controller.setIsMobile(isMobile)

  return (
    <PrimeLayoutProvider>
      <div className="flex min-h-screen w-full">
        <div className="flex-none" style={{ width: PrimeLayoutController.SIDEBAR_WIDTH }}>
          Sidebar
        </div>
        <div className="flex-grow">
          {children}
        </div>
      </div>
      </PrimeLayoutProvider>
  )
}
