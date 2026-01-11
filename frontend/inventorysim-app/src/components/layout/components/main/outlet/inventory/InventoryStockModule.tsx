
import ModuleContainer from "../../ModuleContainer"
import ABCSummaryView from "@/views/ABCViews/ABCSummaryView"
import ParetoCurveView from "@/views/ABCViews/plots/ParetoCurveView"
import { useABCHover, useABCInput, useABCSummary, useLoadABC } from "@/hooks/simulator/modules/abc/hooks/useABCInput"
import { ABC_SCENARIOS, buildABCTableData } from "@/lib/abc/buildABCTableData"
import { useInventoryStore } from "@/store/inventory/useInventoryStore"
import { useProductStore } from "@/store/inventory/useProductStore"
import { useMemo, useState } from "react"
import { buildParetoData } from "@/lib/abc/buildParetoData"
import type { InventoryRow } from "@/types/inventory"
import InventoryStockView from "@/views/inventory/InventoryStockView"
import { Button } from "@/components/ui/Button"

const InventoryStockModule = () => {
  useLoadABC(100)  //Fake delay to simulate loading
  const [selectedCase, setSelectedCase] = useState<keyof typeof ABC_SCENARIOS>("Baseline");

  const abcInput = useABCInput()
  // const scenarioThresholds = ABC_SCENARIOS[selectedCase];
  // const abcTableData = buildABCTableData(abcInput, scenarioThresholds);
  // const abcTableData = buildABCTableData(abcInput)

  const abcTableData = useMemo(
  () => buildABCTableData(abcInput, ABC_SCENARIOS[selectedCase]),
  [abcInput, selectedCase]
  );

  const paretoData = buildParetoData(abcTableData)

  const products = useProductStore((s) => s.products)
  const inventory = useInventoryStore((s) => s.inventory)
  const loading = useInventoryStore((s) => s.loading)

  const abcSummary = useABCSummary(abcTableData); // returns totalValue + A/B/C {count, valuePct}

  // Create a map of productId → ABC class
  const abcMap = useMemo(() => {
  return new Map(
    abcTableData.map(r => [String(r.product.id), r.category])
  );
}, [abcTableData]);

  // Map category → % contribution (from summary card)
  const abcContributionMap = useMemo(() => {
    if (!abcSummary) return new Map<string, number>();
    return new Map<string, number>([
      ["A", abcSummary.A.valuePct],
      ["B", abcSummary.B.valuePct],
      ["C", abcSummary.C.valuePct],
    ]);
  }, [abcSummary]);

  //Add to Pareto data the category contribution %
//   const enrichedParetoData = useMemo(() => {
//   return paretoData.map(p => ({
//     ...p,
//     categoryContributionPct: abcContributionMap.get(p.category),
//   }))
// }, [paretoData, abcContributionMap])

const nameToCategory = useMemo(() => {
  const map = new Map<string, "A" | "B" | "C">();
  abcTableData.forEach(r => map.set(r.product.name, r.category));
  return map;
}, [abcTableData]);

const enrichedParetoData = useMemo(() => {
  return paretoData.map(p => {
    const correctCategory = nameToCategory.get(p.name) ?? p.category;
    const contributionPct = abcContributionMap.get(correctCategory);
    // console.log("Mapping Pareto:", p.name, "category:", correctCategory, "contribution:", contributionPct);
    return {
      ...p,
      category: correctCategory,
      categoryContributionPct: contributionPct,
    };
  });
}, [paretoData, nameToCategory, abcContributionMap]);






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

    const { hoveredCategory, onHover } = useABCHover();


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
      onUserCaseChange={(value) =>{
          setSelectedCase(value as keyof typeof ABC_SCENARIOS);
          console.log("Selected ABC scenario:", value);
        }
      }
      actions={
        <>
          <Button className="jbtn-passive h-8 w-8 p-0 text-muted-foreground hover:text-black">
              <svg viewBox="0 0 24 24" className="h-4 w-4 hover:text-black">
                <path
                  d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"
                  fill="currentColor"
                />
              </svg>
       
          </Button>

          <Button className="toolbar-element jbtn-flat-btn toolbar-element-md active">
            Simulate
          </Button>
          <Button className="toolbar-element jbtn-flat-btn toolbar-element-md">
            Reset
          </Button>
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
        hoveredCategory={hoveredCategory}
        onHover={onHover}
        loading={loading}
      />


      <div className="mt-6 space-y-6">
        <ABCSummaryView summary={abcSummary} hoveredCategory={hoveredCategory} onHover={onHover} />
        <ParetoCurveView data={enrichedParetoData} hoveredCategory={hoveredCategory} onHover={onHover} />
        {/* WhatIfPanel */}
    </div>

    </ModuleContainer>
  )
}

export default InventoryStockModule