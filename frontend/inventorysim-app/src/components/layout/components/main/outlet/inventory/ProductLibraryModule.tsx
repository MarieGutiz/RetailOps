import ProductLibraryView from "@/views/ProductLibraryView"
import ModuleContainer from "../../ModuleContainer"

const ProductLibraryModule = () => {
  return (
    <ModuleContainer
            title="Product Library"
            subtitle="Manage your products efficiently"
            breadcrumbTrail={[
              { label: "Dashboard", path: "/dashboard" },
              { label: "Inventory", path: "/dashboard/inventory" },
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
  )
}

export default ProductLibraryModule