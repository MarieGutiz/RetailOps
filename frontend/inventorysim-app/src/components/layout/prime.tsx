"use client"

import { PrimeLayoutProvider } from "./components/PrimeLayoutProvider"
import { PrimeLayoutController } from "./controllers/PrimeLayoutController"


const controller = new PrimeLayoutController({ //verify options
  open: true,
  side: "left", // try "left" or "right"
  sidebarWidth: 16,
  collapsedWidth: 6,
})

export function AppLayout() {
   return (
     <PrimeLayoutProvider controller={controller}>
      <main>
        <h1>Dashboard</h1>
      </main>
    </PrimeLayoutProvider>
  
  )
}
