import { Outlet } from 'react-router-dom';

/**
 * Layout wrapper for the Reports module.
 * Provides a header with title and description, and renders nested report routes via Outlet.
 */

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
};

export default ReportsModuleLayout;
