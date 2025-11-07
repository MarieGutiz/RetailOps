// SidebarControls.tsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Move, ChevronLeft, ChevronRight, PanelLeft, PanelRight } from "lucide-react";
import {  ToggleGroup,
  ToggleGroupItem,} from "@/components/ui/toggle-group";

export const SidebarControls = ({
  pinned,
  collapsed,
  side,
  onTogglePin,
  onToggleCollapse,
  onToggleSide,
}: {
  pinned: boolean;
  collapsed: boolean;
  side: "left" | "right";
  onTogglePin: () => void;
  onToggleCollapse: () => void;
  onToggleSide: () => void;
}) => {

  console.log("pinned at sidebarctrls "+pinned);
  return (
    <TooltipProvider>
      <div
        className={`flex items-start justify-center ${
          collapsed ? "flex-row gap-1" : "flex-col gap-1"
        } w-full h-full overflow-visible`}
      >
        <ToggleGroup
          type="single"
          value={pinned ? "pinned" : collapsed ? "collapse" : side}
          className={`flex ${collapsed ? "flex-row gap-1" : "flex-col gap-1"}`}
        >
          {/* Drag Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="pinned"
                onClick={onTogglePin}
                className={`h-8 w-8 ${pinned ? "bg-primary/20" : ""}`}
              >
                <Move className="h-2 w-2" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Enable/Disable Dragging</TooltipContent>
          </Tooltip>

          {/* Collapse Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="collapse"
                onClick={onToggleCollapse}
                className={`h-8 w-8 ${collapsed ? "bg-primary/20" : ""}`}
              >
                {collapsed ? (
                  <PanelRight className="h-2 w-2" />
                ) : (
                  <PanelLeft className="h-2 w-2" />
                )}
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              {collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            </TooltipContent>
          </Tooltip>

          {/* Switch Side Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="side"
                onClick={onToggleSide}
                className="h-8 w-8"
              >
                {side === "left" ? (
                  <ChevronRight className="h-2 w-2" />
                ) : (
                  <ChevronLeft className="h-2 w-2" />
                )}
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              {`Move Sidebar to ${side === "left" ? "Right" : "Left"} side`}
            </TooltipContent>
          </Tooltip>
        </ToggleGroup>
      </div>
    </TooltipProvider>
  );
};



