import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface EOQOverviewCardProps {
  label: string;
  eoq: number;
  totalCost: number;
  orderingCostComponent: number;
  holdingCostComponent: number;
  ordersPerYear: number;
  cycleTime: number;
  comparison?: {
    eoq?: number;
    totalCost?: number;
    orderingCostComponent?: number;
    holdingCostComponent?: number;
    ordersPerYear?: number;
    cycleTime?: number;
  };
  isBaseline?: boolean; // new prop to mark historical card
}

const EOQOverviewCard = ({
  label,
  eoq,
  totalCost,
  orderingCostComponent,
  holdingCostComponent,
  ordersPerYear,
  cycleTime,
  comparison,
  isBaseline = false,
}: EOQOverviewCardProps) => {
  const diffBadge = (oldVal?: number, newVal?: number) => {
    if (oldVal === undefined || newVal === undefined) return null;
    const diffPercent = ((oldVal - newVal) / oldVal) * 100;
    const isPositive = diffPercent > 0;
    return (
      <span
        className={`ml-2 px-2 py-0.5 text-xs rounded-full font-semibold ${
          isPositive ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
        }`}
      >
        {isPositive ? "↓" : "↑"} {Math.abs(diffPercent).toFixed(1)}%
      </span>
    );
  };

  return (
    <Card className={`shadow-sm relative ${isBaseline ? "bg-gray-50" : ""}`}>
      {/* Top-right badge for baseline */}
      {isBaseline && (
        <div className="absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
          Baseline
        </div>
      )}

      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg font-semibold">{label}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        {/* Core Metrics */}
        <div className="space-y-1">
          <p>
            <span className="font-medium">EOQ:</span> {eoq.toFixed(2)}
            {diffBadge(comparison?.eoq, eoq)}
          </p>
          <p>
            <span className="font-medium">Total Annual Cost:</span> {totalCost.toFixed(2)}
            {diffBadge(comparison?.totalCost, totalCost)}
          </p>
        </div>

        <Separator />

        {/* Cost Components */}
        <div className="space-y-1">
          <p>
            Ordering Cost: {orderingCostComponent.toFixed(2)}
            {diffBadge(comparison?.orderingCostComponent, orderingCostComponent)}
          </p>
          <p>
            Holding Cost: {holdingCostComponent.toFixed(2)}
            {diffBadge(comparison?.holdingCostComponent, holdingCostComponent)}
          </p>
        </div>

        <Separator />

        {/* Operational Metrics */}
        <div className="space-y-1">
          <p>
            Orders / Year: {ordersPerYear.toFixed(2)}
            {diffBadge(comparison?.ordersPerYear, ordersPerYear)}
          </p>
          <p>
            Cycle Time (years): {cycleTime.toFixed(3)}
            {diffBadge(comparison?.cycleTime, cycleTime)}
          </p>
        </div>
      </CardContent>
    </Card>
  );

}

export default EOQOverviewCard