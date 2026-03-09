import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type ViewMode = 'all' | 'top10' | 'top20' | 'top50' | 'pareto';

const CardHeaderPlot = ({
  viewMode,
  setViewMode,
}: {
  viewMode: ViewMode;
  setViewMode: (value: ViewMode) => void;
}) => {
  return (
    <Select value={viewMode} onValueChange={setViewMode}>
      <SelectTrigger className="w-[180px] h-8 text-xs">
        <SelectValue placeholder="View range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All products</SelectItem>
        <SelectItem value="top10">10 products</SelectItem>
        <SelectItem value="top20">20 products</SelectItem>
        <SelectItem value="top50">50 products</SelectItem>
        <SelectItem value="pareto">Up to 80%</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default CardHeaderPlot;
