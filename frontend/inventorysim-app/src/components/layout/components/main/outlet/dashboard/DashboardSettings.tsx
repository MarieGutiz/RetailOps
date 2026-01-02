import CurrencySettings from "@/components/layout/context/CurrencySettings";
import { Card } from "@/components/ui/card";

const DashboardSettings = () => {

  return (
    <Card className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Dashboard Settings</h2>

      {/* Currency Selector */}
      <CurrencySettings /> 

      {/* Future settings can go here */}
    </Card>
  );
}

export default DashboardSettings