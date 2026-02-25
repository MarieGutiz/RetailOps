import { Card, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";

interface Props<T> {
  log: T;
  header: ReactNode;
  metrics: ReactNode;
  onSelect: () => void;
}

function AnalyticsResultCard<T>({
  header,
  metrics,
  onSelect,
}: Props<T>) {
  return (
    <Card
      onClick={onSelect}
      className="
        cursor-pointer transition
        hover:shadow-md hover:border-blue-400
        border border-gray-200
      "
    >
      <CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          {header}
        </div>

        <div className="flex flex-wrap gap-4 text-sm font-medium">
          {metrics}
        </div>
      </CardContent>
    </Card>
  );

}

export default AnalyticsResultCard