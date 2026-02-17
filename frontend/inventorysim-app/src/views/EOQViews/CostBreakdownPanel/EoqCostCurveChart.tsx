import type { EoqCurveResponse } from '@/types/eoq-backend';
import React from 'react'
import { 
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis } from 'recharts';

interface Props {
  curve: EoqCurveResponse;
}

const EoqCostCurveChart: React.FC<Props> = ({ curve }) => {
  if (!curve || !curve.curvePoints?.length) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={curve.curvePoints}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="quantity"
          tick={{ fontSize: 12 }}
          label={{
            value: "Order Quantity (Q)",
            position: "insideBottom",
            offset: -5,
          }}
        />

        <YAxis
          tick={{ fontSize: 12 }}
          label={{
            value: "Annual Cost (€)",
            angle: -90,
            position: "insideLeft",
          }}
        />

        <Tooltip
          formatter={(value: number) => `€ ${value.toFixed(2)}`}
          labelFormatter={(label) =>
            `Quantity: ${Number(label).toFixed(2)}`
          }
        />

        <Legend />

        <Line
          type="monotone"
          dataKey="orderingCost"
          stroke="#ef4444"
          strokeWidth={2}
          dot={false}
          name="Ordering Cost"
          isAnimationActive={false}
        />

        <Line
          type="monotone"
          dataKey="holdingCost"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
          name="Holding Cost"
          isAnimationActive={false}
        />

        <Line
          type="monotone"
          dataKey="totalCost"
          stroke="#10b981"
          strokeWidth={3}
          dot={false}
          name="Total Cost"
          isAnimationActive={false}
        />

        <ReferenceLine
          x={curve.optimalQuantity}
          stroke="#000"
          strokeDasharray="4 4"
          label={{
            value: "EOQ",
            position: "top",
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};



export default EoqCostCurveChart