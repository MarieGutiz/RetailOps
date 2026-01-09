import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useABCInput, useABCSummary } from "@/hooks/simulator/modules/abc/hooks/useABCInput"
import ABCSummaryCard from "./ABCSummaryCard"

const ABCSummaryView = ({
  hoveredCategory,
  onHover
}: {
   hoveredCategory: "A" | "B" | "C" | null;
   onHover: (category: "A" | "B" | "C" | null) => void;
}) => {
  const abcInput = useABCInput()
  const summary = useABCSummary(abcInput)

  if (!summary) return null

  return (
    <Card className="shadow-sm overflow-hidden">
      <CardHeader>
        <CardTitle>ABC Summary</CardTitle>
        <p className="text-sm text-muted-foreground">
          Inventory value concentration by ABC classification
        </p>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ABCSummaryCard
            label="A"
            data={summary.A}
            hoveredCategory={hoveredCategory}
            onHover={onHover}
          />
          <ABCSummaryCard
            label="B"
            data={summary.B}
            hoveredCategory={hoveredCategory}
            onHover={onHover}
          />
          <ABCSummaryCard
            label="C"
            data={summary.C}
            hoveredCategory={hoveredCategory}
            onHover={onHover}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default ABCSummaryView