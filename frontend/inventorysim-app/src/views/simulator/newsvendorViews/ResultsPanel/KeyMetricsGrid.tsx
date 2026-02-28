import type { NewsvendorResponse } from "@/types/newsvendor-backend"
import MetricCard from "./MetricCard";

interface Props {
  result: NewsvendorResponse;
  format: (value: number) => string;
}


const KeyMetricsGrid = ({ result, format }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        label="Expected profit"
        value={format(result.expectedProfit ?? 0)}
      />

      <MetricCard
        label="Chance of meeting demand"
        value={`${Math.round((result.serviceLevel ?? 0) * 100)}%`}
        info="Probability that demand will be fully satisfied."
      />

      <MetricCard
        label="Service preference"
        value={`${Math.round((result.criticalRatio ?? 0) * 100)}%`}
        info="Balance between overstock and understock costs."
      />
    </div>
  );
}

export default KeyMetricsGrid