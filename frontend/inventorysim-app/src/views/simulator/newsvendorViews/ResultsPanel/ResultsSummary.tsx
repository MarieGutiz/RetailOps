import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatInt } from '../forms/hooks/useCurrency';

interface ResultsSummaryProps {
  result: {
    optimalOrderQuantity: number;
    expectedProfit: number;
    serviceLevel: number;
  };
  format: (value: number) => string;
}

const ResultsSummary = ({ result, format }: ResultsSummaryProps) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Recommended Order Quantity</CardTitle>
        <CardDescription>
          Based on your inputs and demand uncertainty
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Order quantity */}
        <div className="text-4xl font-bold text-center">
          {formatInt(result.optimalOrderQuantity)} units
        </div>

        {/* Metrics */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span>Expected profit</span>
            <span className="font-medium">
              {format(result.expectedProfit ?? 0)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>Chance of meeting customer demand</span>
            <span className="font-medium">
              {Math.round((result.serviceLevel ?? 0) * 100)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsSummary;
