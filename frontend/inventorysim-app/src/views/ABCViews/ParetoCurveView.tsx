import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import type { ParetoPoint } from "@/types/abc"
import {  TrendingUp } from "lucide-react"
import { useMemo } from "react"
import { Line, XAxis, CartesianGrid, ResponsiveContainer, YAxis, Tooltip, Bar, ComposedChart } from "recharts"


const chartConfig = {
  value: {
    label: "Total Value",
    color: "var(--chart-2)",
  },
  cumulativePct: {
    label: "Cumulative %",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ParetoCurveView({ data }: { data: ParetoPoint[] }) {
  const cutoffPct = 80

  const cutoffCount = useMemo(() => {
    const index = data.findIndex(
      (d) => d.cumulativePct >= cutoffPct
    )
    return index === -1 ? data.length : index + 1
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pareto Curve Plot</CardTitle>
        <CardDescription>
          Cumulative value contribution of inventory items
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

              {/* Left axis: value */}
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
              />

              {/* Right axis: cumulative % */}
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 100]}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null

                  return (
                    <div className="rounded-md border bg-background p-2 text-sm shadow">
                      <div className="font-medium">{payload[0].name}</div>
                      {payload.map((p) => (
                        <div key={p.dataKey}>
                          {p.dataKey}:{" "}
                          {typeof p.value === "number"
                            ? p.value.toLocaleString()
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
                dataKey="value"
                fill="var(--color-value)"
                radius={[4, 4, 0, 0]}
              />

              {/* Cumulative line */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cumulativePct"
                stroke="var(--color-cumulativePct)"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Cumulative %"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

       <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Top {cutoffCount} products cover ~80% of total value
           <TrendingUp className="h-4 w-4 text-primary" />
        </div>
        <div className="text-muted-foreground leading-none">
          Ordered by product contribution to total inventory value
        </div>
      </CardFooter>
    </Card>
  )
}

export default ParetoCurveView