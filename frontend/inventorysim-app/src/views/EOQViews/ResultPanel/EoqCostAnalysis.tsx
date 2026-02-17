import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  result: any;
}

const EoqCostAnalysis: React.FC<Props> = ({ result }) => {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Cost Breakdown</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Ordering Cost</span>
          <span className="font-semibold">
            € {result.orderingCost.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Holding Cost</span>
          <span className="font-semibold">
            € {result.holdingCost.toFixed(2)}
          </span>
        </div>

        <div className="border-t pt-3 flex justify-between text-lg font-bold">
          <span>Total Cost</span>
          <span>€ {result.totalCost.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );

}

export default EoqCostAnalysis