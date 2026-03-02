import type { EoqResponse } from "@/types/eoq-backend";
import EoqCostAnalysis from "./EoqCostAnalysis";
import EoqPolicyDetails from "./EoqPolicyDetails";
import EoqSummaryCards from "./EoqSummaryCards";
import { useCurrency } from "@/views/simulator/newsvendorViews/forms/hooks/useCurrency";

export interface EoqResultsPanelProps {
  result: EoqResponse
}

const EoqResultsPanel: React.FC<EoqResultsPanelProps> = ({ result }) => {
    const { format } = useCurrency();

  if (!result) {
    return (
      <div className="text-sm text-muted-foreground">
        No EOQ results available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EoqSummaryCards result={result} format={format} />
      <EoqPolicyDetails result={result} format={format} />
      <EoqCostAnalysis result={result} format={format} />
    </div>
  );
};


export default EoqResultsPanel