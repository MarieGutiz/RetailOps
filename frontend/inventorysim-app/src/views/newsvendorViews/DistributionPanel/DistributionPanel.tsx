import type { NewsvendorMarkers, NewsvendorRequest, NewsvendorResponse } from "@/types/newsvendor-backend";
import DemandPdfChart from "./DemandPdfChart";
import ProfitCurveChart from "./ProfitCurveChart";
import ProfitDistributionChart from "./ProfitDistributionChart";

interface Props {
  response: NewsvendorResponse;
  request: NewsvendorRequest;
  pdf: Record<number, number> | null;
  simId: string;
  shopName: string;

}

const DistributionPanel = ({
    response,
    request,
    simId,
    shopName
}: Props) => {
  const optimalQ = response.optimalOrderQuantity;

  return (
    <div className="space-y-10">
      <ProfitCurveChart
        request={{
          meanDemand: request.meanDemand,
          orderQuantity: optimalQ,
          criticalRatio: response.criticalRatio,
        }}
        simId={simId}
        shopName={shopName}
        optimalQ={optimalQ}
      />

        <DemandPdfChart
        mean={request.meanDemand}
        stdDeviation={request.stdDeviation}
        optimalQ={optimalQ}
        simId={simId}
      />
     
      <ProfitDistributionChart
        request={request}
        optimalQ={optimalQ}
        simId={simId}
        shopName={shopName}
      />
    </div>
  );

}

export default DistributionPanel