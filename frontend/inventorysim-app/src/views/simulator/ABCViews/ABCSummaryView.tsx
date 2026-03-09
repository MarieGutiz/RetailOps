import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ABCSummaryCard from './ABCSummaryCard';
import type { ABCDelta, ABCSummary } from '@/types/abc';

const ABCSummaryView = ({
  summary,
  deltas,
  hoveredCategory,
  onHover,
}: {
  summary: ABCSummary | null;
  deltas?: ABCDelta | null;
  hoveredCategory: 'A' | 'B' | 'C' | null;
  onHover: (category: 'A' | 'B' | 'C' | null) => void;
}) => {
  if (!summary) return null;

  return (
    <Card className="shadow-sm overflow-hidden">
      <CardHeader>
        <CardTitle>ABC Summary</CardTitle>
        <p className="text-sm text-muted-foreground">
          Inventory value concentration by ABC classification
        </p>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ABCSummaryCard
            label="A"
            delta={deltas?.A}
            data={summary.A}
            hoveredCategory={hoveredCategory}
            onHover={onHover}
          />
          <ABCSummaryCard
            label="B"
            delta={deltas?.B}
            data={summary.B}
            hoveredCategory={hoveredCategory}
            onHover={onHover}
          />
          <ABCSummaryCard
            label="C"
            delta={deltas?.C}
            data={summary.C}
            hoveredCategory={hoveredCategory}
            onHover={onHover}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ABCSummaryView;
