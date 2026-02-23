import { Card } from "@/components/ui/card"
import ModuleContainer from "../../ModuleContainer"
import { useSelectedShop } from "@/hooks/shop/useSelectedShop";
import NoShopSelectedAlert from "@/components/layout/context/NoShopSelectedAlert";
import ShopCreationWizardDialog from "@/views/inventory/forms/ShopCreationWizardDialog";
import { useState } from "react";
import { useSimulationBitacora } from "@/views/Overview/hooks/useSimulationBitacora";
import SimulationLogCard from "@/views/Overview/Bitacora/SimulationLogCard";
import { Button } from "@/components/ui/Button";
import Info from "@/views/helpers/Info";
import { Label } from "@/components/ui/label";


const OVERVIEW_INFO = {
  title: "Overview Bitácora",
  description: `
This page provides a chronological record of all simulation activity executed within the selected shop.

Each entry summarizes the key metrics of the simulation, including performance indicators and calculated outcomes. 
The timeline allows you to review past decisions, compare results, and monitor operational risk exposure over time.

Use this page to track strategic adjustments and validate inventory optimization decisions across modules.
`,
};

const FILTERS_INFO = {
  title: "Filters & Risk Classification",
  description: `
Type Filter:
Allows you to display simulations by model:
• ABC – Revenue concentration analysis.
• EOQ – Economic Order Quantity - Cost-minimizing order quantity model.
• Newsvendor – Probabilistic demand optimization.

Risk Filter:
Simulations are classified into Low, Medium, or High risk based on model-specific thresholds:

• ABC – High revenue concentration in category A increases dependency risk.
• Newsvendor – Higher stockout probability increases operational risk.
• EOQ – Based on cost structure imbalance (if implemented).

Filters help isolate critical simulations and evaluate exposure levels efficiently.
`,
};

const DashboardOverviewModule = () => {
//   useEffect(() => {
//    testFloristFlowLocal();
//   // testShopABCLive("FLORIST", "classic");
// }, []);

  const { shop: selectedShop } = useSelectedShop();
  const logs = useSimulationBitacora(selectedShop?.id);

  const [wizardOpen, setWizardOpen] = useState(false);

  const handleShopCreated = () => {
    setWizardOpen(false);
    // The shop store should automatically update selectedShop via context/hooks
  };
  const [typeFilter, setTypeFilter] = useState<"all" | "abc" | "eoq" | "newsvendor">("all");
  const [riskFilter, setRiskFilter] = useState<"all" | "low" | "medium" | "high">("all");

  const getRiskLevel = (entry: any): "low" | "medium" | "high" => {
    if (entry.type === "abc") {
      const aPct = entry.data.summary.a.valuePct;
      if (aPct > 85) return "high";
      if (aPct > 75) return "medium";
      return "low";
    }

    if (entry.type === "newsvendor") {
      const stockout = 1 - entry.data.serviceLevel;
      if (stockout > 0.15) return "high";
      if (stockout > 0.08) return "medium";
      return "low";
    }

    return "low";
  };

  const filteredLogs = logs.filter((entry) => {
  const matchesType = typeFilter === "all" || entry.type === typeFilter;
  const matchesRisk =
    riskFilter === "all" || getRiskLevel(entry) === riskFilter;

  return matchesType && matchesRisk;
});
  return (
    <ModuleContainer
      title="Overview Bitácora"
      subtitle="Chronological record of all simulation activity"
      breadcrumbTrail={[{ label: "Dashboard" }, { label: "Overview" }]}
      actions={
        <div className="flex items-center gap-4 flex-wrap">
          {/* Page Info */}
          <span className="text-sm font-medium text-muted-foreground">
              About
            </span>
          <Info content={OVERVIEW_INFO} />        
        </div>
      }
     >
         {!selectedShop ? (
        <>
          <NoShopSelectedAlert onCreateShop={() => setWizardOpen(true)} />
          <ShopCreationWizardDialog
            open={wizardOpen}
            onOpenChange={setWizardOpen}
            onShopCreated={handleShopCreated}
          />
        </>
      ) : (
        <Card className="p-6 space-y-6">

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">

          {/* Type Filter */}
          <div className="flex gap-2 flex-wrap">
            {["all", "abc", "eoq", "newsvendor"].map((type) => (
              <Button
                key={type}
                onClick={() => setTypeFilter(type as any)}
                className={`toolbar-element jbtn-flat-btn toolbar-element-md active ${
                  typeFilter === type
                    ? "bg-primary text-primary-foreground"
                    : "bg-background hover:bg-muted"
                }`}
              >
                {type.toUpperCase()}
              </Button>
            ))}
          </div>

          {/* Risk Filter */}
          <div className="flex gap-2 flex-wrap">
            {["all", "low", "medium", "high"].map((risk) => (
              <Button
                key={risk}
                onClick={() => setRiskFilter(risk as any)}
                className="toolbar-element jbtn-flat-btn toolbar-element-md active"
                // className={`jbtn-passive p-0 text-muted-foreground ${
                //   riskFilter === risk
                //     ? "bg-primary text-primary-foreground"
                //     : "bg-background hover:bg-muted"
                // }`}
              >
                {risk.toUpperCase()}
              </Button>
               
    
            ))}
            <Info content={FILTERS_INFO} />
          </div>
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-gray-200 pl-6">
          {filteredLogs.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No simulations match your filters.
            </div>
          ) : (
            filteredLogs.map((entry, idx) => (
              <SimulationLogCard key={idx} entry={entry} />
            ))
          )}
        </div>
      </Card>
      )}
     </ModuleContainer>
  )
}

export default DashboardOverviewModule