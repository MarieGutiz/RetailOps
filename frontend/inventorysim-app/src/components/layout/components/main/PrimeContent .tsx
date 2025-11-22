import ProductLibraryView from "@/views/ProductLibraryView";
import  { usePrimeLayoutStore } from "../../hooks/usePrimeLayout";
import GlobalHeader from "../headers/GlobalHeader";
import { usePrimeLayout } from "../PrimeLayoutProvider";
import ModuleContainer from "./ModuleContainer";

const PrimeContent  = () => {

    const layout = usePrimeLayout(); // always defined
    const pinned = usePrimeLayoutStore(l => l.pinned);
    const side = usePrimeLayoutStore(l => l.side);
    const collapsed = usePrimeLayoutStore(l => l.open)
    
    const sidebarState={
    pinned: pinned,
    collapsed: collapsed,
    side: side,
   }
  return (
    <>
     <GlobalHeader
        sidebarState={sidebarState}
        sidebarActions={{
          onTogglePin: () => layout.togglePin(),
          onToggleCollapse: () => layout.toggle(),
          onToggleSide: () => layout.toggleSide()
           }}/>
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
                 <button className="toolbar-element jbtn-flat-btn toolbar-element-md">
                  Helpers
                </button>
              </>
            }
          >
            <ProductLibraryView />
          </ModuleContainer>
    </>
  )
}

export default PrimeContent 