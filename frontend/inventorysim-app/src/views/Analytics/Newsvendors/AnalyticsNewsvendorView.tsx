import { isNewsvendorLog, type SimulationLogEntry } from "@/views/Overview/hooks/useSimulationBitacora";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import jStat from "jstat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import DistributionPanel from "@/views/newsvendorViews/DistributionPanel/DistributionPanel";
import NewsvendorOverview from "@/views/newsvendorViews/DistributionPanel/NewsvendorOverview";
import Info from "@/views/helpers/Info";
import AnalyticsResultCard from "../AnalyticsResultCard";
import { useAnalyticsEngine } from "../useAnalyticsEngine";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import NormalServiceLevelChart from "./NormalServiceLevelChart";

const POLICY_COMPARISON_INFO = {
  title: "Policy Comparison Logic",
  theory: "Economic Fractile vs Service-Level Targeting",
  description:
    "The Cost-Optimal Policy uses the critical ratio CR = Cu / (Cu + Co) to determine the optimal service probability and corresponding order quantity via inverse distribution. The Service-Level Policy uses a user-defined service probability α and computes Q = F⁻¹(α). Both rely on the same demand distribution but represent different decision philosophies."
};

interface Props {
  logs: SimulationLogEntry[];
}

// interface AnalyticsResult {
//   logEntry: Extract<SimulationLogEntry, { type: "newsvendor" }>;
//   difference: number;
// }

