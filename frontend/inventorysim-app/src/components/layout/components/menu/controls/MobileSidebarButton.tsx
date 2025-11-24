import { Menu } from "lucide-react"
import { usePrimeLayout } from "../../PrimeLayoutProvider"

const MobileSidebarButton = () => {
  const layout = usePrimeLayout()
    // Only show button if it's mobile
//   if (!layout.isMobile) return null;
   return (
    <button
      className="sm:hidden p-2 jbtn-warning-sm rounded-md border bg-background"
      onClick={() => layout.setOpenMobile(true)}
    >
      <Menu className="h-5 w-5" />
    </button>
  )
}

export default MobileSidebarButton