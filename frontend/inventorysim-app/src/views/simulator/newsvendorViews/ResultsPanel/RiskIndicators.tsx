import type { NewsvendorResponse } from "@/types/newsvendor-backend"
import RiskRow from "./RiskRow";


const RiskIndicators = ({result}: {result:NewsvendorResponse}) => {
  const stockoutRisk = 1 - result.serviceLevel;
  const overstockRisk = result.serviceLevel;

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <h3 className="text-sm font-medium">
        Risk overview
      </h3>

      <RiskRow
        label="Chance of running out of stock"
        value={`${Math.round(stockoutRisk * 100)}%`}
      />

      <RiskRow
        label="Chance of leftover stock"
        value={`${Math.round(overstockRisk * 100)}%`}
      />
    </div>
  );


}

export default RiskIndicators