const AnalyticsNewsvendorView = ({ logs }: Props) => {
  const [activeTab, setActiveTab] = useState("whatif");
  const [inputValue, setInputValue] = useState("0.95");
  const [targetSL, setTargetSL] = useState(0.95);
  // const [results, setResults] = useState<AnalyticsResult[]>([]);
  // const [selectedLog, setSelectedLog] = useState<SimulationLogEntry | null>(null);

  // Validate service level between 0.1 and 1
  const parsedSL = useMemo(() => {
    const val = Number(inputValue);
    if (isNaN(val)) return targetSL;
    if (val < 0.1) return 0.1;
    if (val > 1) return 1;
    return val;
  }, [inputValue]);

  useEffect(() => setTargetSL(parsedSL), [parsedSL]);

  // Filter only newsvendor logs
  const newsvendorLogs = useMemo(() => logs.filter(isNewsvendorLog), [logs]);

// Use the analytics engine hook
  const { results, selectedLog, setSelectedLog, runAnalysis } =
    useAnalyticsEngine({
      logs: newsvendorLogs,
      computeDifference: (log) => Math.abs(log.data.serviceLevel - targetSL),
    });

  const handleFindClosest = () => {
    if (!newsvendorLogs.length) {
      toast.error("No historical Newsvendor simulations found.");
      return;
    }
    runAnalysis();
    setActiveTab("results");
  };
  //   const computed: AnalyticsResult[] = newsvendorLogs.map((log) => ({
  //     logEntry: log,
  //     difference: Math.abs(log.data.serviceLevel - targetSL),
  //   }));

  //   computed.sort((a, b) => a.difference - b.difference);
  //   setResults(computed);
  //   setActiveTab("results");
  // };

  // Analytical Q (normal demand assumption)
  const analyticalQ = useMemo(() => {
    if (!selectedLog || !isNewsvendorLog(selectedLog)) return undefined;
    const mean = selectedLog.request.meanDemand;
    const std = selectedLog.request.stdDeviation;
    const z = jStat.normal.inv(targetSL, 0, 1);
    return mean + z * std; //Q* = μ + zσ (for a safety stock)
  }, [selectedLog, targetSL]);

  return (
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
      className="
        bg-blue-200 backdrop-blur-sm shadow-md
        rounded-lg p-1
        flex flex-wrap sm:flex-nowrap gap-2 sm:gap-2
        border border-gray-200
      "
    >
        <TabsTrigger
          value="whatif"
          className={`
            px-2 sm:px-4 py-1 sm:py-2 rounded-md transition-colors
            ${activeTab === "whatif"
              ? "jbtn-success shadow-inner"
              : "bg-blue-100 hover:bg-blue-200"}
          `}
        >
          What if?..
        </TabsTrigger>

        <TabsTrigger
          value="results"
          disabled={!results.length}
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
          disabled={!selectedLog}
          className={`
            relative px-2 sm:px-4 py-1 sm:py-2 rounded-md transition-colors
            ${activeTab === "distribution"
              ? "jbtn-success shadow-inner"
              : "bg-blue-100 hover:bg-blue-200"}
          `}
        >
          Distribution
          {selectedLog && activeTab !== "distribution" && (
            <span
              className="
                absolute -top-1 -right-1
                h-3 w-3 rounded-full
                bg-emerald-500
                animate-pulse
              "
            />
          )}
        </TabsTrigger>
      </TabsList>

      {/* PARAMETERS */}
      <TabsContent value="whatif" className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 space-y-6">

              <div>
                <h3 className="text-base font-semibold">Service Level Target</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Adjust the desired probability of meeting demand without stockouts.
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Target Service Level (α)</Label>

                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min={0.1}
                    max={0.999}
                    step={0.01}
                    value={inputValue}
                    onChange={(e) => {
                      let val = Number(e.target.value);

                      // Zod-style validation
                      if (isNaN(val)) val = 0.95;
                      if (val < 0.1) val = 0.1;
                      if (val > 0.999) val = 0.999;

                      // Round to nearest step of 0.01
                      val = Math.round(val * 100) / 100;

                      setInputValue(val.toString());
                    }}
                    className="w-28 h-9 text-sm"
                  />

                  <span className="text-sm font-medium text-blue-600">
                    {(targetSL * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="text-xs text-red-500">
                  {Number(inputValue) < 0.1 || Number(inputValue) > 0.999
                    ? "Value must be between 0.10 and 0.999 in steps of 0.01"
                    : null}
                </div>

                <div className="text-xs text-muted-foreground">
                  Stockout probability = {(1 - targetSL).toFixed(3)}
                </div>
              </div>

              <Button
                onClick={handleFindClosest}
                disabled={targetSL < 0.1 || targetSL > 0.999}
                className="toolbar-element jbtn-flat-btn toolbar-element-md active"
              >
                Find Closest Simulations
              </Button>
            </div>
          </div>

          {/* RIGHT: Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
              <div className="mb-3">
                <h3 className="text-sm font-semibold">Normal Distribution Visualization</h3>
                <p className="text-xs text-muted-foreground">
                  Shaded region represents demand ≤ Q (service level).
                </p>
              </div>

              {/* Chart container taller for legend */}
              <div className="h-[260px] sm:h-[300px] md:h-[300px] lg:h-[300px]">
                <NormalServiceLevelChart
                  mean={selectedLog?.request.meanDemand ?? 0}
                  std={selectedLog?.request.stdDeviation ?? 1}
                  serviceLevel={targetSL}
                />
              </div>
            </div>
          </div>

        </div>
      </TabsContent>

      {/* RESULTS */}
      <TabsContent value="results" className="mt-6 space-y-4">
        {results.slice(0, 5).map((r, idx) => (
          <AnalyticsResultCard
            key={idx}
            log={r.logEntry}
            onSelect={() => {
              setSelectedLog(r.logEntry);
              setActiveTab("distribution");
            }}
            header={
              <div>
                {new Date(r.logEntry.createdAt).toLocaleString()}
              </div>
            }
            metrics={
              <div className="flex flex-wrap gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="px-2 py-1 rounded-md bg-blue-50 cursor-help">
                        SL: {(r.logEntry.data.serviceLevel * 100).toFixed(1)}%
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs text-sm">
                      Service Level (SL) is the probability of meeting demand without stockouts.
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger>
                      <div className="px-2 py-1 rounded-md bg-amber-50 cursor-help">
                        Δ: {(r.difference * 100).toFixed(1)}%
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs text-sm">
                      Delta (Δ) is the absolute difference between the historical service level and your target SL.
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger>
                      <div className="px-2 py-1 rounded-md bg-emerald-50 cursor-help">
                        Q*: {Math.round(r.logEntry.data.optimalOrderQuantity)}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs text-sm">
                      Q* is the optimal order quantity computed by the simulation or analytical model.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            }
          />
        ))}
      </TabsContent>

      {/* DISTRIBUTION */}
      <TabsContent value="distribution" className="mt-6">
        {selectedLog && isNewsvendorLog(selectedLog) && (
          <div className="space-y-4">

            {/* Info Button aligned right */}
            <div className="flex justify-end">
              <Info content={POLICY_COMPARISON_INFO} />
            </div>

            {/* Clean 2-column comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NewsvendorOverview
                label="Cost-Optimal Policy"
                optimalQ={selectedLog.data.optimalOrderQuantity}
                expectedProfit={selectedLog.data.expectedProfit}
                probabilityValue={selectedLog.data.criticalRatio}
                probabilityKind="criticalRatio"
                stdDeviation={selectedLog.request.stdDeviation}
              />

              {analyticalQ !== undefined && (
                <NewsvendorOverview
                  label="Service-Level Driven Policy"
                  optimalQ={analyticalQ}
                  expectedProfit={selectedLog.data.expectedProfit}
                  probabilityValue={targetSL}
                  probabilityKind="serviceLevel"
                  stdDeviation={selectedLog.request.stdDeviation}
                />
              )}
            </div>

            {/* Distribution Panel */}
            <DistributionPanel
              response={selectedLog.data}
              request={selectedLog.request}
              simId={selectedLog.sku}
              shopName={selectedLog.shopId}
            />
          </div>
        )}
      </TabsContent>
    </Tabs>
  );

}

export default AnalyticsNewsvendorView