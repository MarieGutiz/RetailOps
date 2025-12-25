
import TopHeader from "./components/headers/TopHeader"
import  { PrimeLayoutProvider } from "./components/PrimeLayoutProvider"
import { PrimeLayoutController } from "./controllers/PrimeLayoutController"
import PrimeContent from "./components/main/PrimeContent "
import { useProductStore } from "@/store/inventory/useProductStore"
import GuestLimitAlert from "./context/GuestLimitAlert"
import { useEffect } from "react"
import { Outlet } from "react-router-dom"

const controller = new PrimeLayoutController({ //verify options
  open: true,
  side: "left", // try "left" or "right"
  sidebarWidth: 16, // in rem
  collapsedWidth: 3,
  variant: "floating", // try "sidebar", "floating" or "inset"
  draggable: true,  
  
})


const Prime = () => {
  // Initialize auth from token once
  useEffect(() => {
    useProductStore.getState().initAuth();
  }, []);
  return (    
    <>   
    <PrimeLayoutProvider controller={controller}>
      
        {/* Top Header - is fixed top */}
        <TopHeader />
        {/* pushes content below header */}
        <main className="pt-0"> 
          <GuestLimitAlert />
          {/* Global Header and module container */}
          {/* <PrimeContent /> */}
          <Outlet />
        
      </main>      
    </PrimeLayoutProvider>
    </>
    

  )
}


export default Prime