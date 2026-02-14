import { batchNewsvendorSimulation } from "@/services/api/newsvendor.api";
import { useApiErrorToast } from "@/services/api/useApiErrorToast";
import type { NewsvendorMarkersRequest, NewsvendorRequest } from "@/types/newsvendor-backend";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";


interface Props {
  request: NewsvendorRequest;
  simId: string;
  shopName: string;
  optimalQ: number;
}

interface ChartPoint {
  q: number;
  profit: number;
}

const ProfitCurveChart = ({ request, simId, shopName, optimalQ }: Props) => {
      const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Optional
  // const { toast } = useToast();

  useEffect(() => {
    if (!request || optimalQ == null) {
      setError("Missing simulation parameters.");
      return;
    }

    const minQ = Math.max(0, optimalQ - 30);
    const maxQ = optimalQ + 30;

    const loadCurve = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await batchNewsvendorSimulation(
          request,
          simId,
          shopName,
          minQ,
          maxQ
        );

        const formatted: ChartPoint[] = Object.entries(result)
          .map(([q, profit]) => ({
            q: Number(q),
            profit: Number(profit),
          }))
          .sort((a, b) => a.q - b.q);

        setData(formatted);
      } catch (err) {
        console.error(err);

        const message =
          "Unable to compute expected profit curve. Please try again.";

        setError(message);

        // Toast notification
        useApiErrorToast(error, "Simulator Error");
        
      } finally {
        setLoading(false);
      }
    };

    loadCurve();
  }, [request, simId, shopName, optimalQ]);

  return (
    <div className="h-[350px] flex flex-col">
      <h3 className="font-semibold mb-2">
        Expected Profit vs Order Quantity
      </h3>

      {/* Loading */}
      {loading && (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
          Computing profit curve...
        </div>
      )}

      {/* Error Panel */}
      {error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Chart */}
      {!loading && !error && data.length > 0 && (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="q" type="number" />

            <YAxis />

            <Tooltip
              formatter={(value: number) =>
                value.toLocaleString()
              }
              labelFormatter={(label) =>
                `Order Quantity: ${label}`
              }
            />

            {/* Profit curve */}
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#6366f1"
              dot={false}
              isAnimationActive={false}
            />

            {/* Optimal Q */}
            <ReferenceLine
              x={optimalQ}
              stroke="red"
              strokeDasharray="4 4"
              label="Q*"
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Empty state */}
      {!loading && !error && data.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
          No simulation data available.
        </div>
      )}
    </div>
  );


}

export default ProfitCurveChart