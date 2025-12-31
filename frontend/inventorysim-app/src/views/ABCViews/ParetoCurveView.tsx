import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { useABCInput } from "@/hooks/simulator/modules/abc/useABCInput"
import { buildABCTableData } from "@/lib/abc/buildABCTableData"
import {  TrendingUp } from "lucide-react"
import { useMemo } from "react"
import { LineChart, Line, XAxis, CartesianGrid } from "recharts"


const ParetoCurveView = () => {
  const abcInput = useABCInput()

  // 1. Build chart data from ABC table rows
  const chartData = useMemo(() => {
    const rows = buildABCTableData(abcInput)

    // cumulative percentage + product label
    return rows.map((r, index) => ({
      name: r.product.name,
      cumulativeValuePct: r.cumulative, // 0-100%
      value: r.totalValue,
      category: r.category,
      index: index + 1,
    }))
  }, [abcInput])

  // 2. Chart color config
  const chartConfig: ChartConfig = {
    cumulativeValuePct: { label: "Cumulative %", color: "var(--chart-1)" },
    value: { label: "Value", color: "var(--chart-2)" },
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Pareto Curve</CardTitle>
        <CardDescription>
          Shows cumulative inventory value and distribution per product
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            
            {/* Cumulative % line */}
            <Line
              type="monotone"
              dataKey="cumulativeValuePct"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Cumulative %"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Top products cover ~80% of total value <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Ordered by product contribution to total inventory value
        </div>
      </CardFooter>
    </Card>
  )
}

export default ParetoCurveView