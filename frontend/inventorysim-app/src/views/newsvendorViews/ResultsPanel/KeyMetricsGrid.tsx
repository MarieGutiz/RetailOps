import type { NewsvendorResponse } from "@/types/newsvendor-backend"
import MetricCard from "./MetricCard";
import { useCurrency } from "../forms/props/useCurrency";

const KeyMetricsGrid = ({ result }: { result: NewsvendorResponse }) => {
    //Currency
      const { format } = useCurrency();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        label="Expected profit"
        value={format(result.expectedProfit)}
      />

      <MetricCard
        label="Chance of meeting demand"
        value={`${Math.round(result.serviceLevel * 100)}%`}
        info="Probability that demand will be fully satisfied."
      />

      <MetricCard
        label="Service preference"
        value={`${Math.round(result.criticalRatio * 100)}%`}
        info="Balance between overstock and understock costs."
      />
    </div>
  );

}

export default KeyMetricsGrid