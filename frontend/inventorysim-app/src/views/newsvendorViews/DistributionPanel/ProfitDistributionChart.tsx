import { fetchProfitDistribution } from "@/services/api/newsvendor.api";
import { useApiErrorToast } from "@/services/api/useApiErrorToast";
import type { NewsvendorRequest } from "@/types/newsvendor-backend";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";


interface Props {
  request: NewsvendorRequest;
  optimalQ: number;
  simId: string;
  shopName: string;
}


interface ChartPoint {
  profit: number;
  frequency: number; // normalized probability (0-1)
}



const ProfitDistributionChart = ({
  request,
  optimalQ,
  simId,
  shopName,
}: Props) => {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [expectedProfit, setExpectedProfit] = useState<number | null>(null);
  const [probabilityOfLoss, setProbabilityOfLoss] = useState<number | null>(null);
  const [minProfit, setMinProfit] = useState<number | null>(null);
  const [maxProfit, setMaxProfit] = useState<number | null>(null);
  const [variance, setVariance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!request || optimalQ == null) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchProfitDistribution(
          request,
          optimalQ,
          simId,
          shopName
        );

        // Normalize histogram to frequency (0-1)
        const totalRuns = Object.values(result.histogram).reduce((a, b) => a + b, 0);
        const chartData: ChartPoint[] = Object.entries(result.histogram)
          .map(([profit, freq]) => ({
            profit: Number(profit),
            frequency: Number(freq) / totalRuns,
          }))
          .sort((a, b) => a.profit - b.profit);

        setData(chartData);
        setExpectedProfit(result.expectedProfit);
        setProbabilityOfLoss(result.probabilityOfLoss);
        setMinProfit(result.minProfit);
        setMaxProfit(result.maxProfit);
        setVariance(result.variance);
      } catch (err) {
        console.error(err);
        const message = "Unable to load profit distribution. Please try again.";
        setError(message);
        useApiErrorToast(message, "Simulator Error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [request, optimalQ, simId, shopName]);

  return (
    <div className="h-[450px] flex flex-col">
      <h3 className="font-semibold mb-2">Profit Distribution at Q* = {optimalQ}</h3>

      {/* Explanation */}
      <p className="text-sm text-gray-600 mb-2">
        This histogram shows the distribution of profits from <strong>{request.simulationRuns}</strong> Monte Carlo simulations.
        Each bar represents a profit bucket, and the height (frequency) shows the proportion of simulations that ended in that range.
        Red bars indicate losses (profit &lt; 0), purple bars indicate positive profits. Reference lines show break-even (0) and expected profit.
      </p>

      {/* Loading */}
      {loading && (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
          Running Monte Carlo simulation...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Chart */}
      {!loading && !error && data.length > 0 && (
        <>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
             data={data}
             margin={{ top: 10, right: 20, left: 40, bottom: 20 }}
             >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="profit"
                type="number"
                domain={["dataMin", "dataMax"]}
                tickFormatter={(v) => v.toLocaleString()}
                label={{ value: "Profit ($)", position: "insideBottom", offset: -5 }}
              />

              <YAxis
                tickFormatter={(v) => (v * 100).toFixed(1) + "%"}
                label={{ value: "Frequency (%)", angle: -90, position: "insideLeft", offset: 0 }}
              />

              <Tooltip
                formatter={(value: number) => (value * 100).toFixed(2) + "%"}
                labelFormatter={(label) => `Profit: ${label}`}
              />

              {/* Reference lines */}
              <ReferenceLine x={0} stroke="red" strokeDasharray="4 4" label="Break Even" />
              {expectedProfit !== null && (
                <ReferenceLine
                x={expectedProfit}
                stroke="blue"
                strokeDasharray="4 4"
                label={{
                  value: "Expected Profit",
                  position: "insideTopRight",
                  fill: "blue",
                  fontSize: 12,
                }}
              />
              )}

              {/* Histogram bars */}
              <Bar dataKey="frequency" barSize={8} fill="#8b5cf6" isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>

          {/* Info panel */}
          <div className="text-sm mt-2 text-gray-700 space-y-1">
            {expectedProfit !== null && <div><strong>Expected Profit:</strong> {expectedProfit.toFixed(2)}</div>}
            {probabilityOfLoss !== null && <div><strong>Probability of Loss:</strong> {(probabilityOfLoss * 100).toFixed(2)}%</div>}
            {minProfit !== null && maxProfit !== null && (
              <div><strong>Profit Range:</strong> {minProfit.toFixed(2)} to {maxProfit.toFixed(2)}</div>
            )}
            {variance !== null && <div><strong>Variance:</strong> {variance.toFixed(2)}</div>}
            <div className="text-xs text-gray-500">
              Frequencies are obtained by repeating the Monte Carlo simulation {request.simulationRuns} times,
              sampling demand from a normal distribution with mean {request.meanDemand} and std deviation {request.stdDeviation}.
            </div>
          </div>
        </>
      )}

      {/* Empty */}
      {!loading && !error && data.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
          No simulation data available.
        </div>
      )}
    </div>
  );




}

export default ProfitDistributionChart