import InventoryStockView from "@/views/inventory/InventoryStockView"
import ModuleContainer from "../../ModuleContainer"
import ABCSummaryView from "@/views/ABCViews/ABCSummaryView"
import ParetoCurveView from "@/views/ABCViews/ParetoCurveView"
import { useABCInput, buildParetoData } from "@/hooks/simulator/modules/abc/useABCInput"
import { buildABCTableData } from "@/lib/abc/buildABCTableData"

const InventoryStockModule = () => {
  const abcInput = useABCInput()
  const abcTableData = buildABCTableData(abcInput)
  const paretoData = buildParetoData(abcTableData)
  return (
    <ModuleContainer
      title="Inventory Stock"
      subtitle="Define your stock levels for inventory"
      breadcrumbTrail={[
        { label: "Dashboard", path: "/dashboard" },
        { label: "Inventory", path: "/dashboard/inventory" },
        { label: "Stock" },
      ]}
      userCases={["Baseline", "Optimistic", "Pessimistic"]}
      onUserCaseChange={(value) =>
        console.log("Selected stock scenario:", value)
      }
      actions={
        <>
          <button className="toolbar-element jbtn-flat-btn toolbar-element-md active">
            Simulate
          </button>
          <button className="toolbar-element jbtn-flat-btn toolbar-element-md">
            Reset
          </button>
        </>
      }
    >
      <InventoryStockView />
      <div className="mt-6 space-y-6">
        <ABCSummaryView />
        <ParetoCurveView data={paretoData} />
        {/* WhatIfPanel */}
    </div>

    </ModuleContainer>
  )
}

export default InventoryStockModule