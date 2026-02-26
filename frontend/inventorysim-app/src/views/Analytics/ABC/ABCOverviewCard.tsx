import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowDown, ArrowUp } from "lucide-react";

type Category = "A" | "B" | "C";

interface ABCOverviewCardProps {
  category: Category;
  count: number;
  valuePct: number;
  totalValue: number;
  historicalCount?: number; // optional historical count for comparison
}

const categoryConfig: Record<
  Category,
  { color: string; bg: string; description: string }
> = {
  A: {
    color: "bg-emerald-500",
    bg: "bg-emerald-50",
    description: "High-value items. Small in number, dominant in revenue impact.",
  },
  B: {
    color: "bg-amber-500",
    bg: "bg-amber-50",
    description: "Moderate-value items. Balanced contribution to total value.",
  },
  C: {
    color: "bg-rose-500",
    bg: "bg-rose-50",
    description: "Low-value items. High volume, low individual contribution.",
  },
};

const ABCOverviewCard = ({
  category,
  count,
  valuePct,
  totalValue,
  historicalCount,
}: ABCOverviewCardProps) => {
  const config = categoryConfig[category];

  // compute delta vs historical
  const delta = historicalCount !== undefined ? count - historicalCount : 0;
  const hasChange = delta !== 0;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className={`cursor-default hover:shadow-md transition ${config.bg}`}>
            <CardContent className="p-4 space-y-3">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold text-gray-600">
                  Category {category}
                </h4>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>{count} items</span>
                  {hasChange && (
                    <span className="flex items-center text-[0.65rem]">
                      {delta > 0 ? (
                        <ArrowUp className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-rose-500" />
                      )}
                      {Math.abs(delta)}
                    </span>
                  )}
                </div>
              </div>

              {/* Percentage */}
              <div>
                <p className="text-xl font-bold">{valuePct.toFixed(1)}%</p>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className={`${config.color} h-2 rounded-full transition-all`}
                    style={{ width: `${valuePct}%` }}
                  />
                </div>
              </div>

              {/* Value */}
              <div className="text-xs text-muted-foreground">
                Total Value: {totalValue.toFixed(2)}
              </div>

              {/* Comparison Info */}
              {historicalCount !== undefined && (
                <div className="text-[0.65rem] text-gray-500 mt-1">
                  Compared to previous simulation: {historicalCount} items
                </div>
              )}
            </CardContent>
          </Card>
        </TooltipTrigger>

        <TooltipContent>
          {config.description}
          <br />
          Represents {valuePct.toFixed(1)}% of total inventory value.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

}

export default ABCOverviewCard