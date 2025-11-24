
import TopHeader from "./components/headers/TopHeader"
import  { PrimeLayoutProvider } from "./components/PrimeLayoutProvider"
import { PrimeLayoutController } from "./controllers/PrimeLayoutController"
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