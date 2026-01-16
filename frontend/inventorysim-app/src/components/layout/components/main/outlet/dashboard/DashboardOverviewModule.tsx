import { Card } from "@/components/ui/card"
import ModuleContainer from "../../ModuleContainer"
import { testFloristEndpointLive, testFloristFlowLocal } from "@/hooks/simulator/engines/testFloristFlow";
import { useEffect } from "react";

const DashboardOverviewModule = () => {
  useEffect(() => {
  // testFloristFlowLocal();
  testFloristEndpointLive();
}, []);
  return (
    <ModuleContainer
      title="Dashboard Overview"
      subtitle="Dashboard summary"
     >
        <Card className="p-6">
          Dashboard Overview Content
        </Card>
     </ModuleContainer>
  )
}

export default DashboardOverviewModule