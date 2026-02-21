import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AbcResponseDto } from "@/types/abc-backend";
import { useCurrency } from "@/views/newsvendorViews/forms/props/useCurrency";
import { 
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis } from "recharts";

interface Props {
  response?: AbcResponseDto;
  isRunning?:boolean;
}

const COLORS = {
  A: "#ef4444",
  B: "#f59e0b",
  C: "#10b981",
};

const AbcDistributionPanel = ({ response }: Props) => {
  const { format } = useCurrency();

  if (!response) {
    return (
      <div className="text-sm text-muted-foreground">
        Run the simulation to see category distribution.
      </div>
    );
  }

  const { summary } = response;

  const pieData = [
    { name: "A", value: summary.a.valuePct },
    { name: "B", value: summary.b.valuePct },
    { name: "C", value: summary.c.valuePct },
  ];

  const barData = [
    { name: "A", count: summary.a.count },
    { name: "B", count: summary.b.count },
    { name: "C", count: summary.c.count },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* TOTAL VALUE */}
      <Card>
        <CardHeader>
          <CardTitle>Total Inventory Value</CardTitle>
        </CardHeader>
        <CardContent className="text-xl font-semibold">
          {format(summary.totalValue)}
        </CardContent>
      </Card>

      {/* PIE CHART */}
      <Card>
        <CardHeader>
          <CardTitle>Value Distribution (%)</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label={({ name, value }) =>
                  `${name}: ${value.toFixed(1)}%`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.name as "A" | "B" | "C"]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* BAR CHART */}
      <Card>
        <CardHeader>
          <CardTitle>Item Count per Category</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count">
                {barData.map((entry, index) => (
                  <Cell
                    key={`cell-bar-${index}`}
                    fill={COLORS[entry.name as "A" | "B" | "C"]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default AbcDistributionPanel