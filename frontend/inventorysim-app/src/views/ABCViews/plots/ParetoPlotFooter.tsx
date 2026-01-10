import { CardFooter } from "@/components/ui/card";
import { useABCColors, impactLabel } from "@/hooks/simulator/modules/abc/hooks/useABCInput";
import  { cn } from "@/lib/utils";
import type { ParetoPoint } from "@/types/abc";
import { TrendingUp } from "lucide-react";

const ParetoPlotFooter = ({
  hoveredItem,
  cutoffCount,
  hoveredCategory,
  cutoffPct
}: {
  hoveredItem: ParetoPoint | null
  cutoffCount: number
  hoveredCategory: "A" | "B" | "C" | null
  cutoffPct: number
}) => {
  const { colors } = useABCColors()

  const isDimmed =
    hoveredCategory &&
    hoveredItem &&
    hoveredCategory !== hoveredItem.category

    const isBeforeCutoff =
   hoveredItem && hoveredItem.cumulativePct <= cutoffPct


  return (
    <CardFooter
      className={cn(
        "flex-col items-start gap-2 text-sm transition-opacity",
        isDimmed && "opacity-40"
      )}
    >
      {hoveredItem ? (
        <>
          {/* Main line */}
          <div className="leading-tight font-medium flex items-center gap-2">
            <span className="font-semibold">{hoveredItem.name}</span>
            <span
              className={cn(
                "rounded px-2 py-0.5 text-xs font-semibold",
                colors[hoveredItem.category].bg
              )}
            >
              {impactLabel[hoveredItem.category]}
            </span>
          </div>

          {/* Metrics */}
          <div className="text-muted-foreground leading-tight">
            Class{" "}
            <span className="font-medium">
              {hoveredItem.category}
            </span>{" "}
            contributes{" "}
            <span className="font-medium">
              {hoveredItem.categoryContributionPct?.toFixed(1)}%
            </span>{" "}
            of total value
            <span className="mx-1">•</span>
            lies{" "}
            <span
              className={cn(
                "font-medium",
                isBeforeCutoff ? "text-emerald-600" : "text-muted-foreground"
              )}
            >
              {isBeforeCutoff ? "within" : "beyond"}
            </span>{" "}
            the {cutoffPct}% cutoff
          </div>

        </>
      ) : (
        <>
          <div className="flex gap-2 leading-none font-medium">
            Top {cutoffCount} products cover ~80% of total value
            <TrendingUp className="h-4 w-4" />
          </div>

          <div className="text-muted-foreground leading-none">
            Pareto principle applied to inventory value
          </div>
        </>
      )}

      <div className="text-muted-foreground leading-none">
        Ordered by product contribution to total inventory value
      </div>
    </CardFooter>

  )
}

export default ParetoPlotFooter