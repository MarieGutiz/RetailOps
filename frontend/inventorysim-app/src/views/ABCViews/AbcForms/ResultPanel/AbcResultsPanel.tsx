import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ABCCategory, AbcResponseDto } from "@/types/abc-backend";
import { useCurrency } from "@/views/newsvendorViews/forms/props/useCurrency";
import { useMemo, useState } from "react";

interface Props {
  response?: AbcResponseDto;
  isRunning?: boolean;
}

type SortKey = "rank" | "salesValue" | "cumulativePct" | "demandFrequency";

const categoryColor: Record<ABCCategory, string> = {
  A: "bg-red-500",
  B: "bg-amber-500",
  C: "bg-emerald-500",
};

const AbcResultsPanel = ({ response, isRunning }: Props) => {
  const { format } = useCurrency();
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [asc, setAsc] = useState(true);

  if (isRunning) {
    return (
      <div className="text-sm text-muted-foreground">
        Running simulation...
      </div>
    );
  }

  if (!response) {
    return (
      <div className="text-sm text-muted-foreground">
        Run the simulation to see results.
      </div>
    );
  }

  const { items, summary } = response;

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return asc ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [items, sortKey, asc]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setAsc(!asc);
    } else {
      setSortKey(key);
      setAsc(false);
    }
  };

  const topA = items.filter(i => i.abcCategoryType === "A");

  return (
    <div className="flex flex-col gap-8">

      {/* EXECUTIVE SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* TOTAL VALUE */}
        <Card>
          <CardHeader>
            <CardTitle>Total Inventory Value</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {format(summary.totalValue)}
          </CardContent>
        </Card>

        {(["A", "B", "C"] as ABCCategory[]).map(cat => {
          const key = cat.toLowerCase() as "a" | "b" | "c";
          const data = summary[key];
          const categoryValue =
            (data.valuePct / 100) * summary.totalValue;

          return (
            <Card key={cat} className="relative overflow-hidden">
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
                  {format(categoryValue)}
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Items</span>
                  <span>{data.count}</span>
                </div>
              </CardContent>

              <div className={`absolute bottom-0 left-0 right-0 h-1 ${categoryColor[cat]}`} />
            </Card>
          );
        })}
      </div>

      {/* DOMINANCE SPOTLIGHT */}
      {topA.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Value Drivers (Category A)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {topA.slice(0, 5).map(item => (
              <Badge key={item.product.id} variant="outline">
                {item.product.name} • {format(item.salesValue)}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {/* RANKED TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Ranked Contribution Analysis</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="py-2 cursor-pointer" onClick={() => toggleSort("rank")}>
                    Rank
                  </th>
                  <th>Product</th>
                  <th
                    className="text-right cursor-pointer"
                    onClick={() => toggleSort("salesValue")}
                  >
                    Sales Value
                  </th>
                  <th
                    className="text-right cursor-pointer"
                    onClick={() => toggleSort("cumulativePct")}
                  >
                    Cumulative %
                  </th>
                  <th
                    className="text-right cursor-pointer"
                    onClick={() => toggleSort("demandFrequency")}
                  >
                    Demand
                  </th>
                  <th className="text-center">Category</th>
                </tr>
              </thead>

              <tbody>
                {sortedItems.map(item => {
                  const thresholdClass =
                    item.cumulativePct >= 95
                      ? "bg-emerald-50"
                      : item.cumulativePct >= 80
                      ? "bg-amber-50"
                      : "";

                  return (
                    <tr
                      key={item.product.id}
                      className={`border-b transition-colors hover:bg-muted/40 ${thresholdClass}`}
                    >
                      <td className="py-2 font-medium">{item.rank}</td>

                      <td>{item.product.name}</td>

                      <td className="text-right font-medium">
                        {format(item.salesValue)}
                      </td>

                      <td className="text-right w-44">
                        <div className="flex flex-col items-end">
                          <span>{item.cumulativePct.toFixed(1)}%</span>
                          <div className="w-full h-1 bg-muted rounded-full mt-1">
                            <div
                              className="h-1 bg-primary rounded-full"
                              style={{ width: `${item.cumulativePct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="text-right">
                        {item.demandFrequency}
                      </td>

                      <td className="text-center">
                        <Badge
                          className={`${categoryColor[item.abcCategoryType]} text-white`}
                        >
                          {item.abcCategoryType}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Threshold Legend */}
          <div className="flex gap-6 text-xs text-muted-foreground mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 bg-amber-50 border" />
              80% threshold
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 bg-emerald-50 border" />
              95% threshold
            </div>
          </div>

        </CardContent>
      </Card>

    </div>
  );

};

export default AbcResultsPanel