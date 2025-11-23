import GlobalHeaderControls from "./GlobalHeaderControls";

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
  return (
    <header className="w-full h-14 bg-[#e8f3f6] border-b shadow-sm flex items-center justify-between px-4">
      
      {/* Left side: In what module? */}
      <div className="text-lg font-semibold text-[#0b3c4c]">
        Dashboard
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