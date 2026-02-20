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

  // Hydrate simulator & last simulated product
  const { simulator, lastSimulatedProduct } = useHydratedAbcSimulator(
    selectedShop.id,
    selectedShop.name
  );

  const [activeTab, setActiveTab] = useState("parameters");

  // Auto-switch to Results if previous run exists
  useEffect(() => {
    if (lastSimulatedProduct && simulator.response) {
      setActiveTab("results");
    }
  }, [lastSimulatedProduct, simulator.response]);

  const handleRunSimulation = async (formData?: any) => {
    if (!formData || !formData.items?.length) {
      toast.error("Simulation request missing items");
      return console.error("Simulation request missing items");
    }

    setActiveTab("parameters");
    await simulator.run(formData);
  };

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
              simulator.lastRequest && handleRunSimulation(simulator.lastRequest)
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
        className="w-full flex flex-col gap-4"
      >
        <TabsList className="flex gap-2 border-b border-gray-200">
          <TabsTrigger
            value="parameters"
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === "parameters"
                ? "jbtn-success shadow-inner"
                : "hover:bg-gray-100"
            }`}
          >
            Parameters
          </TabsTrigger>

          <TabsTrigger
            value="results"
            disabled={!lastSimulatedProduct}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === "results"
                ? "jbtn-success shadow-inner"
                : "hover:bg-gray-100"
            }`}
          >
            Results
          </TabsTrigger>

          <TabsTrigger
            value="distribution"
            disabled={!simulator.hasResult}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === "distribution"
                ? "jbtn-success shadow-inner"
                : "hover:bg-gray-100"
            }`}
          >
            Distribution
            {simulator.hasResult && activeTab !== "distribution" && (
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </TabsTrigger>
        </TabsList>

        {/* PARAMETERS */}
        <TabsContent value="parameters" className="mt-4 w-full">
          <AbcForm onSubmit={handleRunSimulation} disabled={simulator.isRunning} />
        </TabsContent>

        {/* RESULTS */}
        <TabsContent value="results" className="mt-4 w-full">
          <div className="text-sm text-muted-foreground">
            {simulator.response
              ? "Simulation results will appear here."
              : "Run the simulation to see results."}
          </div>
        </TabsContent>

        {/* DISTRIBUTION */}
        <TabsContent value="distribution" className="mt-4 w-full">
          <div className="text-sm text-muted-foreground">
            ABC category distribution will appear here after running the simulation.
          </div>
        </TabsContent>
      </Tabs>
    </ModuleContainer>
  );

}

export default AbcModule