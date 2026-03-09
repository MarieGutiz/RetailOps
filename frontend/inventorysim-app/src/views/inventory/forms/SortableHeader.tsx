import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const SortableHeader = ({ column, label }: { column: any; label: string }) => {
  const isSorted = column.getIsSorted();
  const arrow = isSorted ? (isSorted === 'asc' ? '↑' : '↓') : '';

  return (
    <div className="flex justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={`toolbar-element jbtn-flat-btn toolbar-element-md active 
                ${isSorted ? 'sorted' : ''}`}
              onClick={() => column.toggleSorting(isSorted === 'asc')}
            >
              {label} {arrow}
            </button>
          </TooltipTrigger>

          <TooltipContent side="bottom" className="text-xs">
            Sort {isSorted === 'asc' ? 'descending' : 'ascending'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SortableHeader;
