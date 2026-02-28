import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { batchNewsvendorSimulation } from "@/services/api/newsvendor.api";
import { useApiErrorToast } from "@/services/api/useApiErrorToast";
import type { NewsvendorRequest } from "@/types/newsvendor-backend";
import Info from "@/views/helpers/Info";
import { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
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

const PROFIT_CURVE_INFO = {
  title: "Expected Profit Curve",
  description: `
This curve shows expected profit as a function of order quantity.

• The peak represents the optimal order quantity (Q*).
• The vertical dashed line marks Q*.
• The curve shape reflects underage vs overage tradeoffs.

Left of Q* → stockouts dominate.
Right of Q* → excess inventory dominates.
  `,
};


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

    const optimalPoint = useMemo(() => {
    return data.find((p) => p.q === Math.round(optimalQ));
  }, [data, optimalQ]);


    return (
    <Card className="h-[420px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="font-semibold">
          Expected Profit vs Order Quantity
        </h3>
        <Info content={PROFIT_CURVE_INFO} />
      </CardHeader>

      <CardContent className="flex-1">
        {loading && (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            Computing profit curve...
          </div>
        )}

        {error && (
          <div className="h-full flex items-center justify-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="q"
                type="number"
                label={{
                  value: "Order Quantity (Q)",
                  position: "insideBottom",
                  offset: -5,
                }}
              />

              <YAxis
                label={{
                  value: "Expected Profit",
                  angle: -90,
                  position: "insideLeft",
                }}
              />

              <Tooltip
                formatter={(value: number) => [
                  value.toLocaleString(),
                  "Expected Profit",
                ]}
                labelFormatter={(label) =>
                  `Order Quantity: ${label}`
                }
              />

              <Line
                type="monotone"
                dataKey="profit"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />

              <ReferenceLine
                x={optimalQ}
                stroke="red"
                strokeDasharray="4 4"
                label="Q*"
              />

              {optimalPoint && (
                <ReferenceDot
                  x={optimalPoint.q}
                  y={optimalPoint.profit}
                  r={6}
                  fill="red"
                  stroke="none"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            No simulation data available.
          </div>
        )}
      </CardContent>
    </Card>
    )


}

export default ProfitCurveChart