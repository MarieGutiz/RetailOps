import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EoqResponse } from "@/types/eoq-backend";

interface Props {
  result: EoqResponse;
}
//Fix
//Uncaught TypeError: Cannot read properties of undefined (reading 'toFixed')
//    at EoqPolicyDetails (EoqPolicyDetails.tsx:25:32)
//{result.demandRate.toFixed(2)} units/year


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
            {result.demand.toFixed(2)} units/year
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Order Cost</p>
          <p className="text-lg font-semibold">
            € {result.setupCost.toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Holding Cost per Unit
          </p>
          <p className="text-lg font-semibold">
            € {result.holdingCost.toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );

}

export default EoqPolicyDetails