import { Card } from "@/components/ui/card"
import ModuleContainer from "../../ModuleContainer"

import { useEffect } from "react";
import { testFloristFlowLocal, testShopABCLive } from "@/hooks/simulator/engines/testFloristFlow";

const DashboardOverviewModule = () => {
//   useEffect(() => {
//    testFloristFlowLocal();
//   // testShopABCLive("FLORIST", "classic");
// }, []);
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