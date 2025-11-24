import { TooltipProvider } from "@/components/ui/tooltip";
import { Move, ChevronLeft, ChevronRight, PanelLeft, PanelRight } from "lucide-react";
import HeaderToggleButton from "./HeaderToggleButton";
import { ToggleGroup } from "@/components/ui/toggle-group";
import MobileSidebarButton from "../menu/controls/MobileSidebarButton";

interface GlobalHeaderControlsProps {
  pinned: boolean;
  collapsed: boolean;
  side: "left" | "right";
  onTogglePin: () => void;
  onToggleCollapse: () => void;
  onToggleSide: () => void;
}

const GlobalHeaderControls = ({
    collapsed,
    side,
    onToggleCollapse,
    onToggleSide,}: GlobalHeaderControlsProps) => {
    return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
       <ToggleGroup
          type="single" className="gap-1">

        {/* COLLAPSE */}
        <HeaderToggleButton
          value="collapsed"
          active={collapsed}
          onClick={onToggleCollapse}
          tooltip={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <PanelRight className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
        </HeaderToggleButton>

        {/* SWITCH SIDE */}
        <HeaderToggleButton
          value="side"
          active={false}
          onClick={onToggleSide}
          tooltip={`Move Sidebar to ${side === "left" ? "Right" : "Left"} side`}
        >
          {side === "left" ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </HeaderToggleButton> 
            
            
      </ToggleGroup> 
        
          <MobileSidebarButton />
      </div>
    </TooltipProvider>
  );
}

export default GlobalHeaderControls