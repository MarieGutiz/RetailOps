import  { Button } from "@/components/ui/Button";
import { useSelectedShop } from "@/hooks/shop/useSelectedShop";
import { useEffect, useMemo, useState } from "react";
import ModuleContainer from "../../ModuleContainer";
import Info from "@/views/helpers/Info";
import { useSimulator } from "@/hooks/simulator/modules/abc/hooks/userSimulator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewsvendorForm from "@/views/newsvendorViews/forms/NewsvendorForm";
import NoSelectShop from "@/views/helpers/NoSelectShop";
import ResultsPanel from "@/views/newsvendorViews/ResultsPanel/ResultsPanel";
import DistributionPanel from "@/views/newsvendorViews/DistributionPanel/DistributionPanel";

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

    // Controlled Tabs state
  const [activeTab, setActiveTab] = useState("parameters");

  // Auto-switch to Results after simulation
  useEffect(() => {
    if (simulator.hasResult) {
      setActiveTab("results");
    }
  }, [simulator.hasResult]);

  // Unified run function
  const handleRunSimulation = async (formData?: any) => {
    // Optional: reset tab to parameters while running
    setActiveTab("parameters");

    // Call simulator.run with formData if provided, otherwise use last known inputs
    await simulator.run(formData);
  };
  // console.log("response:", simulator.response);
  // console.log("lastRequest:", simulator.lastRequest);


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
            // onClick={() => handleRunSimulation()}
          >
           Run EOQ
          </Button>
        </>
      }
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      {/* Tab Holder */}
      <TabsList className="bg-white/70 backdrop-blur-sm shadow-md rounded-lg p-1 flex gap-2 border border-gray-200">
        <TabsTrigger
          value="parameters"
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === "parameters" ? "jbtn-success shadow-inner" : "hover:bg-gray-100"
          }`}
        >
          Parameters
        </TabsTrigger>

        <TabsTrigger
          value="results"
          disabled={!simulator.hasResult}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === "results" ? "jbtn-success shadow-inner" : "hover:bg-gray-100"
          }`}
        >
          Results
        </TabsTrigger>

        <TabsTrigger
          value="distribution"
          disabled={!simulator.hasResult}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === "distribution" ? "jbtn-success shadow-inner" : "hover:bg-gray-100"
          }`}
        >
          Distribution
        </TabsTrigger>
      </TabsList>

      {/* PARAMETERS */}
      <TabsContent value="parameters" className="mt-4">
        <NewsvendorForm
          onSubmit={handleRunSimulation}
          disabled={simulator.isRunning}
        />
      </TabsContent>

      {/* RESULTS */}
      <TabsContent value="results" className="mt-4">
        {simulator.response ? (
          <ResultsPanel result={simulator.response} />
        ) : (
          <div className="text-sm text-muted-foreground">
            Run the simulation to see results.
          </div>
        )}
      </TabsContent>

      {/* DISTRIBUTION */}
      <TabsContent value="distribution" className="mt-4">
        
          {
          simulator.response &&
          simulator.lastRequest &&
          simulator.pdf ? (
            <DistributionPanel 
                response={simulator.response}
                request={simulator.lastRequest}
                simId={simulator.simId}
                shopName={selectedShop.name}
            />
          ):(
          <div className="text-sm text-muted-foreground">
            Demand distribution and markers will appear here.
          </div>
            )}
      </TabsContent>
    </Tabs>



    </ModuleContainer>
  );

};


export default NewsvendorModule