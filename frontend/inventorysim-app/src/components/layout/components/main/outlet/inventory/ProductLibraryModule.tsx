import ProductLibraryView from "@/views/inventory/ProductLibraryView"
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
            userCases={["Scenario A", "Scenario B", "Scenario C"]}//import different user cases as needed
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
  )
}

export default ProductLibraryModule