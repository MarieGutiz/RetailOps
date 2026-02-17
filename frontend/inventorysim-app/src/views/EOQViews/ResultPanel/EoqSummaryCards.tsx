import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  result: any;
}

const EoqSummaryCards: React.FC<Props> = ({ result }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Optimal EOQ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-emerald-600">
            {result.eoq.toFixed(2)} units
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Total Annual Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            € {result.totalCost.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Orders per Year</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {result.numberOfOrders.toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


export default EoqSummaryCards