import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ReferenceLine } from "recharts";
import { useNormalDistributionData } from "@/hooks/simulator/modules/newsvendors/hooks/useNormalDistributionData";
interface Props {
  mean: number;
  std: number;
  serviceLevel: number;
}

const WIDTH = 650;
const HEIGHT = 320;

const DemandRiskReportChart = ({
  mean,
  std,
  serviceLevel,
}: Props) => {
  const { data, Q, z } = useNormalDistributionData(
    mean,
    std,
    serviceLevel
  );

  if (!data.length) {
    return null;
  }

  return (
    <div
      style={{
        width: WIDTH,
        background: "white",
        padding: "16px",
      }}
    >
      <AreaChart
        width={WIDTH}
        height={HEIGHT}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="x"
          type="number"
          domain={["dataMin", "dataMax"]}
        />

        <YAxis />

        {/* Overstock Risk Area */}
        <Area
          type="monotone"
          dataKey="leftArea"
          stroke="none"
          fill="#3b82f6"
          fillOpacity={0.35}
          isAnimationActive={false}
        />

        {/* Stockout Risk Area */}
        <Area
          type="monotone"
          dataKey="rightArea"
          stroke="none"
          fill="#ef4444"
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

        {/* Optimal Q */}
        <ReferenceLine
          x={Q}
          stroke="black"
          strokeDasharray="4 4"
        />

        {/* Mean */}
        <ReferenceLine
          x={mean}
          stroke="orange"
        />
      </AreaChart>

      <div style={{ fontSize: 14, marginTop: 12 }}>
        <strong>Service Level:</strong> {(serviceLevel * 100).toFixed(2)}%  
        &nbsp;|&nbsp;
        <strong>Z:</strong> {z.toFixed(3)}  
        &nbsp;|&nbsp;
        <strong>Optimal Q:</strong> {Q.toFixed(2)}
      </div>
    </div>
  );
}
export default DemandRiskReportChart;