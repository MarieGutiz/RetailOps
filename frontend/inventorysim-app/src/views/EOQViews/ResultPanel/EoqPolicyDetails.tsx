import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  result: any;
}

const EoqPolicyDetails: React.FC<Props> = ({ result }) => {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Inventory Policy Details</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground">Cycle Time</p>
          <p className="text-lg font-semibold">
            {result.cycleTime.toFixed(2)} time units
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Demand Rate</p>
          <p className="text-lg font-semibold">
            {result.demandRate.toFixed(2)} units/year
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Order Cost</p>
          <p className="text-lg font-semibold">
            € {result.orderCost.toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Holding Cost per Unit
          </p>
          <p className="text-lg font-semibold">
            € {result.holdingCostPerUnit.toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );

}

export default EoqPolicyDetails