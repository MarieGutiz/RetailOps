// SidebarControls.tsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Move, ChevronLeft, ChevronRight, PanelLeft, PanelRight, Bold, Italic, Underline } from "lucide-react";
import {  ToggleGroup,
  ToggleGroupItem,} from "@/components/ui/toggle-group";
// import "@/styles/SidebarControls.css";


interface SidebarControlsProps {
  pinned: boolean;
  collapsed: boolean;
  side: "left" | "right";
  onTogglePin: () => void;
  onToggleCollapse: () => void;
  onToggleSide: () => void;
}

export const SidebarControls = ({
  pinned,
  collapsed,
  side,
  onTogglePin,
  onToggleCollapse,
  onToggleSide,
}: SidebarControlsProps) => {
  console.log("Rendering SidebarControls - pinned:", pinned, "collapsed:", collapsed, "side:", side);
  return (
    <TooltipProvider>
      <div
        className={`flex items-start justify-center ${
          collapsed ? "flex-row gap-1" : "flex-col gap-1"
        } w-full h-full overflow-visible`}
      >
        <ToggleGroup
          type="single"
          className={`flex ${collapsed ? "flex-row gap-1" : "flex-col gap-1"}`}
        >
          {/* --- DRAG / PIN --- */}
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="pinned"
                onClick={onTogglePin}
                className={`sidebar-btn ${pinned ? "active" : ""}`}
              >
                <Move className="h-3.5 w-3.5" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Enable/Disable Dragging</TooltipContent>
          </Tooltip>

          {/* --- COLLAPSE --- */}
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="collapse"
                onClick={onToggleCollapse}
                className={`sidebar-btn ${collapsed ? "active" : ""}`}
              >
                {collapsed ? (
                  <PanelRight className="h-3.5 w-3.5" />
                ) : (
                  <PanelLeft className="h-3.5 w-3.5" />
                )}
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              {collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            </TooltipContent>
          </Tooltip>

          {/* --- SWITCH SIDE --- */}
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="side"
                onClick={onToggleSide}
                className="sidebar-btn"
              >
                {side === "left" ? (
                  <ChevronRight className="h-3.5 w-3.5" />
                ) : (
                  <ChevronLeft className="h-3.5 w-3.5" />
                )}
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              Move Sidebar to {side === "left" ? "Right" : "Left"} side
            </TooltipContent>
          </Tooltip>
        </ToggleGroup>
      </div>
    </TooltipProvider>
  );
};

