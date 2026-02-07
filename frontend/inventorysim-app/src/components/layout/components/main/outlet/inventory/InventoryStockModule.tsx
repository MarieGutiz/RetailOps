
import ModuleContainer from "../../ModuleContainer"
import ABCSummaryView from "@/views/ABCViews/ABCSummaryView"
import ParetoCurveView from "@/views/ABCViews/plots/ParetoCurveView"
import { useABCHover, useABCInput, useLoadABC } from "@/hooks/simulator/modules/abc/hooks/useABCInput"
import { ABC_SCENARIOS } from "@/lib/abc/buildABCTableData"
import { useInventoryStore } from "@/store/inventory/useInventoryStore"
import { useMemo, useState } from "react"
import { buildParetoData } from "@/lib/abc/buildParetoData"
import type { InventoryRow } from "@/types/inventory"
import InventoryStockView from "@/views/inventory/InventoryStockView"
import { Button } from "@/components/ui/Button"
import Info from "@/views/helpers/Info"
import { ABCAnalysisFrontend } from "@/services/domain/segmentation/ABCAnalysisFrontend"
import { useShopInventoryProducts } from "@/hooks/shop/useShopInventoryProducts"

const InventoryStockModule = () => {
  useLoadABC(100)
  const [selectedCase, setSelectedCase] =
    useState<keyof typeof ABC_SCENARIOS>("Baseline")

  const abcInput = useABCInput()
  
  // const products = useProductStore(s => s.products)
  // const inventory = useInventoryStore(s => s.inventory)
  // const loading = useInventoryStore(s => s.loading)
   
  const { products, inventory, loading } = useShopInventoryProducts();

  console.log("Products ", products , "  inventory ", inventory)

  // 1. Central ABC computation
  const { table: abcTableData, summary: abcSummary } = useMemo(
    () => ABCAnalysisFrontend(abcInput, ABC_SCENARIOS[selectedCase]),
    [abcInput, selectedCase]
  )

  // 2. Map category per product
  const abcMap = useMemo(
    () =>
      new Map(abcTableData.map(r => [String(r.product.id), r.category])),
    [abcTableData]
  )

  // 3. Contribution map for Pareto/hover
  const abcContributionMap = useMemo(() => {
    if (!abcSummary) return new Map<string, number>()
    return new Map<string, number>([
      ["A", abcSummary.A.valuePct],
      ["B", abcSummary.B.valuePct],
      ["C", abcSummary.C.valuePct],
    ])
  }, [abcSummary])

  // 4. Baseline for delta
  const baselineResult = useMemo(
    () => ABCAnalysisFrontend(abcInput, ABC_SCENARIOS.Baseline),
    [abcInput]
  )

  const abcDeltas = useMemo(() => {
    if (selectedCase === "Baseline") return null
    return {
      A: abcSummary.A.valuePct - baselineResult.summary.A.valuePct,
      B: abcSummary.B.valuePct - baselineResult.summary.B.valuePct,
      C: abcSummary.C.valuePct - baselineResult.summary.C.valuePct,
    }
  }, [abcSummary, baselineResult.summary, selectedCase])

  // 5. Map product name → category (Pareto projection)
  const nameToCategory = useMemo(() => {
    const map = new Map<string, "A" | "B" | "C">()
    abcTableData.forEach(r => map.set(r.product.name, r.category))
    return map
  }, [abcTableData])

  const paretoData = useMemo(() => buildParetoData(abcTableData), [abcTableData])

  const enrichedParetoData = useMemo(
    () =>
      paretoData.map(p => {
        const category = nameToCategory.get(p.name) ?? p.category
        const contributionPct = abcContributionMap.get(category)
        return { ...p, category, categoryContributionPct: contributionPct }
      }),
    [paretoData, nameToCategory, abcContributionMap]
  )

  // 6. Build inventory rows
  const rows = useMemo(() => {
    return inventory
      .map(item => {
        const product = products.find(p => String(p.id) === item.productId)
        if (!product) return null

        const abcClass = abcMap.get(String(product.id))

        return {
          product,
          quantity: item.quantity,
          inventoryValue: product.unitCost * item.quantity,
          revenue: product.unitPrice * item.quantity,
          totalProfit: (product.unitPrice - product.unitCost) * item.quantity,
          ...(abcClass ? { abcClass } : {}),
        }
      })
      .filter(Boolean) as InventoryRow[]
  }, [inventory, products, abcMap])

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => {
          acc.totalQuantity += row.quantity
          acc.inventoryValue += row.inventoryValue
          acc.revenue += row.revenue
          acc.totalProfit += row.totalProfit
          return acc
        },
        { totalQuantity: 0, inventoryValue: 0, revenue: 0, totalProfit: 0 }
      ),
    [rows]
  )

  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const updateQuantity = useInventoryStore(s => s.updateQuantity)
  const removeFromInventory = useInventoryStore(s => s.removeFromInventory)
  const { hoveredCategory, onHover } = useABCHover()

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
      onUserCaseChange={v => setSelectedCase(v as keyof typeof ABC_SCENARIOS)}
      actions={
        <>
          <Info scenarioKey={selectedCase} />
          <Button className="toolbar-element jbtn-flat-btn toolbar-element-md active">
            Simulate
          </Button>
          <Button className="toolbar-element jbtn-flat-btn toolbar-element-md">Reset</Button>
        </>
      }
    >
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
      </div>
    </ModuleContainer>
  )
}


export default InventoryStockModule