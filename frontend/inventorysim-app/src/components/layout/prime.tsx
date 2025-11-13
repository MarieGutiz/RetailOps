
import ProductLibraryView from "@/views/ProductLibraryView"
import TopHeader from "./components/headers/TopHeader"
import  { PrimeLayoutProvider } from "./components/PrimeLayoutProvider"
import { PrimeLayoutController } from "./controllers/PrimeLayoutController"
import ModuleContainer from "./components/main/ModuleContainer"

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
        {/* Main display */}
        <ModuleContainer
            title="Product Library"
            subtitle="Manage your products efficiently"
            breadcrumbTrail={[
              { label: "Home", path: "/" },
              { label: "Dashboard", path: "/dashboard" },
              { label: "Product Library" },
            ]}
            userCases={["Scenario A", "Scenario B", "Scenario C"]}
            onUserCaseChange={(value) => console.log("Selected user case:", value)}
            actions={
              <>
                <button className="toolbar-element jbtn-flat-btn toolbar-element-md active">
                  Simulate
                </button>
                <button className="toolbar-element jbtn-flat-btn toolbar-element-md">
                  Helpers
                </button>
              </>
            }
          >
            <ProductLibraryView />
          </ModuleContainer>
      </main>
      
    </PrimeLayoutProvider>
    </>
    

  )
}


export default Prime