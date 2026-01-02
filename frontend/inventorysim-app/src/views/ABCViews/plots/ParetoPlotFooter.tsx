import { CardFooter } from "@/components/ui/card";
import type { ParetoPoint } from "@/types/abc";
import { TrendingUp } from "lucide-react";

const ParetoPlotFooter = ({hoveredItem, cutoffCount}: { hoveredItem: ParetoPoint | null ; cutoffCount: number }) => {
  return (
    <CardFooter className="flex-col items-start gap-2 text-sm">
        {hoveredItem ? (
          <div className="leading-none font-medium">
            {hoveredItem.name} contributes{" "}
             <span className="font-semibold">
                Class {hoveredItem.category}
             </span>{" "}
    ({hoveredItem.cumulativePct.toFixed(1)}% cumulative)
          </div>
        ) : (
          <div className="flex gap-2 leading-none font-medium">
            Top {cutoffCount} products cover ~80% of total value
            <TrendingUp className="h-4 w-4" />
          </div>
        )}

        <div className="text-muted-foreground leading-none">
          Ordered by product contribution to total inventory value
        </div>
      </CardFooter>
  )
}

export default ParetoPlotFooter