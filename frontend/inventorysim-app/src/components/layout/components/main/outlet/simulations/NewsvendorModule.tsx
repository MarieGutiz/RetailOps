import  { Button } from "@/components/ui/Button";
import { useSelectedShop } from "@/hooks/shop/useSelectedShop";
import { useMemo } from "react";
import ModuleContainer from "../../ModuleContainer";
import Info from "@/views/helpers/Info";
import { useSimulator } from "@/hooks/simulator/modules/abc/hooks/userSimulator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewsvendorForm from "@/views/newsvendorViews/forms/NewsvendorForm";
import NoSelectShop from "@/views/helpers/NoSelectShop";
import ResultsPanel from "@/views/newsvendorViews/ResultsPanel/ResultsPanel";

const NEWSVENDOR_INFO = {
  title: "Newsvendor Model",
  theory: "Single-period inventory optimization",
  description:
    "The Newsvendor model determines the optimal order quantity under uncertain demand by balancing overstock and understock costs.",
};

const NewsvendorModule = () => {
  const { shop: selectedShop } = useSelectedShop();

  const breadcrumbTrail = useMemo(
    () => [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Simulation", path: "/dashboard/simulations/newsvendor" },
      { label: "Newsvendor" },
    ],
    []
  );

  //  NO SHOP SELECTED 
  if (!selectedShop) {
    return (
      <ModuleContainer
        title="Newsvendor Simulation"
        subtitle="Optimize single-period inventory decisions under uncertainty"
        breadcrumbTrail={breadcrumbTrail}
      >
        <NoSelectShop />
      </ModuleContainer>
    );
  }

  
  //  SHOP EXISTS → LOAD SIMULATOR
  const simulator = useSimulator(selectedShop.id, selectedShop.name);
  const selectedUserCase = selectedShop.name;

  return (
    <ModuleContainer
      title="Newsvendor Simulation"
      subtitle="Optimize single-period inventory decisions under uncertainty"
      breadcrumbTrail={breadcrumbTrail}
      selectedUserCase={selectedUserCase}
      actions={
        <>
          <Info content={NEWSVENDOR_INFO} />
          <Button
            className="toolbar-element jbtn-flat-btn toolbar-element-md"
            disabled={simulator.isRunning}
          >
            Run simulation
          </Button>
        </>
      }
    >
      <Tabs defaultValue="parameters" className="w-full">
        <TabsList>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="results" disabled={!simulator.hasResult}>
            Results
          </TabsTrigger>
          <TabsTrigger value="distribution" disabled={!simulator.hasResult}>
            Distribution
          </TabsTrigger>
        </TabsList>

        {/* ───────────── PARAMETERS ───────────── */}
        <TabsContent value="parameters" className="mt-4">
          <NewsvendorForm
            onSubmit={simulator.run}
            disabled={simulator.isRunning}
          />
        </TabsContent>

        {/* ───────────── RESULTS ───────────── */}
        <TabsContent value="results" className="mt-4">
          {simulator.response ? (
            <ResultsPanel result={simulator.response} />
          ) : (
            <div className="text-sm text-muted-foreground">
              Run the simulation to see results.
            </div>
          )}
        </TabsContent>


        {/* ───────────── DISTRIBUTION ───────────── */}
        <TabsContent value="distribution" className="mt-4">
          <div className="text-sm text-muted-foreground">
            Demand distribution and markers will appear here.
          </div>
        </TabsContent>
      </Tabs>
    </ModuleContainer>
  );
};


export default NewsvendorModule