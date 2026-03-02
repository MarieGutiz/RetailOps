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
  optimalQuantity: number;
  points: {
    quantity: number;
    orderingCost: number;
    holdingCost: number;
    totalCost: number;
  }[];
}

const EOQCostCurveChart = ({ optimalQuantity, points }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={points}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="quantity" />
        <YAxis />
        <Tooltip />

        <Line
          type="monotone"
          dataKey="orderingCost"
          name="Ordering Cost"
          stroke="#2563eb"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="holdingCost"
          name="Holding Cost"
          stroke="#16a34a"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="totalCost"
          name="Total Cost"
          stroke="#dc2626"
          strokeWidth={2}
          dot={false}
        />

        <ReferenceLine
          x={optimalQuantity}
          stroke="#f59e0b"
          strokeDasharray="5 5"
          label="Q*"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EOQCostCurveChart;