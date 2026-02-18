import { Button } from "@/components/ui/Button";
import { useSelectedShop } from "@/hooks/shop/useSelectedShop";
import { useHydratedEoqSimulator } from "@/hooks/simulator/modules/eoq/hooks/useHydratedEoqSimulator";
import { useSimulationStore } from "@/store/simulations/useSimulationStore";
import EoqForm from "@/views/EOQViews/forms/EoqForm";
import NoSelectShop from "@/views/helpers/NoSelectShop";
import { useMemo, useState, useEffect } from "react";
import toast from "react-hot-toast";
import ModuleContainer from "../../ModuleContainer";
import Info from "@/views/helpers/Info";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EoqResultsPanel from "@/views/EOQViews/ResultPanel/EoqResultsPanel";
import EoqCostBreakdownPanel from "@/views/EOQViews/CostBreakdownPanel/EoqCostBreakdownPanel";

const EOQ_INFO = {
  title: "Economic Order Quantity (EOQ)",
  theory: "Multi-period inventory optimization",
  description:
    "EOQ determines the optimal replenishment quantity that minimizes total ordering and holding costs over time.",
};

const EoqModule = () => {
  const { shop: selectedShop } = useSelectedShop();

  const breadcrumbTrail = useMemo(
    () => [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Simulation", path: "/dashboard/simulations/eoq" },
      { label: "EOQ" },
    ],
    []
  );

  // No shop selected
  if (!selectedShop) {
    return (
      <ModuleContainer
        title="EOQ Simulation"
        subtitle="Optimize replenishment decisions over time"
        breadcrumbTrail={breadcrumbTrail}
      >
        <NoSelectShop />
      </ModuleContainer>
    );
  }

   const selectedUserCase = selectedShop.name;

    // Hydrate simulator
    const { simulator, lastSimulatedProduct } =
      useHydratedEoqSimulator(selectedShop.id, selectedShop.name);

    const [activeTab, setActiveTab] = useState("parameters");

    // Auto-switch to results if previous simulation exists
    useEffect(() => {
      if (lastSimulatedProduct && simulator.response) {
        setActiveTab("results");
      }
    }, [lastSimulatedProduct, simulator.response]);

    const handleRunSimulation = async (formData?: any) => {
      if (!formData.productName) {
        toast.error("Simulation request missing productName");
        return console.error("Simulation request missing productName");
      }

      setActiveTab("parameters");
      await simulator.run(formData);
    };

    const eoqSimulations = useSimulationStore(
    (state) => state.eoqSimulations
  );

  const currentResult =
    lastSimulatedProduct &&
    eoqSimulations[selectedShop.id]?.[lastSimulatedProduct]?.response;

  // Validation: only show results if EOQ and totalCost are positive numbers
  const isValidResult =
    currentResult &&
    currentResult.eoq > 0 &&
    currentResult.totalCost > 0 &&
    currentResult.numberOfOrders > 0;


  return (
    <ModuleContainer
      title="EOQ Simulation"
      subtitle="Minimize ordering and holding costs across planning periods"
      breadcrumbTrail={breadcrumbTrail}
      selectedUserCase={selectedUserCase}
      actions={
        <>
          <Info content={EOQ_INFO} />
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
          gap-2
          border border-gray-200
        "
      >
        <TabsList className="bg-white/70 backdrop-blur-sm shadow-md rounded-lg p-1 flex gap-2 border border-gray-200">
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
            value="costs"
            disabled={!simulator.hasResult}
            className={`relative px-4 py-2 rounded-md transition-colors ${
              activeTab === "costs"
                ? "jbtn-success shadow-inner"
                : "hover:bg-gray-100"
            }`}
          >
            Cost Breakdown

            {simulator.hasResult && activeTab !== "costs" && (
              <span
                className="
                  absolute -top-1 -right-1
                  h-3 w-3
                  rounded-full
                  bg-emerald-500
                  animate-pulse
                "
              />
            )}
          </TabsTrigger>
        </TabsList>

        {/* PARAMETERS */}
        <TabsContent value="parameters" className="mt-4">
          <EoqForm
            onSubmit={handleRunSimulation}
            disabled={simulator.isRunning}
          />
        </TabsContent>

        {/* RESULTS */}
        <TabsContent value="results" className="mt-4">
          {isValidResult ? (
            <EoqResultsPanel result={currentResult} />
          ) : (
            <div className="text-sm text-muted-foreground">
              Run the simulation to see valid EOQ results.
            </div>
          )}
        </TabsContent>

        {/* COST BREAKDOWN */}
        <TabsContent value="costs" className="mt-4">
          {isValidResult && simulator.hasResult ? (
            <EoqCostBreakdownPanel
              curve={simulator.curve ?? null}
              isLoading={simulator.isRunning}
              error={simulator.error ?? null}
            />
          ) : (
            <div className="text-sm text-muted-foreground">
              Run the simulation to generate the EOQ cost curve.
            </div>
          )}
        </TabsContent>

      </Tabs>
    </ModuleContainer>
  );
};

export default EoqModule