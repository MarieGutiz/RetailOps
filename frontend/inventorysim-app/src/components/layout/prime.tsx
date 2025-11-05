
import TopHeader from "./components/headers/TopHeader"
import MenuDirection from "./components/MenuDirection"
import PinButton from "./components/PinButton"
import  { PrimeLayoutProvider } from "./components/PrimeLayoutProvider"
import ToggleSidebarButton from "./components/ToggleSidebarButton"
import { PrimeLayoutController } from "./controllers/PrimeLayoutController"

const controller = new PrimeLayoutController({ //verify options
  open: true,
  side: "left", // try "left" or "right"
  sidebarWidth: 16, // in rem
  collapsedWidth: 3,
  variant: "inset", // try "sidebar", "floating" or "inset"
  draggable: true,  
})


const Prime = () => {
  return (
    <PrimeLayoutProvider controller={controller}>
      <main>
        <TopHeader />
        <h1>Dashboard</h1>
        <ToggleSidebarButton />
        <PinButton />
        <MenuDirection />
        
      </main>
    </PrimeLayoutProvider>

  )
}


export default Prime