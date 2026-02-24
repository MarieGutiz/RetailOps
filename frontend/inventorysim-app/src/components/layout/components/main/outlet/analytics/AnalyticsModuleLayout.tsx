import { Outlet } from "react-router-dom"

const AnalyticsModuleLayout = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Module-level header / description */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Analytics Module</h2>
        <p className="text-sm text-muted-foreground">
          View performance metrics, simulations insights, and inverse practice strategies.
        </p>
      </div>

      {/*  content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>

  )
}

export default AnalyticsModuleLayout