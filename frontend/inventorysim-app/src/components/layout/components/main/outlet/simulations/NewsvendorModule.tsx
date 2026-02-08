import  { Button } from "@/components/ui/Button";
import { useSelectedShop } from "@/hooks/shop/useSelectedShop";
import { useMemo } from "react";
import ModuleContainer from "../../ModuleContainer";
import Info from "@/views/helpers/Info";
import { useSimulator } from "@/hooks/simulator/modules/abc/hooks/userSimulator";

const NEWSVENDOR_INFO = {
  title: "Newsvendor Model",
  theory: "Single-period inventory optimization",
  description:
    "The Newsvendor model determines the optimal order quantity under uncertain demand by balancing overstock and understock costs.",
};

const NewsvendorModule = () => {
  const { shop: selectedShop } = useSelectedShop();

  if (!selectedShop) return null; //Create a message

  const simulator = useSimulator(selectedShop.id, selectedShop.name);

  const selectedUserCase = selectedShop.name;


  const breadcrumbTrail = useMemo(
    () => [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Simulation", path: "/dashboard/simulations/newsvendor" },
      { label: "Newsvendor" },
    ],
    []
  );
 console.log("Rendering NewsvendorModule with simulator state:")
  return (
   
    <ModuleContainer
      title="Newsvendor Simulation"
      subtitle="Optimize single-period inventory decisions under uncertainty"
      breadcrumbTrail={breadcrumbTrail}
      selectedUserCase={selectedUserCase}
      actions={
        <>
          <Info content={NEWSVENDOR_INFO} />
          <Button className="toolbar-element jbtn-flat-btn toolbar-element-md">
            Run simulation
          </Button>
        </>
      }
    >
      {/* ───────────── INPUT SECTION ───────────── */}
      <section className="mb-6">
        <h3 className="text-md font-semibold mb-2">Model Parameters</h3>

        {/* Placeholder for form */}
        <div className="text-sm text-muted-foreground">
          Demand distribution, pricing, and simulation settings will be configured here.
        </div>
      </section>

      {/* ───────────── RESULTS SECTION ───────────── */}
      <section className="mb-6">
        <h3 className="text-md font-semibold mb-2">Results</h3>

        {/* Placeholder for KPIs */}
        <div className="text-sm text-muted-foreground">
          Optimal order quantity, critical ratio, and expected profit will appear here.
        </div>
      </section>

      {/* ───────────── VISUALIZATION SECTION ───────────── */}
      <section>
        <h3 className="text-md font-semibold mb-2">Demand Distribution</h3>

        {/* Placeholder for PDF / markers */}
        <div className="text-sm text-muted-foreground">
          Normal distribution curve with mean, order quantity, and critical ratio markers.
        </div>
      </section>
    </ModuleContainer>
  );
};


export default NewsvendorModule