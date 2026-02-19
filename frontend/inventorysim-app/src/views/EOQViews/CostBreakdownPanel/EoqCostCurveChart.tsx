import type { EoqCurveResponse } from '@/types/eoq-backend';
import { useCurrency } from '@/views/newsvendorViews/forms/props/useCurrency';
import React from 'react'
import { 
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ReferenceArea,
    ReferenceDot,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis } from 'recharts';

interface Props {
  curve: EoqCurveResponse;
}

const EoqCostCurveChart: React.FC<Props> = ({ curve }) => {
  const { format } = useCurrency();
  
  if (!curve || !curve.curvePoints?.length) return null;

  const optimalQ = (curve.optimalQuantity ?? 0);
  const bandWidth = optimalQ * 0.01; // 3% band

    const optimalPoint = curve.curvePoints.reduce((prev, curr) =>
    Math.abs(curr.quantity - optimalQ) <
    Math.abs(prev.quantity - optimalQ)
      ? curr
      : prev
   );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={curve.curvePoints}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          type="number"
          dataKey="quantity"
          domain={["dataMin", "dataMax"]}
          tick={{ fontSize: 12 }}
          tickFormatter={(value: number) =>
            Math.round(value).toString()
          }
          label={{
            value: "Order Quantity (Q)",
            position: "insideBottom",
            offset: 1,
          }}
        />


        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => format(value)}
          label={{
            value: "Annual Cost",
            angle: -90,
            position: "insideLeft",
            offset: 1,
          }}
        />

        <Tooltip
          formatter={(value: number) => format(value)}
          labelFormatter={(label) =>
            `Quantity: ${Math.round(Number(label))}`
          }
        />

        <Legend />

        <ReferenceArea
          x1={optimalQ - bandWidth}
          x2={optimalQ + bandWidth}
          fill="#dc2626"
          fillOpacity={0.06}
        />


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
          isAnimationActive={false}
          name="Total Cost"
          activeDot={{
            r: 6,
          }}
        />


        {/*  Q* Vertical Reference Line */}
        <ReferenceLine
          x={optimalQ}
          stroke="#dc2626"
          strokeWidth={2}
          strokeDasharray="6 4"
          label={{
            value: `Q* = ${Math.round(optimalQ)}`,
            position: "top",
            fill: "#dc2626",
            fontSize: 12,
          }}
        />

        <ReferenceDot
          x={optimalPoint.quantity}
          y={optimalPoint.totalCost}
          r={6}
          fill="#dc2626"
          stroke="#ffffff"
          strokeWidth={2}
        />


      </LineChart>
    </ResponsiveContainer>
  );
};




export default EoqCostCurveChart