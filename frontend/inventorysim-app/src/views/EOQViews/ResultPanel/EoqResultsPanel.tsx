import type { EoqResponse } from "@/types/eoq-backend";
import EoqCostAnalysis from "./EoqCostAnalysis";
import EoqPolicyDetails from "./EoqPolicyDetails";
import EoqSummaryCards from "./EoqSummaryCards";

export interface EoqResultsPanelProps {
  result: EoqResponse
}

const EoqResultsPanel: React.FC<EoqResultsPanelProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="text-sm text-muted-foreground">
        No EOQ results available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EoqSummaryCards result={result} />
      <EoqPolicyDetails result={result} />
      <EoqCostAnalysis result={result} />
    </div>
  );
};


export default EoqResultsPanel