import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useABCInput, useABCSummary } from "@/hooks/simulator/modules/abc/hooks/useABCInput"
import ABCSummaryCard from "./ABCSummaryCard"

const ABCSummaryView = () => {
  const abcInput = useABCInput()
  const summary = useABCSummary(abcInput)

  if (!summary) return null

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>ABC Summary</CardTitle>
        <p className="text-sm text-muted-foreground">
          Inventory value concentration by ABC classification
        </p>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ABCSummaryCard label="A" data={summary.A} />
          <ABCSummaryCard label="B" data={summary.B} />
          <ABCSummaryCard label="C" data={summary.C} />
        </div>
      </CardContent>
    </Card>
  )
}

export default ABCSummaryView