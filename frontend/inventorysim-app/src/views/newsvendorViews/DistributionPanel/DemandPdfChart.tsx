
import { fetchNormalPdf } from "@/services/api/newsvendor.api";
import { useApiErrorToast } from "@/services/api/useApiErrorToast";
import { useEffect, useMemo, useState } from "react";

import {
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Area,
} from "recharts";


interface Props {
  mean: number;
  stdDeviation: number;
  optimalQ: number;
  simId: string;
  criticalRatio: number;
}

interface ChartPoint {
  demand: number;
  density: number;
  shadedDensity?: number;
}



const DemandPdfChart = ({ 
    mean,
    stdDeviation,
    optimalQ,
    simId,
    criticalRatio }: Props) => {

      /**
    * Under examination
    * ±1σ → 68%

      ±2σ → 95%

      ±3σ → 99.7%

      ±4σ → basically everything except 
    */
   
      
  const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mean || !stdDeviation || stdDeviation <= 0) {
      setError("Invalid distribution parameters.");
      return;
    }

    // const min = mean - 4 * stdDeviation;
    // const max = mean + 4 * stdDeviation;
    // const step = (max - min) / 100;
    const min = Math.floor(mean - 4 * stdDeviation);
    const max = Math.ceil(mean + 4 * stdDeviation);
    const step = 1; // integer demand


    const loadPdf = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchNormalPdf(
          {
            mean,
            stdDev: stdDeviation,
            min,
            max,
            step,
          },
          simId
        );

        const formatted: ChartPoint[] = Object.entries(result)
        .map(([d, density]) => ({
          demand: Math.round(Number(d)), // enforce integer
          density: Number(density),
        }))
        .sort((a, b) => a.demand - b.demand);


        setData(formatted);
      } catch (err) {
        console.error(err);

        const message =
          "Unable to load demand distribution. Please try again.";

        setError(message);

      // Toast notification
      useApiErrorToast(error, "Simulator Error");
      } finally {
        setLoading(false);
      }
    };

    loadPdf();
  }, [mean, stdDeviation, simId]);

  // Shading up to optimalQ
  const shadedData = useMemo(() => {
  const qInt = Math.floor(optimalQ);

  return data.map((point) => ({
    ...point,
    shadedDensity:
      point.demand <= qInt
        ? point.density
        : null,
      }));
    }, [data, optimalQ]);


  return (
  <div className="w-full space-y-4">

    {/* Title */}
    <div>
      <h3 className="font-semibold text-base sm:text-lg">
        Demand Distribution (Normal PDF)
      </h3>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
        Normal distribution of demand. Area shaded represents probability of demand ≤ Q*.
      </p>
    </div>

    {/* Loading */}
    {loading && (
      <div className="h-[240px] flex items-center justify-center text-sm text-muted-foreground">
        Computing normal distribution...
      </div>
    )}

    {/* Error */}
    {error && (
      <div className="h-[240px] flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      </div>
    )}

    {/* Chart */}
    {!loading && !error && shadedData.length > 0 && (
      <div className="w-full">
        <ResponsiveContainer width="100%" aspect={2}>
          <AreaChart
            data={shadedData}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="demand"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={(v) => Math.round(v).toString()}
              tick={{ fontSize: 10 }}
            />

            <YAxis
              type="number"
              tick={{ fontSize: 10 }}
              width={40}
            />

            <Tooltip
              formatter={(value: number, name: string) => {
                const labelMap: Record<string, string> = {
                  density: "Probability Density",
                  shadedDensity: "Cumulative Area (≤ Q*)",
                };
                return [value.toFixed(5), labelMap[name] || name];
              }}
              labelFormatter={(label) =>
                `Demand: ${Math.round(Number(label))} units`
              }
            />

            {/* Shaded area */}
            <Area
              type="monotone"
              dataKey="shadedDensity"
              stroke="none"
              fill="#3b82f6"
              fillOpacity={0.25}
              isAnimationActive={false}
            />

            {/* Full PDF curve */}
            <Area
              type="monotone"
              dataKey="density"
              stroke="#10b981"
              fill="none"
              dot={false}
              isAnimationActive={false}
            />

            {/* Reference lines */}
            <ReferenceLine
              x={Math.round(mean)}
              stroke="orange"
            />

            <ReferenceLine
              x={Math.floor(optimalQ)}
              stroke="red"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )}

    {/* Empty */}
    {!loading && !error && shadedData.length === 0 && (
      <div className="h-[240px] flex items-center justify-center text-sm text-muted-foreground">
        No distribution data available.
      </div>
    )}
  </div>
);


}

export default DemandPdfChart