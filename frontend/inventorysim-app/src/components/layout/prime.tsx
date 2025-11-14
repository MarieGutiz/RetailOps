
import ProductLibraryView from "@/views/ProductLibraryView"
import TopHeader from "./components/headers/TopHeader"
import  { PrimeLayoutProvider, usePrimeLayout } from "./components/PrimeLayoutProvider"
import { PrimeLayoutController } from "./controllers/PrimeLayoutController"
import ModuleContainer from "./components/main/ModuleContainer"
import GlobalHeader from "./components/headers/GlobalHeader"
import { usePrimeLayoutStore } from "./hooks/usePrimeLayout"
import PrimeContent from "./components/main/PrimeContent "

const controller = new PrimeLayoutController({ //verify options
  open: true,
  side: "left", // try "left" or "right"
  sidebarWidth: 16, // in rem
  collapsedWidth: 3,
  variant: "floating", // try "sidebar", "floating" or "inset"
  draggable: true,  
})


const Prime = () => {

  return (
    
    <>   
    <PrimeLayoutProvider controller={controller}>
      <main>
        {/* Top Header */}
        <TopHeader />
        {/* Global Header and module container */}
        <PrimeContent />
        
      </main>
      
    </PrimeLayoutProvider>
    </>
    

  )
}


export default Prime