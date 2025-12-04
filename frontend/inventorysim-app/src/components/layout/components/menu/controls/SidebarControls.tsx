// SidebarControls.tsx
import { TooltipProvider } from "@/components/ui/tooltip";
import { Move, ChevronLeft, ChevronRight, PanelLeft, PanelRight } from "lucide-react";
import {  ToggleGroup,} from "@/components/ui/toggle-group";
import HeaderToggleButton from "../../headers/HeaderToggleButton";
import { useIsMobile } from "@/hooks/use-mobile";


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
   const isMobile = useIsMobile();
   
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
          {/* ----- MOBILE ONLY: SHOW ONLY SIDE TOGGLE ----- */}
          {isMobile ? (
            <>
              <HeaderToggleButton
                value="side"
                active={true}
                onClick={onToggleSide}
                tooltip={`Move Sidebar to ${
                  side === "left" ? "Right" : "Left"
                } side`}
              >
                {side === "left" ? (
                  <ChevronRight className="h-3.5 w-3.5" />
                ) : (
                  <ChevronLeft className="h-3.5 w-3.5" />
                )}
              </HeaderToggleButton>
            </>
          ) : (
            <>
              {/* ----- DESKTOP ONLY BUTTONS ----- */}

              {/* PIN */}
              <HeaderToggleButton
                value="pinned"
                active={pinned}
                onClick={onTogglePin}
                tooltip="Enable/Disable Dragging"
              >
                <Move className="h-3.5 w-3.5" />
              </HeaderToggleButton>

              {/* COLLAPSE */}
              <HeaderToggleButton
                value="collapsed"
                active={collapsed}
                onClick={onToggleCollapse}
                tooltip={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {collapsed ? (
                  <PanelRight className="h-3.5 w-3.5" />
                ) : (
                  <PanelLeft className="h-3.5 w-3.5" />
                )}
              </HeaderToggleButton>

              {/* SWITCH SIDE (desktop too if you want) */}
              <HeaderToggleButton
                value="side"
                active={true}
                onClick={onToggleSide}
                tooltip={`Move Sidebar to ${
                  side === "left" ? "Right" : "Left"
                } side`}
              >
                {side === "left" ? (
                  <ChevronRight className="h-3.5 w-3.5" />
                ) : (
                  <ChevronLeft className="h-3.5 w-3.5" />
                )}
              </HeaderToggleButton>
            </>
          )}
        </ToggleGroup>
      </div>
    </TooltipProvider>
  );
};

