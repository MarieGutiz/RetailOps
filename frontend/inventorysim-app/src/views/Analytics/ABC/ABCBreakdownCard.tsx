import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Category = "A" | "B" | "C";

interface Props {
  category: Category;
  whatIfCount: number;
  whatIfValue: number;
  historicalCount: number;
  historicalValue: number;
}


const categoryStyles: Record<Category, string> = {
  A: "bg-emerald-50",
  B: "bg-amber-50",
  C: "bg-rose-50",
};

const ABCBreakdownCard = ({
  category,
  whatIfCount,
  whatIfValue,
  historicalCount,
  historicalValue,
}: Props) => {
  const countDiff = whatIfCount - historicalCount;
  const valueDiff = whatIfValue - historicalValue;

  const countUp = countDiff > 0;
  const countDown = countDiff < 0;
  const valueUp = valueDiff > 0;
  const valueDown = valueDiff < 0;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className={`${categoryStyles[category]} cursor-default hover:shadow-md transition`}>
            <CardContent className="p-4 space-y-2 text-center">
              <h4 className="text-sm font-semibold text-gray-600">Category {category}</h4>

              {/* Counts */}
              <div className="flex justify-around text-xs text-gray-500 font-medium">
                <span>What-If: {whatIfCount}</span>
                <span>Historical: {historicalCount}</span>
              </div>

              {/* Values */}
              <div className="flex justify-around text-xs text-gray-500 font-medium">
                <span>What-If Value: {whatIfValue.toFixed(2)}</span>
                <span>Historical Value: {historicalValue.toFixed(2)}</span>
              </div>

              {/* Delta */}
              <div
                className={`text-sm font-semibold ${
                  countUp ? "text-emerald-600" : countDown ? "text-rose-600" : "text-gray-500"
                }`}
              >
                {countDiff === 0
                  ? "No change in count"
                  : `${countUp ? "▲" : "▼"} ${Math.abs(countDiff)} item${Math.abs(countDiff) > 1 ? "s" : ""}`}
              </div>

              <div
                className={`text-sm font-semibold ${
                  valueUp ? "text-emerald-600" : valueDown ? "text-rose-600" : "text-gray-500"
                }`}
              >
                {valueDiff === 0
                  ? "No change in value"
                  : `${valueUp ? "▲" : "▼"} ${Math.abs(valueDiff).toFixed(2)} value`}
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>

        <TooltipContent>
          Comparison for Category {category}: shows how What-If thresholds change
          item counts and total value compared to the selected historical simulation.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );



}

export default ABCBreakdownCard