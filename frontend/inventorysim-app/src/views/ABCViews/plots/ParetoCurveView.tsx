import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import type { ParetoPoint } from "@/types/abc"
import { useMemo, useState } from "react"
import { Line, XAxis, CartesianGrid, ResponsiveContainer, YAxis, Tooltip, Bar, ComposedChart, Cell } from "recharts"
import ParetoPlotFooter from "./ParetoPlotFooter"
import { tooltipParetoLabels } from "@/hooks/simulator/modules/abc/hooks/useABCInput"


const chartConfig = {
  metric: {
    label: "Total Value",
    color: "var(--chart-2)",
  },
  cumulativePct: {
    label: "Cumulative %",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const abcColors = {
  A: "var(--chart-1)",
  B: "var(--chart-2)",
  C: "var(--chart-3)",
}


export function ParetoCurveView({ data }: { data: ParetoPoint[] }) {
  const cutoffPct = 80

  /**
   * Finds the first product that pushes cumulative % ≥ 80
   */
  const cutoffCount = useMemo(() => {
    const index = data.findIndex(
      (d) => d.cumulativePct >= cutoffPct
    )
    return index === -1 ? data.length : index + 1
  }, [data]);

  const [hoveredItem, setHoveredItem] = useState<ParetoPoint | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pareto Curve Plot</CardTitle>
        <CardDescription>
          Cumulative value contribution of inventory items by ABC classification
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={data}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />

              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={false} // many products → cleaner
              />

              {/* Left axis: metrics */}
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                label={{
                  value: "Total value",
                  angle: -90,
                  position: "insideLeft",
                }}
              />


              {/* Right axis: cumulative % */}
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 100]}
                label={{
                  value: "Cumulative contribution (%)",
                  angle: 90,
                  position: "insideRight",
                  offset: 10,
                }}
              />


              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null

                  return (
                    <div className="rounded-md border bg-background p-2 text-sm shadow">
                      <div className="font-medium">{payload[0].name}</div>
                      {payload.map((p) => (
                      <div key={p.dataKey}>
                        {tooltipParetoLabels[p.dataKey as string] ?? p.dataKey}:{" "}
                        {typeof p.value === "number"
                          ? p.dataKey === "cumulativePct"
                            ? `${p.value.toFixed(1)}%`
                            : p.value.toLocaleString()
                          : p.value}
                      </div>
                    ))}

                    </div>
                  )
                }}
              />

              {/* Bars */}
              <Bar
                yAxisId="left"
                dataKey="metric"
                radius={[4, 4, 0, 0]}
                name="Total Value"
                onMouseEnter={(_, index) => {
                  setHoveredItem(data[index])
                }}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={abcColors[entry.category]}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>


              {/* Cumulative line */}
              <Line
              yAxisId="right"
              type="monotone"
              dataKey="cumulativePct"
              stroke="var(--color-cumulativePct)"
              strokeWidth={3}     // thicker
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={false}
              name="Cumulative %"
            />

            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <ParetoPlotFooter hoveredItem={hoveredItem} cutoffCount={cutoffCount} />
     </Card>
  )
}

export default ParetoCurveView