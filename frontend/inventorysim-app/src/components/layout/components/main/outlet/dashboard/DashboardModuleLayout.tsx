import { Outlet } from "react-router-dom";

const DashboardModuleLayout = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Optional: inventory-level header / filters */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Dashboard Module</h2>
        <p className="text-sm text-muted-foreground">Manage setting and overview of your dashboard</p>
      </div>
      <Outlet />
    </div>    
  );

  
}

export default DashboardModuleLayout