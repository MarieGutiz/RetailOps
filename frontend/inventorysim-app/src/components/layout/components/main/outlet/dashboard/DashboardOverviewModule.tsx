import { Card } from "@/components/ui/card"
import ModuleContainer from "../../ModuleContainer"

const DashboardOverviewModule = () => {
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