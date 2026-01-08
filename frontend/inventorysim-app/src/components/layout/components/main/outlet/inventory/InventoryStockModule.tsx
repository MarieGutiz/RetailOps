import InventoryStockView, { type InventoryRow } from "@/views/inventory/InventoryStockView"
import ModuleContainer from "../../ModuleContainer"
import ABCSummaryView from "@/views/ABCViews/ABCSummaryView"
import ParetoCurveView from "@/views/ABCViews/plots/ParetoCurveView"
import { useABCInput, buildParetoData, useABCSummary } from "@/hooks/simulator/modules/abc/hooks/useABCInput"
import { buildABCTableData } from "@/lib/abc/buildABCTableData"
import { useInventoryStore } from "@/store/inventory/useInventoryStore"
import { useProductStore } from "@/store/inventory/useProductStore"
import { useMemo, useState } from "react"

const InventoryStockModule = () => {
  const abcInput = useABCInput()
  const abcTableData = buildABCTableData(abcInput)
  const paretoData = buildParetoData(abcTableData)

  const products = useProductStore((s) => s.products)
  const inventory = useInventoryStore((s) => s.inventory)

  const abcSummary = useABCSummary(abcInput); // returns totalValue + A/B/C {count, valuePct}

  // Create a map of productId → ABC class
  const abcMap = useMemo(() => {
    return new Map(
      buildABCTableData(abcInput).map(r => [String(r.product.id), r.category])
    );
}, [abcInput]);

  // Map category → % contribution (from summary card)
  const abcContributionMap = useMemo(() => {
    if (!abcSummary) return new Map<string, number>();
    return new Map<string, number>([
      ["A", abcSummary.A.valuePct],
      ["B", abcSummary.B.valuePct],
      ["C", abcSummary.C.valuePct],
    ]);
  }, [abcSummary]);

  // Build inventory rows with ABC data
const rows = useMemo(() => {
  return inventory
    .map((item) => {
      const product = products.find(p => String(p.id) === item.productId);
      if (!product) return null;

      const abcClass = abcMap.get(String(product.id));
      const categoryContribution = abcClass ? abcContributionMap.get(abcClass) : undefined;

      const unitCost = product.unitCost;
      const unitPrice = product.unitPrice;
      const quantity = item.quantity;

      return {
        product,
        quantity,
        inventoryValue: unitCost * quantity,
        revenue: unitPrice * quantity,
        totalProfit: (unitPrice - unitCost) * quantity,
        ...(abcClass ? { abcClass } : {}),
        ...(categoryContribution != null ? { categoryContributionPct: categoryContribution } : {}),
      };
    })
    .filter((row): row is InventoryRow => row !== null);
}, [inventory, products, abcMap, abcContributionMap]);


//   // Create a map for quick ABC lookup
//   const abcMap = useMemo(() => {
//       return new Map(
//         abcTableData.map(r => [String(r.product.id), r.category])
//       )
//     }, [abcTableData])  

//   // Create a map for quick Pareto lookup
//   const paretoMap = useMemo(() => {
//   return new Map(
//     abcTableData.map(r => [
//       String(r.product.id),
//       {
//         abcClass: r.category,
//         paretoSharePct: r.cumulative, // 0-100%
//       },
//     ])
//   )
// }, [abcTableData])


 
//   const rows = useMemo(() => {
//   return inventory
//     .map((item) => {
//       const product = products.find((p) => String(p.id) === item.productId)
//       if (!product) return null // skip missing product
//       // Get ABC class from map
//       const abcClass = abcMap.get(String(product.id))
//       // Get Pareto data from map
//       const pareto = paretoMap.get(String(product.id))

//       const unitCost = product.unitCost
//       const unitPrice = product.unitPrice
//       const quantity = item.quantity

//       return {
//         product,
//         quantity,
//         inventoryValue: unitCost * quantity,
//         revenue: unitPrice * quantity,
//         totalProfit: (unitPrice - unitCost) * quantity,
//         ...(abcClass ? { abcClass } : {}),
//          ...(pareto ? { paretoSharePct: pareto.paretoSharePct } : {}),
//       }
//     })
//     .filter((row): row is InventoryRow => row !== null)
// }, [inventory, products])


// Calculate totals --footer of the table
const totals = useMemo(() => {
  return rows.reduce(
    (acc, row) => {
      acc.totalQuantity += row.quantity
      acc.inventoryValue += row.inventoryValue
      acc.revenue += row.revenue
      acc.totalProfit += row.totalProfit
      return acc
    },
    {
      totalQuantity: 0,
      inventoryValue: 0,
      revenue: 0,
      totalProfit: 0,
    }
  )
}, [rows])
    const [selectedProduct, setSelectedProduct] = useState<any>(null)

    const updateQuantity = useInventoryStore((s) => s.updateQuantity)
    const removeFromInventory = useInventoryStore( (s) => s.removeFromInventory )

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
      {/* <InventoryStockView /> */}
      <InventoryStockView
        rows={rows}
        totals={totals}
        onQuantityChange={updateQuantity}
        onRemove={removeFromInventory}
        selectedProduct={selectedProduct}
        onSelectProduct={setSelectedProduct}
      />


      <div className="mt-6 space-y-6">
        <ABCSummaryView />
        <ParetoCurveView data={paretoData} />
        {/* WhatIfPanel */}
    </div>

    </ModuleContainer>
  )
}

export default InventoryStockModule