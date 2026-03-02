import type { NewsvendorResponse } from "@/types/newsvendor-backend"
import { toast } from "sonner"
import ResultsSummary from "./ResultsSummary";
import KeyMetricsGrid from "./KeyMetricsGrid";
import RiskIndicators from "./RiskIndicators";
import { useCurrency } from "../forms/hooks/useCurrency";

interface ResultsPanelProps {
  result: NewsvendorResponse | null
}

const ResultsPanel = ({result}: ResultsPanelProps) => {
  if(!result)toast.error("An unexpected Error has occurred.");
  const { format } = useCurrency();
  
  return (
     <div className="space-y-6">
      {result && <ResultsSummary result={result} format={format} />}

      {result && <KeyMetricsGrid result={result} format={format} />}
      
      {result &&<RiskIndicators result={result} />}

      </div>
  )
}

export default ResultsPanel