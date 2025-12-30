import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { ToggleGroupItem,} from "@/components/ui/toggle-group";

interface HeaderToggleButtonProps {
  value?: string;
  active?: boolean;
  onClick: () => void;
  tooltip: string;
  children: React.ReactNode;
}

const HeaderToggleButton = ({ value, active, onClick, tooltip, children }: HeaderToggleButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ToggleGroupItem
          value={value || " "}
          onClick={onClick}
          className={`sidebar-btn ${active ? "active" : ""} p-0`}
        >
          {children}
        </ToggleGroupItem>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export default HeaderToggleButton