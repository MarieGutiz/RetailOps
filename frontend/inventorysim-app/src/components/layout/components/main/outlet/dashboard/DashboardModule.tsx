import ModuleContainer from "../../ModuleContainer";

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
    </ModuleContainer>
  );
}

export default DashboardModule