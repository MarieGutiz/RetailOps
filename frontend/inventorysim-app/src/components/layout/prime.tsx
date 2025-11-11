
import ProductLibraryView from "@/views/ProductLibraryView"
import TopHeader from "./components/headers/TopHeader"
import  { PrimeLayoutProvider } from "./components/PrimeLayoutProvider"
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
    <>   
    <PrimeLayoutProvider controller={controller}>
      <main>
        <TopHeader />
        <ProductLibraryView/>
      </main>
      
    </PrimeLayoutProvider>
    </>
    

  )
}


export default Prime