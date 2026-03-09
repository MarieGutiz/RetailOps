import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { EoqResponse } from '@/types/eoq-backend';

interface Props {
  result: EoqResponse;
  format: (value: number) => string;
}

const EoqCostAnalysis: React.FC<Props> = ({ result, format }) => {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Cost Breakdown</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Ordering Cost</span>
          <span className="font-semibold">
            {format(result.orderingCost ?? 0)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Holding Cost</span>
          <span className="font-semibold">
            {format(result.holdingCostTotal ?? 0)}
          </span>
        </div>

        <div className="border-t pt-3 flex justify-between text-lg font-bold">
          <span>Total Cost</span>
          <span>{format(result.totalCost ?? 0)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default EoqCostAnalysis;
