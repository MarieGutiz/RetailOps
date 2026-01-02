import ModuleContainer from "../../ModuleContainer";
import DashboardSettings from "./DashboardSettings";

const DashboardModule = () => {
  return (
    <ModuleContainer
      title="Dashboard Home"
      subtitle="Overview of your modules"
      breadcrumbTrail={[
        { label: "Dashboard", path: "/dashboard" },
        { label: "" },
      ]}
    >
      <div>Welcome to your dashboard!</div>
      <DashboardSettings />
    </ModuleContainer>
  );
}

export default DashboardModule