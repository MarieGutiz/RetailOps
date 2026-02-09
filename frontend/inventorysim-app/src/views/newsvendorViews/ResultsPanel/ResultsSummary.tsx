import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ResultsSummaryProps {
  result: {
    optimalOrderQuantity: number
    expectedProfit: number
    serviceLevel: number
  }
}

const ResultsSummary = ({result} : ResultsSummaryProps) => {
    return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Recommended Order Quantity</CardTitle>
        <CardDescription>
          Based on your inputs and demand uncertainty
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Large order quantity */}
        <div className="text-4xl font-bold text-center">
          {result.optimalOrderQuantity} units
        </div>

        {/* Metrics */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span>Expected profit</span>
            <span className="font-medium">€{result.expectedProfit.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Chance of meeting customer demand</span>
            <span className="font-medium">{(result.serviceLevel * 100).toFixed(0)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

}

export default ResultsSummary