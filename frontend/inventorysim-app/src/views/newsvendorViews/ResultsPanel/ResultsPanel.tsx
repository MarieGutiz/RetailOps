import type { NewsvendorResponse } from "@/types/newsvendor-backend"
import { toast } from "sonner"
import ResultsSummary from "./ResultsSummary";

interface ResultsPanelProps {
  result: NewsvendorResponse | null
}

const ResultsPanel = ({result}: ResultsPanelProps) => {
  if(!result)toast.error("An unexpected Error has occurred.");
  return (
     <div className="space-y-6">
      {result && <ResultsSummary result={result} />}
      </div>
  )
}

export default ResultsPanel