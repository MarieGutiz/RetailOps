import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ABCCategory, AbcResponseDto, SimulationType } from "@/types/abc-backend";
import { useCurrency } from "@/views/simulator/newsvendorViews/forms/props/useCurrency";
import { useState } from "react";
import AbcResultTable from "./AbcResultTable";

interface Props {
  response?: AbcResponseDto;
  isRunning?: boolean;
  mode?: SimulationType;
}

const modeConfig: Record<
  SimulationType,
  {
    label: string;
    description: string;
    badgeStyle: string;
  }
> = {
  classic: {
    label: "Classic ABC",
    description: "Items ranked purely by total sales value contribution.",
    badgeStyle: "bg-blue-100 text-blue-700",
  },
  multi: {
    label: "Multi-Criteria ABC",
    description:
      "Items ranked using weighted score: 70% sales value + 30% demand frequency.",
    badgeStyle: "bg-purple-100 text-purple-700",
  },
};

const categoryColor: Record<ABCCategory, string> = {
  A: "bg-red-500",
  B: "bg-amber-500",
  C: "bg-emerald-500",
};

const AbcResultsPanel = ({ response, isRunning, mode = "classic" }: Props) => {
    const config = modeConfig[mode];

  const { format } = useCurrency();
  const [hoverCategory, setHoverCategory] = useState<ABCCategory | null>(null);
  const [hoverTableCategory, setHoverTableCategory] = useState<ABCCategory | null>(null);
  const [hoverThreshold, setHoverThreshold] = useState<"80" | "95" | null>(null);

  if (isRunning) return <div className="text-sm text-muted-foreground">Running simulation...</div>;
  if (!response) return <div className="text-sm text-muted-foreground">Run the simulation to see results.</div>;

  const { items, summary } = response;

  const topA = items.filter(i => i.abcCategoryType === "A");

  return (
    <div className="flex flex-col gap-8 w-full">

      {/* STRATEGY HEADER CARD */}
      <Card className="bg-muted/30 border shadow-sm">
        <CardContent className="p-6 flex flex-col gap-4">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold">
                ABC Classification Results
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                {config.description}
              </p>
            </div>

            <Badge
              className={`px-4 py-1 text-xs font-medium ${config.badgeStyle}`}
            >
              {config.label}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t text-sm text-muted-foreground">
            {(["A", "B", "C"] as ABCCategory[]).map((cat) => (
              <div key={cat} className="flex gap-3 items-start">
                <Badge className={`${categoryColor[cat]} text-white`}>
                  {cat}
                </Badge>
                <div>
                  <p className="font-medium text-foreground">
                    {cat === "A"
                      ? "High-Value Concentration"
                      : cat === "B"
                      ? "Moderate Impact"
                      : "Low Value Share"}
                  </p>
                  <p>
                    {cat === "A"
                      ? "Critical items driving the majority of value."
                      : cat === "B"
                      ? "Secondary contributors requiring balanced control."
                      : "Large volume, low contribution items suited for simplified policies."}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </CardContent>
      </Card>

      {/* EXECUTIVE SUMMARY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <Card className="hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle>Total Inventory Value</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {format(summary.totalValue)}
          </CardContent>
        </Card>

        {(["A", "B", "C"] as ABCCategory[]).map((cat) => {
          const key = cat.toLowerCase() as "a" | "b" | "c";
          const data = summary[key];
          const value =
            (data.valuePct / 100) * summary.totalValue;

          const isHighlighted =
            hoverCategory === cat ||
            hoverTableCategory === cat;

          return (
            <Card
              key={cat}
              className={`relative overflow-hidden transition-all hover:shadow-lg ${
                isHighlighted ? "bg-blue-50" : ""
              }`}
              onMouseEnter={() => setHoverCategory(cat)}
              onMouseLeave={() => setHoverCategory(null)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <Badge className={`${categoryColor[cat]} text-white`}>
                    {cat}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {data.valuePct.toFixed(1)}%
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                <div className="text-lg font-semibold">
                  {format(value)}
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Items</span>
                  <span>{data.count}</span>
                </div>
              </CardContent>

              <div
                className={`absolute bottom-0 left-0 right-0 h-1 ${categoryColor[cat]}`}
              />
            </Card>
          );
        })}
      </div>

      {/* TOP A ITEMS */}
      {topA.length > 0 && (
        <Card className="hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle>
              Top Value Drivers · Category A
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {topA.slice(0, 5).map((i) => (
              <Badge key={i.product.id} variant="outline">
                {i.product.name} · {format(i.salesValue)}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {/* RANKED TABLE */}
      <Card className="hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle>Ranked Contribution Analysis</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="w-full overflow-x-auto">
            <AbcResultTable
              response={response}
              hoveredCategory={hoverTableCategory}
              onHoverCategory={setHoverTableCategory}
              hoverThreshold={hoverThreshold}
              onHoverThreshold={setHoverThreshold}
              loading={false}
            />
          </div>

          {/* Threshold Legend */}
          <div className="flex flex-wrap gap-4 text-sm">
            {[
              {
                label: "80% Threshold",
                color: "bg-amber-300",
                ring: "ring-amber-300",
                value: "80",
              },
              {
                label: "95% Threshold",
                color: "bg-emerald-400",
                ring: "ring-emerald-300",
                value: "95",
              },
            ].map((th) => {
              const isActive = hoverThreshold === th.value;

              return (
                <div
                  key={th.value}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                    isActive
                      ? `ring-2 ${th.ring} bg-muted`
                      : "hover:bg-muted/40"
                  }`}
                  onMouseEnter={() =>
                    setHoverThreshold(th.value as "80" | "95")
                  }
                  onMouseLeave={() => setHoverThreshold(null)}
                >
                  <div
                    className={`w-6 h-3 rounded-sm border ${th.color}`}
                  />
                  <span className="font-medium">
                    {th.label}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );  

};

export default AbcResultsPanel