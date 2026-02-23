import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ABCCategory, AbcResponseDto } from "@/types/abc-backend";
import { useCurrency } from "@/views/newsvendorViews/forms/props/useCurrency";
import { useState } from "react";
import AbcResultTable from "./AbcResultTable";

interface Props {
  response?: AbcResponseDto;
  isRunning?: boolean;
}


const categoryColor: Record<ABCCategory, string> = {
  A: "bg-red-500",
  B: "bg-amber-500",
  C: "bg-emerald-500",
};

const AbcResultsPanel = ({ response, isRunning }: Props) => {
  const { format } = useCurrency();
  const [hoverCategory, setHoverCategory] = useState<ABCCategory | null>(null);
  const [hoverTableCategory, setHoverTableCategory] = useState<ABCCategory | null>(null);
  const [hoverThreshold, setHoverThreshold] = useState<"80" | "95" | null>(null);

  if (isRunning) return <div className="text-sm text-muted-foreground">Running simulation...</div>;
  if (!response) return <div className="text-sm text-muted-foreground">Run the simulation to see results.</div>;

  const { items, summary } = response;

  const topA = items.filter(i => i.abcCategoryType === "A");

  return (
    <div className="flex flex-col gap-6 min-w-0">
      {/* RESULTS OVERVIEW */}
      <Card className="border bg-muted/30 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">
            ABC Classification Results
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
          <p>
            This analysis ranks inventory items by their contribution to total sales
            value and segments them into differentiated control categories.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 pt-2">
            <div className="flex items-start gap-3">
              <Badge className="bg-red-500 text-white">A</Badge>
              <div>
                <p className="font-medium text-foreground">High-Value Concentration</p>
                <p>
                  A small number of items generating the majority of total value.
                  These require tight monitoring and priority control.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge className="bg-amber-500 text-white">B</Badge>
              <div>
                <p className="font-medium text-foreground">Moderate Impact</p>
                <p>
                  Items with meaningful but secondary contribution. Managed with
                  balanced oversight.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge className="bg-emerald-500 text-white">C</Badge>
              <div>
                <p className="font-medium text-foreground">Low Value Share</p>
                <p>
                  A large number of items contributing marginal value. Suitable for
                  simplified or automated control policies.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t text-xs sm:text-sm">
            The 80% and 95% cumulative thresholds define the transition between
            categories, highlighting how value concentration accumulates across
            ranked items.
          </div>
        </CardContent>
      </Card>

      {/* EXECUTIVE SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 min-w-0">
        <Card className="min-w-0 hover:shadow-lg hover:-translate-y-0.5 transition-all">
          <CardHeader><CardTitle>Total Inventory Value</CardTitle></CardHeader>
          <CardContent className="text-2xl font-semibold">{format(summary.totalValue)}</CardContent>
        </Card>

        {(["A","B","C"] as ABCCategory[]).map(cat => {
          const key = cat.toLowerCase() as "a"|"b"|"c";
          const data = summary[key];
          const value = (data.valuePct/100)*summary.totalValue;

          const isHighlighted = hoverCategory === cat || hoverTableCategory === cat;

          return (
            <Card
              key={cat}
              className={`relative overflow-hidden min-w-0 transition-all hover:shadow-lg hover:-translate-y-0.5 ${isHighlighted?"bg-blue-50":""}`}
              onMouseEnter={() => setHoverCategory(cat)}
              onMouseLeave={() => setHoverCategory(null)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <Badge className={`${categoryColor[cat]} text-white`}>{cat}</Badge>
                  <span className="text-xs text-muted-foreground">{data.valuePct.toFixed(1)}%</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-lg font-semibold">{format(value)}</div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Items</span><span>{data.count}</span>
                </div>
              </CardContent>
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${categoryColor[cat]}`} />
            </Card>
          );
        })}
      </div>

      {/* TOP A */}
      {topA.length>0 && (
        <Card className="min-w-0 hover:shadow-lg hover:-translate-y-0.5 transition-all">
          <CardHeader><CardTitle>Top Value Drivers (Category A)</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {topA.slice(0,5).map(i=>(
              <Badge key={i.product.id} variant="outline">{i.product.name} • {format(i.salesValue)}</Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {/* RANKED TABLE */}
      <Card className="min-w-0 hover:shadow-lg hover:-translate-y-0.5 transition-all">
        <CardHeader><CardTitle>Ranked Contribution Analysis</CardTitle></CardHeader>
        <CardContent className="min-w-0">
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
        <div className="flex flex-wrap gap-4 sm:gap-6 text-sm sm:text-base mt-4">
          {[
            { label: "80% Threshold", color: "bg-amber-100", ring: "ring-amber-300", value: "80" },
            { label: "95% Threshold", color: "bg-emerald-100", ring: "ring-emerald-300", value: "95" },
          ].map((th) => {
            const isActive = hoverThreshold === th.value

            return (
              <div
                key={th.value}
                className={`
                  flex items-center gap-3
                  cursor-pointer
                  px-3 py-2
                  rounded-lg
                  transition-all duration-200
                  ${isActive ? `${th.color} ring-2 ${th.ring} shadow-sm` : "hover:bg-muted/40"}
                `}
                onMouseEnter={() => setHoverThreshold(th.value as "80" | "95")}
                onMouseLeave={() => setHoverThreshold(null)}
              >
                <div
                  className={`w-6 h-3 rounded-sm border border-gray-300 ${
                    th.value === "80" ? "bg-amber-300" : "bg-emerald-400"
                  }`}
                />
                <span className="font-medium">{th.label}</span>
              </div>
            )
          })}
        </div>
        </CardContent>
      </Card>
    </div>
  )

};

export default AbcResultsPanel