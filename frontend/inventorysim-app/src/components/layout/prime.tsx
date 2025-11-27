
import TopHeader from "./components/headers/TopHeader"
import  { PrimeLayoutProvider } from "./components/PrimeLayoutProvider"
import { PrimeLayoutController } from "./controllers/PrimeLayoutController"
import PrimeContent from "./components/main/PrimeContent "
import { useProductStore } from "@/store/useProductStore"
import { useUserPolicy } from "@/context/UserPolicyContext"
import GuestLimitAlert from "./context/GuestLimitAlert"

const controller = new PrimeLayoutController({ //verify options
  open: true,
  side: "left", // try "left" or "right"
  sidebarWidth: 16, // in rem
  collapsedWidth: 3,
  variant: "floating", // try "sidebar", "floating" or "inset"
  draggable: true,  
  
})


const Prime = () => {
  // Check authentication status  
  const isAuth = useProductStore((s) => s.isAuthenticated);
  const { username } = useUserPolicy();
  return (
    
    <>   
    <PrimeLayoutProvider controller={controller}>
      <main>
        {/* Top Header */}
        <TopHeader isAuth={isAuth} username={username} />
        <GuestLimitAlert />
        {/* Global Header and module container */}
        <PrimeContent />
        
      </main>
      
    </PrimeLayoutProvider>
    </>
    

  )
}


export default Prime