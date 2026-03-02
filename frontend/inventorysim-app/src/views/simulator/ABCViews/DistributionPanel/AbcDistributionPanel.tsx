import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AbcResponseDto, SimulationType } from "@/types/abc-backend";
import { useCurrency } from "@/views/simulator/newsvendorViews/forms/hooks/useCurrency";
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
  mode?:SimulationType;
}
const modeConfig: Record<
  SimulationType,
  { label: string; description: string; badgeStyle: string }
> = {
  classic: {
    label: "Classic ABC",
    description:
      "Distribution based purely on total sales value ranking.",
    badgeStyle: "bg-blue-100 text-blue-700",
  },
  multi: {
    label: "Multi-Criteria ABC",
    description:
      "Distribution derived from weighted value and demand contribution.",
    badgeStyle: "bg-purple-100 text-purple-700",
  },
};

const COLORS = {
  A: "#ef4444",
  B: "#f59e0b",
  C: "#10b981",
};

const AbcDistributionPanel = ({ response, mode="classic" }: Props) => {
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
      <CardContent className="p-6 space-y-5">

        {(() => {
          const config = modeConfig[mode];

          return (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    Inventory Value & Category Insights
                  </h2>

                  <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                    {config.description}
                  </p>
                </div>

                <Badge className={`px-4 py-1 text-xs ${config.badgeStyle}`}>
                  {config.label}
                </Badge>
              </div>

              <div className="pt-4 border-t text-sm sm:text-base text-muted-foreground leading-relaxed space-y-2">
                <p>
                  Category A represents the critical minority driving strategic importance.
                  Category B captures moderate contributors, while Category C forms the broad
                  operational base of lower-impact items.
                </p>

                <p>
                  {mode === "multi"
                    ? "Because demand frequency contributes to ranking, high-velocity items may rise in category even when their individual value is moderate. This creates a more operationally responsive segmentation."
                    : "Since ranking is driven strictly by financial contribution, categories emphasize value concentration over movement frequency."}
                </p>
              </div>
            </>
          );
        })()}

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