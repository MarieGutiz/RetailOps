import type {
  NewsvendorRequest,
  NewsvendorResponse,
} from '@/types/newsvendor-backend';
import DemandPdfChart from './DemandPdfChart';
import ProfitCurveChart from './ProfitCurveChart';
import ProfitDistributionChart from './ProfitDistributionChart';
import { Separator } from '@/components/ui/separator';
import ChartCard from '@/views/helpers/ChartCard';
import NewsvendorOverview from './NewsvendorOverview';

interface Props {
  response: NewsvendorResponse;
  request: NewsvendorRequest;
  simId: string;
  shopName: string;
}

const DistributionPanel = ({ response, request, simId, shopName }: Props) => {
  const optimalQ = response.optimalOrderQuantity;

  return (
    <div className="space-y-8">
      {/* Overview / Pitacora */}
      <NewsvendorOverview
        label="Simulation Overview"
        optimalQ={optimalQ}
        expectedProfit={response.expectedProfit}
        probabilityValue={response.criticalRatio}
        probabilityKind="criticalRatio"
        stdDeviation={request.stdDeviation}
      />

      {/* Charts with interlocution */}
      <ChartCard
        title="Profit Curve"
        description="Shows how profit varies with order quantity. The red line indicates the optimal order quantity."
      >
        <ProfitCurveChart
          request={request}
          simId={simId}
          shopName={shopName}
          optimalQ={optimalQ}
        />
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
        <ProfitDistributionChart
          request={request}
          optimalQ={optimalQ}
          simId={simId}
          shopName={shopName}
        />
      </ChartCard>
    </div>
  );
};

export default DistributionPanel;
