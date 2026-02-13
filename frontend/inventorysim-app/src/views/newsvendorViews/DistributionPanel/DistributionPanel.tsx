import type { NewsvendorRequest, NewsvendorResponse } from "@/types/newsvendor-backend";
import DemandPdfChart from "./DemandPdfChart";
import ProfitCurveChart from "./ProfitCurveChart";
import ProfitDistributionChart from "./ProfitDistributionChart";
import Ver from "./deterministicNormalPdf";

interface Props {
  response: NewsvendorResponse;
  request: NewsvendorRequest;
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

      <Ver />
      {/* <ProfitCurveChart
        request={request}
        simId={simId}
        shopName={shopName}
        optimalQ={optimalQ}
        />


        <DemandPdfChart
          mean={request.meanDemand}
          stdDeviation={request.stdDeviation}
          optimalQ={optimalQ}
          simId={simId}
          criticalRatio={response.criticalRatio}
      /> */}
     
      {/* <ProfitDistributionChart
        request={request}
        optimalQ={optimalQ}
        simId={simId}
        shopName={shopName}
      /> */}
    </div>
  );

}

export default DistributionPanel