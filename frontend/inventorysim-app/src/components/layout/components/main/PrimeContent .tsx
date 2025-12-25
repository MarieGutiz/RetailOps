import  { usePrimeLayoutStore } from "../../hooks/usePrimeLayout";
import GlobalHeader from "../headers/GlobalHeader";
import { usePrimeLayout } from "../PrimeLayoutProvider";
import { Outlet } from "react-router-dom";

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
        <Outlet />
    </>
  )
}

export default PrimeContent 