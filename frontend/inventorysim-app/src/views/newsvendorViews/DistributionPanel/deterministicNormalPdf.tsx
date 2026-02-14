import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";

interface Props {
  mean: number;
  stdDeviation: number;
  optimalQ: number;
}

interface ChartPoint {
  demand: number;
  density: number;
}

// Deterministic normal PDF
const deterministicNormalPdf = (
  mean: number,
  stdDev: number,
  min: number,
  max: number,
  step: number
) => {
  const points: ChartPoint[] = [];
  const factor = 1 / (stdDev * Math.sqrt(2 * Math.PI));

  for (let x = min; x <= max; x += step) {
    const z = (x - mean) / stdDev;
    const density = factor * Math.exp(-0.5 * z * z);
    points.push({ demand: Number(x.toFixed(2)), density });
  }
  return points;
};

export const DemandPdfChartDemo = ({ mean, stdDeviation, optimalQ }: Props) => {
  const data = useMemo(() => {
    const min = mean - 4 * stdDeviation;
    const max = mean + 4 * stdDeviation;
    const step = (max - min) / 100;

    return deterministicNormalPdf(mean, stdDeviation, min, max, step);
  }, [mean, stdDeviation]);

  // Filter points for shading under Q*
  const shadedData = useMemo(() => data.map(p => ({
    demand: p.demand,
    shaded: p.demand <= optimalQ ? p.density : 0, // zero after Q*
    density: p.density,
  })), [data, optimalQ]);

  return (
    <div className="h-[350px] w-full">
      <h3 className="font-semibold mb-2">Deterministic Demand Distribution</h3>
      <AreaChart
        data={shadedData}
        width={700}
        height={300}
        margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
        >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="demand" type="number"/>
        <YAxis />
        <Tooltip />

        {/* Shaded area up to optimalQ */}
        <Area
            type="monotone"
            dataKey="shaded"
            fill="#3b82f6"
            fillOpacity={0.25}
            stroke="none"
        />

        {/* Full bell curve */}
        {/* <Area type="monotone" dataKey="density" stroke="#10b981" fill="none" dot={false} /> */}
            {/* <Area type="monotone" dataKey="shaded" fill="#3b82f6" fillOpacity={0.25} stroke="none" /> */}
            <Area type="monotone" dataKey="density" stroke="#10b981" fill="none" dot={true} />

            <ReferenceLine x={mean} stroke="orange" label="Mean" isFront={true} />
            <ReferenceLine x={optimalQ} stroke="red" label="Q*" isFront={true} />
        </AreaChart>

    </div>
  );
};

// Example usage
export default function Ver() {
  return (
    <div className="p-4">
      <DemandPdfChartDemo mean={50} stdDeviation={10} optimalQ={60} />
    </div>
  );
}
