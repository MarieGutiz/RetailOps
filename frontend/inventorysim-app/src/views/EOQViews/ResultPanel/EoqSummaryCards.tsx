import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EoqResponse } from "@/types/eoq-backend";
import { useCurrency } from "@/views/newsvendorViews/forms/props/useCurrency";

interface Props {
  result: EoqResponse;
}

// const formatNumber = (value: number, digits = 2) =>
//   value.toFixed(digits);

const EoqSummaryCards: React.FC<Props> = ({ result }) => {
  const { format } = useCurrency();

  // safe formatting: defaults to 0 if undefined
  const formatNumber = (value?: number, digits = 2) =>
    (value ?? 0).toFixed(digits);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* EOQ */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Optimal EOQ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-emerald-600">
            {formatNumber(result.eoq)} units
          </div>
        </CardContent>
      </Card>

      {/* Total Annual Cost */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Total Annual Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {format(result.totalCost ?? 0)}
          </div>
        </CardContent>
      </Card>

      {/* Orders Per Year */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Orders per Year</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {formatNumber(result.numberOfOrders)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};



export default EoqSummaryCards