
import { fetchNormalPdf } from "@/services/api/newsvendor.api";
import { useEffect, useMemo, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  ReferenceArea,
  Area,
  Label,
} from "recharts";


interface Props {
  mean: number;
  stdDeviation: number;
  optimalQ: number;
  simId: string;
  criticalRatio: number;
}
type Mode = "PDF" | "CDF";

interface ChartPoint {
  demand: number;
  density: number;
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
   
      
  //   const [data, setData] = useState<
  //   {
  //     demand: number;
  //     density: number;
  //     safeZone: number;
  //     riskZone: number;
  //     cumulative: number;
  //   }[]
  // >([]);
    const [data, setData] = useState<ChartPoint[]>([]);

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
        const formatted = Object.entries(result).map(
          ([d, density]) => ({
            demand: Number(d),
            density: Number(density),
          })
        );

        setData(formatted);
      })
      .catch(console.error);
  }, [mean, stdDeviation, simId]);

  // Create shaded area up to optimalQ
  const shadedData = useMemo(() => {
    return data.map((point) => ({
      ...point,
      shadedDensity:
        point.demand <= optimalQ ? point.density : 0,
    }));
  }, [data, optimalQ]);
  console.log("optimalQ:", optimalQ);
  console.log("data range:", data[0]?.demand, "to", data[data.length - 1]?.demand);


  return (
    <div className="h-[350px]">
      <h3 className="font-semibold mb-2">
        Demand Distribution (Normal PDF)
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={shadedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="demand" />
          <YAxis />
          <Tooltip />

          {/* Shaded area under the bell up to Q* */}
          <Area
            type="monotone"
            dataKey="shadedDensity"
            fill="#3b82f6"
            fillOpacity={0.25}
            stroke="none"
          />

          {/*  Bell curve */}
          <Line
            type="monotone"
            dataKey="density"
            stroke="#10b981"
            dot={false}
          />

          <ReferenceLine x={mean} stroke="orange" label="Mean" />
          <ReferenceLine x={optimalQ} stroke="red" label="Q*" />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );



}

export default DemandPdfChart