
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
    <PrimeLayoutProvider controller={controller}>
      {/* <main>
        <TopHeader />
        <h1>Dashboard</h1>
        <ProductLibraryView />
        
      </main> */}
      <TopHeader />

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <ProductLibraryView />
            </div>
          </div>
        </div>
    </PrimeLayoutProvider>

  )
}


export default Prime