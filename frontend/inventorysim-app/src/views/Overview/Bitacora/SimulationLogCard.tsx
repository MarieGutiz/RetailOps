import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SimulationLogEntry } from "../hooks/useSimulationBitacora";
import MetricCard from "@/views/simulator/newsvendorViews/ResultsPanel/MetricCard";
import { useCurrency } from "@/views/simulator/newsvendorViews/forms/props/useCurrency";
import { Badge } from "@/components/ui/badge";

interface Props {
  entry: SimulationLogEntry;
}


const SimulationLogCard = ({ entry }: Props) => {
  const { format } = useCurrency();

  const getRiskColor = () => {
    if (entry.type === "abc") {
      const aPct = entry.data.summary.a.valuePct;
      if (aPct > 85) return "destructive";
      if (aPct > 75) return "secondary";
      return "default";
    }

    if (entry.type === "newsvendor") {
      const stockout = 1 - entry.data.serviceLevel;
      if (stockout > 0.15) return "destructive";
      if (stockout > 0.08) return "secondary";
      return "secondary";
    }

    return "default";
  };

  const renderMetrics = () => {
    switch (entry.type) {
      case "abc":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard
              label="A %"
              value={`${entry.data.summary.a.valuePct.toFixed(1)}%`}
              info="Revenue concentration in top category."
            />
            <MetricCard
              label="B %"
              value={`${entry.data.summary.b.valuePct.toFixed(1)}%`}
            />
            <MetricCard
              label="C %"
              value={`${entry.data.summary.c.valuePct.toFixed(1)}%`}
            />
            <MetricCard
              label="Total Value"
              value={format(entry.data.summary.totalValue)}
            />
          </div>
        );

      case "eoq":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <MetricCard
              label="Optimal Q"
              value={`${Math.round(entry.data.eoq)} units`}
              info="Cost-minimizing order quantity."
            />
            <MetricCard
              label="Total Cost"
              value={format(Number(entry.data.totalCost.toFixed(2)))}
            />
          </div>
        );

      case "newsvendor":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <MetricCard
              label="Service Level"
              value={`${(entry.data.serviceLevel * 100).toFixed(1)}%`}
              info="Probability of not stocking out."
            />
            <MetricCard
              label="Expected Profit"
              value={format(Number(entry.data.expectedProfit.toFixed(2)))}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const cap = () => {
    switch (entry.type) {
      case "abc":
        return "ABC";
      case "eoq":
        return "EOQ";
      case "newsvendor":
        return "Newsvendor";
      default:
        return "";
    }
  };

  return (
    <div className="relative pl-4 sm:pl-8 md:pl-10">
      {/* Timeline dot */}
      <span className="absolute left-0 top-6 h-3 w-3 rounded-full bg-amber-500" />

      <Card className="mb-4 sm:mb-6 shadow-sm hover:shadow-md transition">
      <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col">
          <CardTitle className="capitalize text-sm sm:text-base">
            {cap()} Simulation
          </CardTitle>

          {(entry.type === "eoq" || entry.type === "newsvendor") && (
            <div className="text-xs text-muted-foreground flex flex-col">
              <span>
                {entry.product}
              </span>
              <span className="font-mono text-[11px] text-muted-foreground/80">
                SKU: {entry.sku}
              </span>
            </div>
          )}

        </div>

        <Badge variant={getRiskColor()}>
          {entry.type.toUpperCase()}
        </Badge>
      </CardHeader>

        <CardContent className="space-y-3 sm:space-y-4">
          <div className="text-xs text-muted-foreground">
            {new Date(entry.createdAt).toLocaleString()}
          </div>

          {renderMetrics()}
        </CardContent>
      </Card>
    </div>
  
    );


}

export default SimulationLogCard