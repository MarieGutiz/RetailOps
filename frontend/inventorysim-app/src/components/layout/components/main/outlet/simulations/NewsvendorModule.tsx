import  { Button } from "@/components/ui/Button";
import { useSelectedShop } from "@/hooks/shop/useSelectedShop";
import { useEffect, useMemo, useState } from "react";
import ModuleContainer from "../../ModuleContainer";
import Info from "@/views/helpers/Info";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewsvendorForm from "@/views/newsvendorViews/forms/NewsvendorForm";
import NoSelectShop from "@/views/helpers/NoSelectShop";
import ResultsPanel from "@/views/newsvendorViews/ResultsPanel/NewsvendorResultsPanel";
import DistributionPanel from "@/views/newsvendorViews/DistributionPanel/DistributionPanel";
import { toast } from "sonner";
import { useHydratedNewsvendorSimulator } from "@/hooks/simulator/modules/newsvendors/hooks/useHydratedNewsvendorSimulator";
import { useSimulationStore } from "@/store/simulations/useSimulationStore";

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
  // const simulator = useSimulator(selectedShop.id, selectedShop.name);
  const selectedUserCase = selectedShop.name;

   // Hydrate simulator & last simulated product
  const { simulator, lastSimulatedProduct } = useHydratedNewsvendorSimulator(selectedShop.id, selectedShop.name);


    // Controlled Tabs state
  const [activeTab, setActiveTab] = useState("parameters");

   // Auto-switch to Results if previous run exists
  useEffect(() => {
    if (lastSimulatedProduct && simulator.response) {
      setActiveTab("results");
    }
  }, [lastSimulatedProduct, simulator.response]);

  // Unified run function
  const handleRunSimulation = async (formData?: any) => {
    if (!formData.productName) {
      toast.error("Simulation request missing productName");
      return console.error("Simulation request missing productName");
    }

    setActiveTab("parameters");
    await simulator.run(formData);
  };

  const storeState = useSimulationStore.getState();
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
            disabled={simulator.isRunning || !simulator.lastRequest}
            onClick={() => simulator.lastRequest && handleRunSimulation(simulator.lastRequest)}
          >
            Run Last Simulation
          </Button>
        </>
      }
    >
      <Tabs 
       value={activeTab}
       onValueChange={setActiveTab}
       className="
          bg-white/70 backdrop-blur-sm shadow-md 
          rounded-lg p-1 
          flex flex-wrap sm:flex-nowrap 
          gap-1 sm:gap-2 
          border border-gray-200
        ">
      {/* Tab Holder */}
      <TabsList 
      className="
      bg-red-200 backdrop-blur-sm shadow-md 
       rounded-lg p-1
       flex flex-wrap sm:flex-nowrap gap-2 sm:gap-2 
       border border-gray-200">
        <TabsTrigger
          value="parameters"
          className={`
            px-2 sm:px-4 py-1 sm:py-2 rounded-md transition-colors ${
            activeTab === "parameters" ? "jbtn-success shadow-inner" : "hover:bg-gray-100"
          }`}
        >
          Parameters
        </TabsTrigger>

        <TabsTrigger
          value="results"
           disabled={!lastSimulatedProduct}
          className={`
            px-2 sm:px-4 py-1 sm:py-2 rounded-md transition-colors ${
            activeTab === "results" ? "jbtn-success shadow-inner" : "hover:bg-gray-100"
          }`}
        >
          Results
        </TabsTrigger>

        <TabsTrigger
            value="distribution"
            disabled={!simulator.hasResult}
            className={`
              relative px-2 sm:px-4 py-1 sm:py-2 rounded-md transition-colors
              ${activeTab === "distribution"
                ? "jbtn-success shadow-inner"
                : "hover:bg-gray-100"
              }
            `}
          >
            Distribution

            {simulator.hasResult && activeTab !== "distribution" && (
              <span
               className="
                absolute -top-1 -right-1
                h-3 w-3
                rounded-full
                bg-emerald-500
                animate-pulse
              " />
            )}
          </TabsTrigger>

      </TabsList>

      {/* PARAMETERS */}
      <TabsContent value="parameters" className="mt-8 sm:mt-4 w-full">
        <NewsvendorForm
          onSubmit={handleRunSimulation}
          disabled={simulator.isRunning}
        />
      </TabsContent>

      {/* RESULTS */}
      <TabsContent value="results" className="mt-8 sm:mt-4 w-full">
         {lastSimulatedProduct &&
          storeState.newsvendorSimulations[selectedShop.id]?.[lastSimulatedProduct] ? (
            <ResultsPanel
              result={storeState.newsvendorSimulations[selectedShop.id][lastSimulatedProduct].response}
            />

        ) : (
          <div className="text-sm text-muted-foreground">
            Run the simulation to see results.
          </div>
        )}
      </TabsContent>

      {/* DISTRIBUTION */}
      <TabsContent value="distribution" className="mt-8 sm:mt-4 w-full">
        
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