import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type ProbabilityKind = 'criticalRatio' | 'serviceLevel';

interface OverviewProps {
  optimalQ: number;
  expectedProfit: number;
  probabilityValue: number;
  probabilityKind: ProbabilityKind;
  stdDeviation: number;
  label?: string;
}

const NewsvendorOverview = ({
  optimalQ,
  expectedProfit,
  probabilityValue,
  probabilityKind,
  stdDeviation,
  label,
}: OverviewProps) => {
  const isCR = probabilityKind === 'criticalRatio';

  return (
    <div className="space-y-3">
      {label && (
        <div className="text-sm font-semibold text-muted-foreground">
          {label}
        </div>
      )}

      <TooltipProvider>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Optimal Q */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="cursor-default hover:shadow-md transition">
                <CardContent className="text-center p-4">
                  <h4 className="text-gray-500 text-sm">Order Quantity (Q)</h4>
                  <p className="text-xl font-bold">{Math.round(optimalQ)}</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              Order quantity obtained from inverse demand distribution
            </TooltipContent>
          </Tooltip>

          {/* Expected Profit */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="cursor-default hover:shadow-md transition">
                <CardContent className="text-center p-4">
                  <h4 className="text-gray-500 text-sm">Expected Profit</h4>
                  <p className="text-xl font-bold">
                    {expectedProfit.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>Expected profit under this policy</TooltipContent>
          </Tooltip>

          {/* Probability Block */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="cursor-default hover:shadow-md transition">
                <CardContent className="text-center p-4">
                  <h4 className="text-gray-500 text-sm">
                    {isCR ? 'Critical Ratio' : 'Target Service Level'}
                  </h4>
                  <p className="text-xl font-bold">
                    {probabilityValue.toFixed(4)}
                  </p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              {isCR
                ? 'Economic fractile: Cu / (Cu + Co). Determines optimal service probability.'
                : 'User-defined service probability α used in inverse CDF.'}
            </TooltipContent>
          </Tooltip>

          {/* Std Dev */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="cursor-default hover:shadow-md transition">
                <CardContent className="text-center p-4">
                  <h4 className="text-gray-500 text-sm">Demand Std Dev</h4>
                  <p className="text-xl font-bold">{stdDeviation}</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>Demand variability parameter σ</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default NewsvendorOverview;
