import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EoqResponse } from "@/types/eoq-backend";
import { formatDecimal, formatInt } from "@/views/simulator/newsvendorViews/forms/props/useCurrency";

interface Props {
  result: EoqResponse;
  format: (value: number) => string;
}

const EoqPolicyDetails: React.FC<Props> = ({ result, format }) => {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Inventory Policy Details</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground">Cycle Time</p>
          <p className="text-lg font-semibold">
            {formatDecimal(result.cycleTime)} years
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Demand</p>
          <p className="text-lg font-semibold">
            {formatInt(result.demand)} units/year
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Setup Cost</p>
          <p className="text-lg font-semibold">
            {format(result.setupCost ?? 0)}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Holding Cost per Unit
          </p>
          <p className="text-lg font-semibold">
            {format(result.holdingCost ?? 0)}
          </p>
        </div>
      </CardContent>
    </Card>
  );


}

export default EoqPolicyDetails