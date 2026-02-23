import type { NewsvendorRequest, NewsvendorResponse } from "@/types/newsvendor-backend";
import DemandPdfChart from "./DemandPdfChart";
import ProfitCurveChart from "./ProfitCurveChart";
import ProfitDistributionChart from "./ProfitDistributionChart";
import { Separator } from "@/components/ui/separator";
import ChartCard from "@/views/helpers/ChartCard";

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
    <div className="space-y-8">
      {/* Overview / Pitacora */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded shadow text-center">
          <h4 className="text-gray-500">Optimal Q</h4>
          <p className="text-xl font-bold">{optimalQ}</p>
        </div>
        <div className="p-4 bg-white rounded shadow text-center">
          <h4 className="text-gray-500">Expected Profit</h4>
          <p className="text-xl font-bold">{response.expectedProfit.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-white rounded shadow text-center">
          <h4 className="text-gray-500">Critical Ratio</h4>
          <p className="text-xl font-bold">{response.criticalRatio}</p>
        </div>
        <div className="p-4 bg-white rounded shadow text-center">
          <h4 className="text-gray-500">Std Dev</h4>
          <p className="text-xl font-bold">{request.stdDeviation}</p>
        </div>
      </div>

      {/* Charts with interlocution */}
      <ChartCard
        title="Profit Curve"
        description="Shows how profit varies with order quantity. The red line indicates the optimal order quantity."
      >
        <ProfitCurveChart request={request} simId={simId} shopName={shopName} optimalQ={optimalQ} />
      </ChartCard>

      <ChartCard
        title="Demand Probability Distribution"
        description="Visualizes the probability distribution of demand. Optimal order quantity balances the risk of overstock vs stockout."
      >
        <DemandPdfChart
          mean={request.meanDemand}
          stdDeviation={request.stdDeviation}
          optimalQ={optimalQ}
          simId={simId}
          criticalRatio={response.criticalRatio}
        />
      </ChartCard>

      <Separator />

      <ChartCard
        title="Profit Distribution"
        description="Displays the expected profit distribution for the optimal order quantity. Useful to understand variability and risk."
      >
        <ProfitDistributionChart request={request} optimalQ={optimalQ} simId={simId} shopName={shopName} />
      </ChartCard>
    </div>
  );


}

export default DistributionPanel