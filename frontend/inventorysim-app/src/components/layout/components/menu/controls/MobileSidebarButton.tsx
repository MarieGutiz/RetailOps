import { Menu } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/layout/use-mobile";

const MobileSidebarButton = () => {
  const isMobile = useIsMobile()
  const {toggleSidebar, openMobile} = useSidebar();
  // console.log("Mobile sidebar open state from store:", openMobile);
  
    // Only show button if it's mobile
   if (!isMobile) return null;
   return (
    <button
      className="p-2 jbtn-warning-sm rounded-md border bg-background"
      onClick={() => toggleSidebar()}
    >
      <Menu className="h-5 w-5" />
    </button>
  )
}

export default MobileSidebarButton