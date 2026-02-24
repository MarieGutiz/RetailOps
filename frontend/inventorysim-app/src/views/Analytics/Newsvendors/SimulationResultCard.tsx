import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { SimulationLogEntry } from "@/views/Overview/hooks/useSimulationBitacora";

interface Props {
  log: SimulationLogEntry;
  difference: number;
  onSelect: () => void;
}

const SimulationResultCard = ({ log, difference, onSelect }: Props) => {
  return (
    <TooltipProvider>
      <Card
        onClick={onSelect}
        className="cursor-pointer transition hover:shadow-md hover:border-blue-400 border border-gray-200"
      >
        <CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          {/* Date */}
          <div className="text-sm text-muted-foreground">
            {new Date(log.createdAt).toLocaleString()}
          </div>

          {/* Metrics */}
          <div className="flex flex-wrap gap-4 text-sm font-medium">

            {/* Service Level */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="px-2 py-1 rounded-md bg-blue-50">
                  SL: {(log.data.serviceLevel * 100).toFixed(1)}%
                </div>
              </TooltipTrigger>
              <TooltipContent>
                Service Level achieved in that simulation
              </TooltipContent>
            </Tooltip>

            {/* Delta */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="px-2 py-1 rounded-md bg-amber-50">
                  Δ: {(difference * 100).toFixed(1)}%
                </div>
              </TooltipTrigger>
              <TooltipContent>
                Absolute difference vs your target service level
              </TooltipContent>
            </Tooltip>

            {/* Q* */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="px-2 py-1 rounded-md bg-emerald-50">
                  Q*: {Math.round(log.data.optimalOrderQuantity)}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                Optimal order quantity from that simulation
              </TooltipContent>
            </Tooltip>

          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );

}

export default SimulationResultCard