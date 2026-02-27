
import { useMemo } from "react";
import { XAxis, YAxis, CartesianGrid, ReferenceLine, Area, Tooltip, ResponsiveContainer, AreaChart } from "recharts";
import jStat from "jstat";

interface Props {
  mean: number;
  std: number;
  serviceLevel: number;
}

const NormalServiceLevelChart = ({ mean, std, serviceLevel }: Props) => {

  const { data, Q, z } = useMemo(() => {
    if (!std || std <= 0) {
      return { data: [], Q: 0, z: 0 };
    }

    const zValue = jStat.normal.inv(serviceLevel, 0, 1);
    const orderQ = mean + zValue * std;

    const min = mean - 4 * std;
    const max = mean + 4 * std;
    const step = (max - min) / 250;

    const points = [];

    for (let x = min; x <= max; x += step) {
      const y = jStat.normal.pdf(x, mean, std);

      points.push({
        x,
        pdf: y,
        shaded: x <= orderQ ? y : null, // IMPORTANT: null not 0
      });
    }

    return { data: points, Q: orderQ, z: zValue };
  }, [mean, std, serviceLevel]);

  return (
    <div className="w-full max-w-md mx-auto" style={{ height: 220 }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" type="number" domain={["dataMin", "dataMax"]} />
          <YAxis />
          <Tooltip />

          {/* Shaded Service Level Area */}
          <Area
            type="monotone"
            dataKey="shaded"
            stroke="none"
            fill="#3b82f6"
            fillOpacity={0.35}
            isAnimationActive={false}
          />

          {/* Bell Curve Outline */}
          <Area
            type="monotone"
            dataKey="pdf"
            stroke="#111"
            fill="none"
            dot={false}
            isAnimationActive={false}
          />

          {/* Q vertical line */}
          <ReferenceLine
            x={Q}
            stroke="red"
          />

          {/* Mean line */}
          <ReferenceLine
            x={mean}
            stroke="orange"
          />

        </AreaChart>
      </ResponsiveContainer>

      <div className="text-sm mt-2">
        Z = {z.toFixed(3)} | Q = {Q.toFixed(2)} | Stockout = {(1 - serviceLevel).toFixed(3)}
      </div>
    </div>
  );

};


export default NormalServiceLevelChart