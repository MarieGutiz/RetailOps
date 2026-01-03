import { useUserStore } from "@/store/user/useUserStore";
import ModuleContainer from "../../ModuleContainer";
import DashboardSettings from "./DashboardSettings";

const DashboardModule = () => {
 const { user } = useUserStore();
  return (
    <ModuleContainer
      title="Dashboard Home"
      subtitle="Overview of your modules"
      breadcrumbTrail={[
        { label: "Dashboard", path: "/dashboard" },
        { label: "" },
      ]}
    >
      <h2 className="text-lg font-semibold pb-1">Welcome to your dashboard, {user.name || user.username}!</h2>
      <DashboardSettings />
    </ModuleContainer>

    
  );

  
}

export default DashboardModule