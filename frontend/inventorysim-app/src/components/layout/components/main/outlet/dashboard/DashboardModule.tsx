import ModuleContainer from "../../ModuleContainer";

const DashboardModule = () => {
  return (
    <ModuleContainer
      title="Dashboard Home"
      subtitle="Overview of your modules"
      breadcrumbTrail={[
        { label: "Home", path: "/" },
        { label: "Dashboard" },
      ]}
    >
      <div>Welcome to your dashboard!</div>
    </ModuleContainer>
  );
}

export default DashboardModule