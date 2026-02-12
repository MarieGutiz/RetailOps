import { fetchProfitDistribution } from "@/services/api/newsvendor.api";
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


const ProfitDistributionChart = ({
  request,
  optimalQ,
  simId,
  shopName,
}: Props) => {
    const [data, setData] = useState<
    { profit: number; frequency: number }[]
  >([]);

  useEffect(() => {
    if (!request || optimalQ == null) return;

    fetchProfitDistribution(request, optimalQ, simId, shopName)
      .then((result) => {
        const formatted = Object.entries(result)
          .map(([profit, frequency]) => ({
            profit: Number(profit),
            frequency: Number(frequency),
          }))
          .sort((a, b) => a.profit - b.profit);

        setData(formatted);
      })
      .catch(console.error);
  }, [request, optimalQ, simId, shopName]);

  return (
    <div className="h-[350px]">
      <h3 className="font-semibold mb-2">
        Profit Distribution at Q*
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="profit" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => value.toLocaleString()}
            labelFormatter={(label) => `Profit: ${label}`}
          />

          <ReferenceLine
            x={0}
            stroke="red"
            strokeDasharray="4 4"
          />

          <Bar
            dataKey="frequency"
            fill="#8b5cf6"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );


}

export default ProfitDistributionChart