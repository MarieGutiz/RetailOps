"use client"

import { PrimeLayoutProvider } from "./components/PrimeLayoutProvider"
import { PrimeLayoutController } from "./PrimeLayoutController"
import PrimeLayout from "./components/PrimeLayout"


const controller = new PrimeLayoutController({ //verify options
  open: true,
  side: "left", // try "left" or "right"
  sidebarWidth: 25,
  collapsedWidth: 6,
})

export function AppLayout() {
   return (
    <PrimeLayoutProvider controller={controller} >
      <PrimeLayout
        sidebar={<div className="p-4">Sidebar content</div>}
      >
        <div className="p-4">Main content here</div>
      </PrimeLayout>
    </PrimeLayoutProvider>
  
  )
}
