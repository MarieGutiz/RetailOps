import { Outlet } from 'react-router-dom';

/**
 * Layout wrapper for the Simulator module.
 * Provides a header with title and description, and renders nested report routes via Outlet.
 */

const SimModuleLayout = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Simulation-level header / context */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Simulation Module</h2>
        <p className="text-sm text-muted-foreground">
          Run inventory simulations and analyze operational performance
        </p>
      </div>

      {/* Nested simulation views (Advanced ABC, EOQ, Newsvendor, etc.) */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default SimModuleLayout;
