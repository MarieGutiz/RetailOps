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

            {/* INSIGHT CARD */}
      <Card className="border bg-muted/30 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">
            Inventory Value & Category Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
          <p>
            This section visualizes how inventory value is distributed across ABC categories.
            Category A typically represents the few high-value items, B are moderate contributors,
            and C are numerous low-value items.
          </p>
          <p>
            Understanding this concentration helps prioritize inventory control, stock monitoring,
            and resource allocation.
          </p>
        </CardContent>
      </Card>

      {/* TOTAL VALUE */}
      <Card>
        <CardHeader>
          <CardTitle>Total Inventory Value</CardTitle>
        </CardHeader>
        <CardContent className="text-xl font-semibold">
          {format(summary.totalValue)}
        </CardContent>
      </Card>

      
      {/* PIE CHART WITH CAPTION */}
      <Card>
        <CardHeader>
          <CardTitle>Value Distribution (%)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-80">
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
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
          <p className="mt-2 text-sm text-muted-foreground">
            The pie chart shows each category's contribution to total inventory value.
            Category A typically contains a few high-value items, B moderate contributors, and C
            many low-value items.
          </p>
        </CardContent>
      </Card>

      {/* BAR CHART WITH CAPTION */}
      <Card>
        <CardHeader>
          <CardTitle>Item Count per Category</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-80">
          <ResponsiveContainer width="100%" height="80%">
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
          <p className="mt-2 text-sm text-muted-foreground">
            The bar chart shows the number of items in each category.
            Category C usually contains the most items but contributes the least to total value.
          </p>
        </CardContent>
      </Card>

    </div>
  );
}

export default AbcDistributionPanel