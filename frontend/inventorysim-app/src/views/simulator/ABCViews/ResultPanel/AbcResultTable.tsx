import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { AbcResponseDto, ABCCategory } from '@/types/abc-backend';
import { useCurrency } from '@/views/simulator/newsvendorViews/forms/hooks/useCurrency';
import { useState, useMemo } from 'react';

interface Props {
  response?: AbcResponseDto;
  isRunning?: boolean;
  hoveredCategory?: ABCCategory | null;
  onHoverCategory?: (cat: ABCCategory | null) => void;
  hoverThreshold?: '80' | '95' | null;
  onHoverThreshold?: (t: '80' | '95' | null) => void;
  loading?: boolean;
  maxTopItems?: number;
}

const categoryColor: Record<ABCCategory, string> = {
  A: 'bg-red-500',
  B: 'bg-amber-500',
  C: 'bg-emerald-500',
};

const AbcResultTable = ({
  response,
  isRunning,
  hoveredCategory,
  onHoverCategory,
  hoverThreshold,
  onHoverThreshold,
  loading,
  maxTopItems = 5,
}: Props) => {
  const { format } = useCurrency();
  type SortKey =
    | 'rank'
    | 'salesValue'
    | 'cumulativePct'
    | 'demandFrequency'
    | 'category';
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [asc, setAsc] = useState(true);
  //   const [hoverThreshold, setHoverThreshold] = useState<"80" | "95" | null>(null)

  if (isRunning)
    return (
      <div className="text-sm text-muted-foreground">Running simulation...</div>
    );
  if (!response)
    return (
      <div className="text-sm text-muted-foreground">
        Run the simulation to see results.
      </div>
    );

  const { items, summary } = response;

  const sortedItems = useMemo(() => {
    const categoryOrder: Record<ABCCategory, number> = {
      A: 1,
      B: 2,
      C: 3,
    };

    return [...items].sort((a, b) => {
      if (sortKey === 'category') {
        const aVal = categoryOrder[a.abcCategoryType];
        const bVal = categoryOrder[b.abcCategoryType];
        return asc ? aVal - bVal : bVal - aVal;
      }

      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return asc ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [items, sortKey, asc]);

  const toggleSort = (key: typeof sortKey) => {
    if (key === sortKey) setAsc(!asc);
    else {
      setSortKey(key);
      setAsc(false);
    }
  };

  // Top A products for badges
  const topA = useMemo(() => {
    return [...items]
      .filter((i) => i.abcCategoryType === 'A')
      .sort((a, b) => b.salesValue - a.salesValue)
      .slice(0, maxTopItems);
  }, [items, maxTopItems]);

  const getArrow = (key: SortKey) =>
  sortKey === key ? (asc ? ' ↑' : ' ↓') : '';
  return (
    <div className="flex flex-col gap-4 min-w-0">
      {/* Top A badges */}
      {topA.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {topA.slice(0, maxTopItems).map((item) => (
            <Badge
              key={item.product.id}
              variant="outline"
              className="cursor-pointer hover:bg-blue-50 transition"
              onMouseEnter={() => onHoverCategory?.('A')}
              onMouseLeave={() => onHoverCategory?.(null)}
            >
              #{item.rank} {item.product.name} • {format(item.salesValue)}
            </Badge>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
      <Table className="w-full text-sm">
        <TableHeader>
          <TableRow>
            {/* Rank */}
            <TableHead
              onClick={() => toggleSort('rank')}
              className="min-w-[60px] px-2 py-2 text-left font-semibold whitespace-nowrap cursor-pointer"
            >
              #{getArrow('rank')}
            </TableHead>

            {/* Product */}
            <TableHead className="min-w-[100px] px-2 py-2 text-left font-semibold">
              Product
            </TableHead>

            {/* Sales */}
            <TableHead
              onClick={() => toggleSort('salesValue')}
              className="min-w-[110px] px-2 py-2 text-right font-semibold whitespace-nowrap cursor-pointer"
            >
              <span className="sm:hidden">Sales</span>
              <span className="hidden sm:inline">Sales Value</span>
              {getArrow('salesValue')}
            </TableHead>

            {/* Cumulative */}
            <TableHead
              onClick={() => toggleSort('cumulativePct')}
              className="min-w-[120px] px-2 py-2 text-center font-semibold whitespace-nowrap cursor-pointer"
            >
              <span className="sm:hidden">Cum %</span>
              <span className="hidden sm:inline">Cumulative %</span>
              {getArrow('cumulativePct')}
            </TableHead>

            {/* Demand */}
            <TableHead
              onClick={() => toggleSort('demandFrequency')}
              className="min-w-[90px] px-2 py-2 text-right font-semibold whitespace-nowrap cursor-pointer"
            >
              Demand{getArrow('demandFrequency')}
            </TableHead>

            {/* Category */}
            <TableHead
              onClick={() => toggleSort('category')}
              className="min-w-[80px] px-2 py-2 text-center font-semibold whitespace-nowrap cursor-pointer"
            >
              <span className="sm:hidden">Cat</span>
              <span className="hidden sm:inline">Category</span>
              {getArrow('category')}
            </TableHead>
          </TableRow>
        </TableHeader>

          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    {Array(6)
                      .fill(0)
                      .map((_, i) => (
                        <TableCell key={i} className="border-b px-2 py-2">
                          <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
                        </TableCell>
                      ))}
                  </TableRow>
                ))
              : sortedItems.map((item) => {
                  const threshold =
                    item.cumulativePct >= 95
                      ? '95'
                      : item.cumulativePct >= 80
                        ? '80'
                        : null;
                  const rowClass = [
                    threshold === '95'
                      ? 'bg-emerald-100'
                      : threshold === '80'
                        ? 'bg-amber-100'
                        : '',
                    hoveredCategory === item.abcCategoryType
                      ? 'ring-2 ring-primary/50'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <TableRow
                      key={item.rank + '-' + item.product.id}
                      className={rowClass}
                      onMouseEnter={() => {
                        onHoverThreshold?.(threshold);
                        onHoverCategory?.(item.abcCategoryType);
                      }}
                      onMouseLeave={() => {
                        onHoverThreshold?.(null);
                        onHoverCategory?.(null);
                      }}
                    >
                      <TableCell className="px-2 py-1 font-medium text-left">
                        {item.rank}
                      </TableCell>
                      <TableCell className="px-2 py-1 truncate text-left">
                        {item.product.name}
                      </TableCell>
                      <TableCell className="px-2 py-1 font-medium text-right">
                        {format(item.salesValue)}
                      </TableCell>
                      <TableCell className="px-2 py-1 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs">
                            {item.cumulativePct.toFixed(1)}%
                          </span>
                          <div className="w-full h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-blue-400 rounded-full"
                              style={{ width: `${item.cumulativePct}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-2 py-1 text-right">
                        {item.demandFrequency}
                      </TableCell>
                      <TableCell className="px-2 py-1 text-center">
                        <Badge
                          className={`${categoryColor[item.abcCategoryType]} text-white`}
                        >
                          {item.abcCategoryType}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}

            {/* Totals Row */}
            {!loading && (
              <TableRow className="font-semibold bg-background sticky bottom-0">
                <TableCell colSpan={2} className="text-right px-2">
                  Total
                </TableCell>
                <TableCell className="text-right px-2">
                  {format(summary.totalValue)}
                </TableCell>
                <TableCell colSpan={3} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AbcResultTable;
