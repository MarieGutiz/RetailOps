import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isEoqLog, type SimulationLogEntry } from "@/views/Overview/hooks/useSimulationBitacora";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import EOQOverviewCard from "./EOQOverviewCard";
import { useEOQAnalytics } from "./hooks/useEOQAnalytics";
import { useAnalyticsEngine } from "../useAnalyticsEngine";
import AnalyticsResultCard from "../AnalyticsResultCard";
import Info from "@/views/helpers/Info";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";



export const EOQ_POLICY_COMPARISON_INFO = {
  title: "EOQ Policy Comparison Logic",
  theory: "Analytical EOQ vs Historical EOQ",
  description:
    "The Analytical EOQ is computed using the classic Economic Order Quantity formula: EOQ = sqrt(2 * D * S / H), where D is annual demand, S is ordering cost, and H is holding cost per unit. Historical EOQ comes from past simulation data. Comparing both allows you to see differences in order quantity, total cost, and component costs. The percentage difference (old - new) / old × 100 shows whether the analytical policy reduces or increases costs compared to historical policies."
};

interface Props {
  logs: SimulationLogEntry[];
}

type EoqLog = Extract<SimulationLogEntry, { type: "eoq" }>;

const AnalyticsEOQView = ({ logs }: Props) => {
  const [activeTab, setActiveTab] = useState("whatif");

  const [demand, setDemand] = useState(1000);
  const [orderingCost, setOrderingCost] = useState(50);
  const [holdingCost, setHoldingCost] = useState(5);

  // ─────────────────────────────
  // Filter EOQ logs properly using type guard
  // ─────────────────────────────
  const eoqLogs = useMemo(
    () => logs.filter(isEoqLog),
    [logs]
  );

  // ─────────────────────────────
  // Analytical model
  // ─────────────────────────────
  const analytics = useEOQAnalytics({
    demand,
    orderingCost,
    holdingCost,
  });

  // ─────────────────────────────
  // Generic ranking engine
  // ─────────────────────────────
  const {
    results,
    selectedLog,
    setSelectedLog,
    runAnalysis,
  } = useAnalyticsEngine<EoqLog>({
    logs: eoqLogs,
    computeDifference: (log) =>
      Math.abs(log.data.eoq - analytics.eoq),
  });

    return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="bg-white/70 backdrop-blur-sm shadow-md rounded-lg p-1 flex flex-wrap sm:flex-nowrap gap-1 sm:gap-2 border border-gray-200"
    >
      <TabsList className="bg-blue-200 backdrop-blur-sm shadow-md rounded-lg p-1 flex flex-wrap sm:flex-nowrap gap-2 sm:gap-2 border border-gray-200">
        <TabsTrigger
          value="whatif"
          className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md transition-colors ${activeTab === "whatif" ? "jbtn-success shadow-inner" : "bg-blue-100 hover:bg-blue-200"}`}
        >
          What if?..
        </TabsTrigger>
        <TabsTrigger
          value="results"
          disabled={!results.length}
          className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md transition-colors ${activeTab === "results" ? "jbtn-success shadow-inner" : "bg-blue-100 hover:bg-blue-200"}`}
        >
          Results
        </TabsTrigger>
        <TabsTrigger
          value="cost"
          disabled={!selectedLog}
          className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md transition-colors ${activeTab === "cost" ? "jbtn-success shadow-inner" : "bg-blue-100 hover:bg-blue-200"}`}
        >
          Cost Breakdown
        </TabsTrigger>
      </TabsList>

      {/* WHAT IF */}
      <TabsContent value="whatif" className="mt-6 space-y-4 max-w-md">
        <div className="space-y-4">
          <div>
            <Label>Annual Demand (D)</Label>
            <Input type="number" value={demand} onChange={(e) => setDemand(Number(e.target.value))} />
          </div>
          <div>
            <Label>Ordering Cost (S)</Label>
            <Input type="number" value={orderingCost} onChange={(e) => setOrderingCost(Number(e.target.value))} />
          </div>
          <div>
            <Label>Holding Cost (H)</Label>
            <Input type="number" value={holdingCost} onChange={(e) => setHoldingCost(Number(e.target.value))} />
          </div>
        </div>

        <div className="text-sm space-y-1">
          <p>
            Analytical EOQ: <strong>{analytics.eoq.toFixed(2)}</strong>
          </p>
          <p>
            Total Annual Cost: <strong>{analytics.totalCost.toFixed(2)}</strong>
          </p>
        </div>

        <Button
          onClick={() => {
            if (!eoqLogs.length) {
              toast.error("No EOQ simulations found.");
              return;
            }
            runAnalysis();
            setActiveTab("results");
          }}
          className="toolbar-element jbtn-flat-btn toolbar-element-md active"
        >
          Find Closest Historical EOQ
        </Button>
      </TabsContent>

      {/* RESULTS */}
        <TabsContent value="results" className="mt-6 space-y-4">
        {results.slice(0, 5).map((r, idx) => (
          <AnalyticsResultCard
            key={idx}
            log={r.logEntry}
            onSelect={() => {
              setSelectedLog(r.logEntry);
              setActiveTab("cost");
            }}
            header={<div>{new Date(r.logEntry.createdAt).toLocaleString()}</div>}
            metrics={
              <div className="flex flex-wrap gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="px-2 py-1 rounded-md bg-blue-50 cursor-help">
                        EOQ: {r.logEntry.data.eoq.toFixed(2)}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs text-sm">
                      EOQ (Economic Order Quantity) is the optimal quantity to order to minimize total costs.
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger>
                      <div className="px-2 py-1 rounded-md bg-amber-50 cursor-help">
                        Δ: {r.difference.toFixed(2)}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs text-sm">
                      Delta (Δ) represents the difference between this simulation's EOQ and the target/reference value.
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger>
                      <div className="px-2 py-1 rounded-md bg-emerald-50 cursor-help">
                        Cost: {r.logEntry.data.totalCost.toFixed(2)}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs text-sm">
                      Total cost combines ordering and holding costs for this EOQ simulation.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            }
          />
        ))}
      </TabsContent>


      {/* COST BREAKDOWN */}
       <TabsContent value="cost" className="mt-6 space-y-4">
        {selectedLog && (
          <>
            <div className="flex justify-end">
              <Info content={EOQ_POLICY_COMPARISON_INFO} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Analytical Policy – shows differences compared to historical */}
              <EOQOverviewCard
                label="Analytical Policy"
                eoq={analytics.eoq}
                totalCost={analytics.totalCost}
                orderingCostComponent={analytics.orderingCostComponent}
                holdingCostComponent={analytics.holdingCostComponent}
                ordersPerYear={analytics.ordersPerYear}
                cycleTime={analytics.cycleTime}
                comparison={{
                  eoq: selectedLog.data.eoq,
                  totalCost: selectedLog.data.totalCost,
                  orderingCostComponent: selectedLog.data.orderingCost,
                  holdingCostComponent: selectedLog.data.holdingCost,
                  ordersPerYear: selectedLog.data.numberOfOrders,
                  cycleTime: selectedLog.data.cycleTime,
                }}
              />

              {/* Historical Policy – baseline card with top-right badge */}
              <EOQOverviewCard
                label="Historical Policy"
                eoq={selectedLog.data.eoq}
                totalCost={selectedLog.data.totalCost}
                orderingCostComponent={selectedLog.data.orderingCost}
                holdingCostComponent={selectedLog.data.holdingCost}
                ordersPerYear={selectedLog.data.numberOfOrders}
                cycleTime={selectedLog.data.cycleTime}
                isBaseline={true} // adds top-right “Baseline” badge
              />
            </div>
          </>
        )}
      </TabsContent>

    </Tabs>
  );

}

export default AnalyticsEOQView