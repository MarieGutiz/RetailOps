
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
import Info from "@/views/ABCViews/info/Info"

const InventoryStockModule = () => {
  useLoadABC(100)  //Fake delay to simulate loading
  const [selectedCase, setSelectedCase] = useState<keyof typeof ABC_SCENARIOS>("Baseline");

  const abcInput = useABCInput()

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

  //Calculate the delta (delta vs. baseline) when is not baseline

  const baselineTable = useMemo(
  () => buildABCTableData(abcInput, ABC_SCENARIOS.Baseline),
  [abcInput]
)

const baselineSummary = useABCSummary(baselineTable)

const abcDeltas = useMemo(() => {
  if (!abcSummary || !baselineSummary || selectedCase === "Baseline") {
    return null
  }

  return {
    A: abcSummary.A.valuePct - baselineSummary.A.valuePct,
    B: abcSummary.B.valuePct - baselineSummary.B.valuePct,
    C: abcSummary.C.valuePct - baselineSummary.C.valuePct,
  }
}, [abcSummary, baselineSummary, selectedCase])



const nameToCategory = useMemo(() => {
  const map = new Map<string, "A" | "B" | "C">();
  abcTableData.forEach(r => map.set(r.product.name, r.category));
  return map;
}, [abcTableData]);

const enrichedParetoData = useMemo(() => {
  return paretoData.map(p => {
    const correctCategory = nameToCategory.get(p.name) ?? p.category;
    const contributionPct = abcContributionMap.get(correctCategory);
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
          <Info scenarioKey={selectedCase} />
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
        <ABCSummaryView summary={abcSummary} deltas={abcDeltas} hoveredCategory={hoveredCategory} onHover={onHover} />
        <ParetoCurveView data={enrichedParetoData} hoveredCategory={hoveredCategory} onHover={onHover} />
        {/* WhatIfPanel */}
    </div>

    </ModuleContainer>
  )
}

export default InventoryStockModule