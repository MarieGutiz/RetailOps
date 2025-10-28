
import  { PrimeLayoutProvider } from "./components/PrimeLayoutProvider"
import ToggleSidebarButton from "./components/ToggleSidebarButton"
import { PrimeLayoutController } from "./controllers/PrimeLayoutController"

const controller = new PrimeLayoutController({ //verify options
  open: true,
  side: "left", // try "left" or "right"
  sidebarWidth: 16,
  collapsedWidth: 6,
  variant: "inset" // try "sidebar", "floating" or "inset"
})


const Prime = () => {
  return (
    <PrimeLayoutProvider controller={controller}>
      <main>
        <h1>Dashboard</h1>
        <ToggleSidebarButton />
        
      </main>
    </PrimeLayoutProvider>

  )
}


export default Prime