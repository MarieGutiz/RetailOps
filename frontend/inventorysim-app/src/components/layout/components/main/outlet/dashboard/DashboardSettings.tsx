import CurrencySettings from "@/components/layout/context/CurrencySettings";
import { Card, CardContent } from "@/components/ui/card";
import { useSimulatorStore } from "@/store/user/useSimulatorStore";

const DashboardSettings = () => {
  const { currency, unit, horizon, stockPolicy } = useSimulatorStore();
  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-lg font-semibold">Dashboard Settings</h2>

      {/* Legend Card */}
      <Card className="relative w-full max-w-md border rounded-lg pt-6">
        {/* Legend cut-out */}
        <div className="absolute -top-3 left-4 bg-background px-2 text-sm font-medium text-muted-foreground">
          Current Simulator Settings
        </div>

        <CardContent className="space-y-4">
          {/* Read-only overview */}
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-muted-foreground">Currency</span>
            <span className="font-medium">{currency}</span>

            <span className="text-muted-foreground">Unit</span>
            <span className="font-medium">{unit}</span>

            <span className="text-muted-foreground">Horizon (days)</span>
            <span className="font-medium">{horizon}</span>

            <span className="text-muted-foreground">Stock Policy</span>
            <span className="font-medium">{stockPolicy}</span>
          </div>

          {/* Editable controls */}
          <div className="pt-4 border-t">
            <CurrencySettings />
          </div>
        </CardContent>
      </Card>
    </Card>
  );

}

export default DashboardSettings