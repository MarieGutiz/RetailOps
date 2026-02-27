import { Outlet } from "react-router-dom";


const ReportsModuleLayout = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Reports</h2>
        <p className="text-sm text-muted-foreground">
          Consolidated inventory performance reports across models.
        </p>
      </div>

      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );

}

export default ReportsModuleLayout