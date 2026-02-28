
import { XAxis, YAxis, CartesianGrid, ReferenceLine, Area, Tooltip, ResponsiveContainer, AreaChart } from "recharts";
import { useNormalDistributionData } from "@/hooks/simulator/modules/newsvendors/hooks/useNormalDistributionData";

interface Props {
  mean: number;
  std: number;
  serviceLevel: number;
}

const NormalServiceLevelChart = ({ 
  mean,
  std,
  serviceLevel }: Props) => {

  const { data, Q, z } = useNormalDistributionData(
    mean,
    std,
    serviceLevel
  );

  if (!data.length) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto" style={{ height: 220 }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="x"
            type="number"
            domain={["dataMin", "dataMax"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Tooltip />

          {/* Shaded Service Level Area */}
          <Area
            type="monotone"
            dataKey="leftArea"
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
          <ReferenceLine x={Q} stroke="red" />

          {/* Mean line */}
          <ReferenceLine x={mean} stroke="orange" />
        </AreaChart>
      </ResponsiveContainer>

      <div className="text-sm mt-2">
        Z = {z.toFixed(3)} | Q = {Q.toFixed(2)} | Stockout ={" "}
        {(1 - serviceLevel).toFixed(3)}
      </div>
    </div>
  );

};


export default NormalServiceLevelChart

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: number;
}

const CustomTooltip = ({
  active,
  payload,
}: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const point = payload[0].payload;

  const demand = point.x;
  const density = point.pdf;

  return (
    <div className="bg-white border rounded-md shadow-md p-3 text-sm">
      <div className="font-medium mb-1">
        Demand: {demand.toFixed(2)}
      </div>

      <div>
        Density: {density.toFixed(5)}
      </div>
    </div>
  );
};