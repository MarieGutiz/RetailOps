import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { ToggleGroupItem } from '@/components/ui/toggle-group';

/**
 * HeaderToggleButton
 *
 * A reusable toggle button for sidebar or module headers.
 * Wraps the button with a tooltip and applies an active state.
 *
 * Notes:
 * - Uses `ToggleGroupItem` for groupable toggles.
 * - `Tooltip` wraps the button to display hover info.
 * - `sidebar-btn` class handles default styling; `active` class for active state.
 */


interface HeaderToggleButtonProps {
  value?: string;
  active?: boolean;
  onClick: () => void;
  tooltip: string;
  children: React.ReactNode;
}

const HeaderToggleButton = ({
  value,
  active,
  onClick,
  tooltip,
  children,
}: HeaderToggleButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ToggleGroupItem
          value={value || ' '}
          onClick={onClick}
          className={`sidebar-btn ${active ? 'active' : ''} p-0`}
        >
          {children}
        </ToggleGroupItem>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
};

export default HeaderToggleButton;
