import { Outlet } from "react-router-dom"

const InventoryModuleLayout = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Optional: inventory-level header / filters */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Inventory Module</h2>
        <p className="text-sm text-muted-foreground">Manage your products and stock</p>
      </div>
      <Outlet />
    </div>
  )
}

export default InventoryModuleLayout