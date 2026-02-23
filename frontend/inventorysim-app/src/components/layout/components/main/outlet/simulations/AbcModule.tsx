import { Button } from "@/components/ui/Button";
import { useSelectedShop } from "@/hooks/shop/useSelectedShop";
import { useHydratedAbcSimulator } from "@/hooks/simulator/modules/abc/hooks/useHydratedAbcSimulator";
import NoSelectShop from "@/views/helpers/NoSelectShop";
import { useMemo, useState, useEffect } from "react";
import ModuleContainer from "../../ModuleContainer";
import Info from "@/views/helpers/Info";
import AbcForm from "@/views/ABCViews/AbcForms/AbcForm";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AbcResultsPanel from "@/views/ABCViews/ResultPanel/AbcResultsPanel";
import AbcDistributionPanel from "@/views/ABCViews/DistributionPanel/AbcDistributionPanel";

const ABC_INFO = {
  title: "ABC Inventory Classification",
  theory: "Segment items by their contribution to total value",
  description:
    "ABC analysis classifies items into A, B, C categories using either classic (value-based) or multi-criteria (value + demand) methods.",
};

const AbcModule = () => {
  const { shop: selectedShop } = useSelectedShop();

  const breadcrumbTrail = useMemo(
    () => [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Simulation", path: "/dashboard/simulations/abc" },
      { label: "ABC Analysis" },
    ],
    []
  );

  //  NO SHOP SELECTED
  if (!selectedShop) {
    return (
      <ModuleContainer
        title="ABC Simulation"
        subtitle="Classify inventory items into A/B/C categories"
        breadcrumbTrail={breadcrumbTrail}
      >
        <NoSelectShop />
      </ModuleContainer>
    );
  }

    const selectedUserCase = selectedShop.name;

    // New hydration pattern
    const { simulator, lastSimulatedRunId } =
      useHydratedAbcSimulator(selectedShop.id);

    const [activeTab, setActiveTab] = useState("parameters");

    // Auto-switch to Results if previous run exists
    useEffect(() => {
      if (lastSimulatedRunId && simulator.response) {
        setActiveTab("results");
      }
    }, [lastSimulatedRunId, simulator.response]);

    const handleRunSimulation = async (formData?: any) => {
      if (!formData || !formData.items?.length) {
        toast.error("Simulation request missing items");
        return;
      }

      setActiveTab("parameters");
      await simulator.run(formData);
    };

    const abcResult = simulator.response;

  console.log("ABC Result from store in module : ", abcResult);//ok
  return (
    <ModuleContainer
      title="ABC Simulation"
      subtitle="Classify inventory items into A/B/C categories"
      breadcrumbTrail={breadcrumbTrail}
      selectedUserCase={selectedUserCase}
      actions={
        <>
          <Info content={ABC_INFO} />
          <Button
            className="toolbar-element jbtn-flat-btn toolbar-element-md"
            disabled={simulator.isRunning || !simulator.lastRequest}
            onClick={() =>
              simulator.lastRequest &&
              handleRunSimulation(simulator.lastRequest)
            }
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
      "
    >
     <TabsList 
      className="bg-blue-200 backdrop-blur-sm shadow-md
       rounded-lg p-1 
       flex flex-wrap sm:flex-nowrap gap-2 sm:gap-2 
       border border-gray-200">

      <TabsTrigger
        value="parameters"
        className={`
          px-2 sm:px-4 py-1 sm:py-2 rounded-md transition-colors
          ${activeTab === "parameters" 
            ? "jbtn-success shadow-inner" 
            : "bg-blue-100 hover:bg-blue-200"}
        `}
      >
        Parameters
      </TabsTrigger>

      <TabsTrigger
        value="results"
        disabled={!simulator.hasResult}
        className={`
          px-2 sm:px-4 py-1 sm:py-2 rounded-md transition-colors
          ${activeTab === "results" 
            ? "jbtn-success shadow-inner" 
            : "bg-blue-100 hover:bg-blue-200"}
        `}
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
            : "bg-blue-100 hover:bg-blue-200"}
          w-auto
        `}
      >
        Distribution
        {simulator.hasResult && activeTab !== "distribution" && (
          <span 
            className="
            absolute -top-1 -right-1
            h-3 w-3 rounded-full
            bg-emerald-500
             animate-pulse" />
        )}
      </TabsTrigger>
    </TabsList>


        {/* PARAMETERS */}
        <TabsContent value="parameters" className="mt-8 sm:mt-4 w-full">
          <AbcForm 
           onSubmit={handleRunSimulation}
           disabled={simulator.isRunning} />
        </TabsContent>

        {/* RESULTS */}
        <TabsContent value="results" className="mt-8 sm:mt-4 w-full">
          <div className="">
              {abcResult ? (
                <AbcResultsPanel
                  response={abcResult}
                  isRunning={simulator.isRunning}
                />
              ) : (
                <div className="text-sm text-muted-foreground">
                  Run the simulation to see results.
                </div>
              )}
          </div>
        
      </TabsContent>

       {/* DISTRIBUTION */}
      <TabsContent value="distribution" className="mt-8 sm:mt-4 w-full">
        { abcResult ? (
          <AbcDistributionPanel
            response={abcResult}
            isRunning={simulator.isRunning}
          />
        ) : (
          <div className="text-sm text-muted-foreground">
            Category distribution will appear here.
          </div>
        )}
      </TabsContent>
      </Tabs>
    </ModuleContainer>
  );

}

export default AbcModule