import { useSelectedShop } from "@/hooks/shop/useSelectedShop";
import { useDeleteShop } from "@/store/shop/useDeleteShop";
import GlobalHeaderControls from "./GlobalHeaderControls";
import { Trash2 } from "lucide-react";

const GlobalHeader = ({
  sidebarState,
  sidebarActions,
 }: {
  sidebarState: { pinned: boolean; collapsed: boolean; side: "left" | "right" };
  sidebarActions: {
    onTogglePin: () => void;
    onToggleCollapse: () => void;
    onToggleSide: () => void;
  }
   }) => {


    // const { selectedId, shop: selectedSlice } = useSelectedShop();
    const { handleDeleteUserShop } = useDeleteShop();

    const { selectedId, shop: selectedSlice, selectShop } = useSelectedShop();
    const isUserShop = selectedSlice?.kind === "USER";

    // console.log("usershop ", isUserShop, "select slice ", selectedSlice);

  return (
    <header className="w-full h-14 bg-[#e8f3f6] border-b shadow-sm flex items-center justify-between px-4">
      
      {/* Left side: current module / shop */}
      <div className="flex items-center space-x-2 text-lg font-semibold text-[#0b3c4c]">
        {isUserShop && selectedSlice ? (
          <>
            <span>Dashboard for "{selectedSlice.name}"</span>
            <Trash2
              size={16}
              className="text-red-500 cursor-pointer"
              onClick={() => selectedId && handleDeleteUserShop(selectedId, selectedSlice.name ?? "Unnamed shop")}
            />
          </>
        ) : (
          <span>Dashboard</span>
        )}
      </div>

      {/* Right side: sidebar controls */}
      <GlobalHeaderControls
        pinned={sidebarState.pinned}
        collapsed={sidebarState.collapsed}
        side={sidebarState.side}
        onTogglePin={sidebarActions.onTogglePin}
        onToggleCollapse={sidebarActions.onToggleCollapse}
        onToggleSide={sidebarActions.onToggleSide}
      />

    </header>
  )
}

export default GlobalHeader