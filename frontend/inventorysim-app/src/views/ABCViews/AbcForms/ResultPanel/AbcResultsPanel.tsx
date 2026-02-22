import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  const [hoverCategory, setHoverCategory] = useState<ABCCategory | null>(null);
  const [hoverTableCategory, setHoverTableCategory] = useState<ABCCategory | null>(null);
  const [hoverThreshold, setHoverThreshold] = useState<"80" | "95" | null>(null);

  if (isRunning) return <div className="text-sm text-muted-foreground">Running simulation...</div>;
  if (!response) return <div className="text-sm text-muted-foreground">Run the simulation to see results.</div>;

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
    if (key === sortKey) setAsc(!asc);
    else {
      setSortKey(key);
      setAsc(false);
    }
  };

  const topA = items.filter(i => i.abcCategoryType === "A");

  return (
    <div className="flex flex-col gap-6 min-w-0">

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
            <Table className="w-full text-sm table-fixed border-collapse">
              <TableHeader>
                <TableRow>
                  {[
                    {key:"rank",label:"Rank",align:"left"},
                    {key:"product",label:"Product",align:"left"},
                    {key:"salesValue",label:"Sales Value",align:"right"},
                    {key:"cumulativePct",label:"Cumulative %",align:"center"},
                    {key:"demandFrequency",label:"Demand",align:"right"},
                    {key:"category",label:"Category",align:"center"},
                  ].map(col=>{
                    const isSort = col.key===sortKey;
                    const arrow = isSort ? (asc?"↑":"↓"):"";
                    return (
                      <TableHead
                        key={col.key}
                        className={`cursor-pointer select-none px-2 py-1 ${
                          col.align==="right"?"text-right":col.align==="center"?"text-center":"text-left"
                        }`}
                        onClick={()=>col.key!=="product" && col.key!=="category" && toggleSort(col.key as SortKey)}
                      >
                        <span className="flex items-center justify-center sm:justify-start gap-1">{col.label} {arrow}</span>
                      </TableHead>
                    )
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedItems.map(item=>{
                  let thresholdClass = "";
                  if(item.cumulativePct>=95) thresholdClass="bg-emerald-50";
                  else if(item.cumulativePct>=80) thresholdClass="bg-amber-50";

                  const thresholdHover = item.cumulativePct>=95 ? "95" : item.cumulativePct>=80 ? "80" : null;

                  return (
                    <TableRow
                      key={`${item.rank}-${item.product.id ?? "noid"}`}
                      className={`transition-all cursor-pointer hover:bg-blue-50 ${thresholdClass} ${hoverThreshold && thresholdHover && hoverThreshold===thresholdHover?"bg-blue-100":""}`}
                      onMouseEnter={()=>{setHoverThreshold(thresholdHover); setHoverTableCategory(item.abcCategoryType);}}
                      onMouseLeave={()=>{setHoverThreshold(null); setHoverTableCategory(null);}}
                    >
                      <TableCell className="px-2 py-1 font-medium text-left">{item.rank}</TableCell>
                      <TableCell className="px-2 py-1 truncate text-left">{item.product.name}</TableCell>
                      <TableCell className="px-2 py-1 font-medium text-left">{format(item.salesValue)}</TableCell>
                      <TableCell className="px-2 py-1 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs">{item.cumulativePct.toFixed(1)}%</span>
                          <div className="w-full h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-blue-400 rounded-full" style={{width:`${item.cumulativePct}%`}} />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-2 py-1 text-center">{item.demandFrequency}</TableCell>
                      <TableCell className="px-2 py-1 text-center">
                        <Badge className={`${categoryColor[item.abcCategoryType]} text-white`}>
                          {item.abcCategoryType}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Threshold Legend */}
          <div className="flex gap-6 text-xs mt-3">
            {[
              {label:"80% threshold",color:"bg-amber-50",value:"80"},
              {label:"95% threshold",color:"bg-emerald-50",value:"95"}
            ].map(th=>(
              <div
                key={th.value}
                className={`flex items-center gap-2 cursor-pointer ${
                  hoverThreshold===th.value?"bg-blue-50 rounded px-1":""
                }`}
                onMouseEnter={()=>setHoverThreshold(th.value as "80"|"95")}
                onMouseLeave={()=>setHoverThreshold(null)}
              >
                <div className={`w-4 h-2 border ${th.color}`}/>
                {th.label}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

};

export default AbcResultsPanel