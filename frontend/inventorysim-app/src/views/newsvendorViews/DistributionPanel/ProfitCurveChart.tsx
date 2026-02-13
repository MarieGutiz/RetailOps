import { batchNewsvendorSimulation } from "@/services/api/newsvendor.api";
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


const ProfitCurveChart = ({ request, simId, shopName, optimalQ }: Props) => {
    const [data, setData] = useState<{ q: number; profit: number }[]>([]);

    useEffect(() => {
        const minQ = Math.max(0, optimalQ - 30);
        const maxQ = optimalQ + 30;

        batchNewsvendorSimulation(request, simId, shopName, minQ, maxQ)
        .then((result) => {
            const formatted = Object.entries(result).map(([q, profit]) => ({
            q: Number(q),
            profit,
            }));

            // Optional: sort to guarantee order
            formatted.sort((a, b) => a.q - b.q);

            setData(formatted);
        })
        .catch(console.error);
    }, [request, simId, shopName, optimalQ]);

    return (
        <div className="h-[350px]">
        <h3 className="font-semibold mb-2">
            Expected Profit vs Order Quantity
        </h3>

        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="q" />
            <YAxis />
            <Tooltip />

            {/* Profit curve */}
            <Line
                type="monotone"
                dataKey="profit"
                stroke="#6366f1"
                dot={false}
            />

            {/* Highlight optimal Q */}
            <ReferenceLine
                x={optimalQ}
                stroke="red"
                strokeDasharray="4 4"
                label="Q*"
            />
            </LineChart>
        </ResponsiveContainer>
        </div>
    );

}

export default ProfitCurveChart