
import PinButton from "./components/PinButton"
import  { PrimeLayoutProvider } from "./components/PrimeLayoutProvider"
import ToggleSidebarButton from "./components/ToggleSidebarButton"
import { PrimeLayoutController } from "./controllers/PrimeLayoutController"

const controller = new PrimeLayoutController({ //verify options
  open: true,
  side: "left", // try "left" or "right"
  sidebarWidth: 16,
  collapsedWidth: 6,
  variant: "floating", // try "sidebar", "floating" or "inset"
  draggable: true,  
})


const Prime = () => {
  return (
    <PrimeLayoutProvider controller={controller}>
      <main>
        <h1>Dashboard</h1>
        <ToggleSidebarButton />
        <PinButton />
        
      </main>
    </PrimeLayoutProvider>

  )
}


export default Prime