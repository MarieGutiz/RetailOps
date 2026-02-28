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
  <div className="w-full space-y-4">

    {/* Title */}
    <div>
      <h3 className="font-semibold text-base sm:text-lg">
        Profit Distribution at Q* = {optimalQ}
      </h3>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
        Distribution of simulated profits from {request.simulationRuns} Monte Carlo runs.
      </p>
    </div>

    {/* Loading */}
    {loading && (
      <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">
        Running Monte Carlo simulation...
      </div>
    )}

    {/* Error */}
    {error && (
      <div className="h-[260px] flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      </div>
    )}

    {/* Chart */}
    {!loading && !error && data.length > 0 && (
      <>
        <div className="w-full">
          <ResponsiveContainer width="100%" aspect={1.8}>
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="profit"
                type="number"
                domain={["dataMin", "dataMax"]}
                tickFormatter={(v) => v.toLocaleString()}
                tick={{ fontSize: 10 }}
              />

              <YAxis
                tickFormatter={(v) => (v * 100).toFixed(0) + "%"}
                tick={{ fontSize: 10 }}
                width={40}
              />

              <Tooltip
                formatter={(value: number) =>
                  (value * 100).toFixed(2) + "%"
                }
                labelFormatter={(label) =>
                  `Profit: ${Number(label).toLocaleString()}`
                }
              />

              <ReferenceLine
                x={0}
                stroke="red"
                strokeDasharray="4 4"
              />

              {expectedProfit !== null && (
                <ReferenceLine
                  x={expectedProfit}
                  stroke="blue"
                  strokeDasharray="4 4"
                />
              )}

              <Bar
                dataKey="frequency"
                fill="#8b5cf6"
                isAnimationActive={false}
                barSize={6}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Info Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-700">
          {expectedProfit !== null && (
            <div>
              <strong>Expected Profit:</strong>{" "}
              {expectedProfit.toFixed(2)}
            </div>
          )}

          {probabilityOfLoss !== null && (
            <div>
              <strong>Probability of Loss:</strong>{" "}
              {(probabilityOfLoss * 100).toFixed(2)}%
            </div>
          )}

          {minProfit !== null && maxProfit !== null && (
            <div>
              <strong>Profit Range:</strong>{" "}
              {minProfit.toFixed(2)} to {maxProfit.toFixed(2)}
            </div>
          )}

          {variance !== null && (
            <div>
              <strong>Variance:</strong>{" "}
              {variance.toFixed(2)}
            </div>
          )}
        </div>

        <div className="text-[11px] sm:text-xs text-muted-foreground">
          Demand sampled from Normal(μ={request.meanDemand}, σ={request.stdDeviation})
          across {request.simulationRuns} simulations.
        </div>
      </>
    )}

    {/* Empty */}
    {!loading && !error && data.length === 0 && (
      <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">
        No simulation data available.
      </div>
    )}
  </div>
);




}

export default ProfitDistributionChart