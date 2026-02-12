import { fetchNormalPdf } from "@/services/api/newsvendor.api";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";


interface Props {
  mean: number;
  stdDeviation: number;
  optimalQ: number;
  simId: string;
}

const DemandPdfChart = ({ mean, stdDeviation, optimalQ, simId }: Props) => {
    const [data, setData] = useState<{ demand: number; density: number }[]>([]);
   /**
    * Under examination
    * ±1σ → 68%

      ±2σ → 95%

      ±3σ → 99.7%

      ±4σ → basically everything except 
    */
    useEffect(() => {
    if (!mean || !stdDeviation || stdDeviation <= 0) return;

    const min = mean - 4 * stdDeviation;
    const max = mean + 4 * stdDeviation;
    const step = (max - min) / 100;

    fetchNormalPdf(
      {
        mean,
        stdDev: stdDeviation,
        min,
        max,
        step,
      },
      simId
    )
      .then((result) => {
        const formatted = Object.entries(result).map(([d, density]) => ({
          demand: Number(d),
          density: Number(density),
        }));

        setData(formatted);
      })
      .catch(console.error);
  }, [mean, stdDeviation, simId]);


    return (
      <div className="h-[350px]">
        <h3 className="font-semibold mb-2">Demand Distribution (Normal PDF)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="demand" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="density" stroke="#10b981" />
            <ReferenceLine x={mean} stroke="orange" label="Mean" />
            <ReferenceLine x={optimalQ} stroke="red" label="Q*" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );

}

export default DemandPdfChart