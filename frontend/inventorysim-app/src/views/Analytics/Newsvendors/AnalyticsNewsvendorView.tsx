import { isNewsvendorLog, useNewsvendorBitacora, type SimulationLogEntry } from "@/views/Overview/hooks/useSimulationBitacora";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import jStat from "jstat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import DistributionPanel from "@/views/newsvendorViews/DistributionPanel/DistributionPanel";
import SimulationResultCard from "./SimulationResultCard";
import NewsvendorOverview from "@/views/newsvendorViews/DistributionPanel/NewsvendorOverview";
import Info from "@/views/helpers/Info";

const POLICY_COMPARISON_INFO = {
  title: "Policy Comparison Logic",
  theory: "Economic Fractile vs Service-Level Targeting",
  description:
    "The Cost-Optimal Policy uses the critical ratio CR = Cu / (Cu + Co) to determine the optimal service probability and corresponding order quantity via inverse distribution. The Service-Level Policy uses a user-defined service probability α and computes Q = F⁻¹(α). Both rely on the same demand distribution but represent different decision philosophies."
};

interface Props {
  logs: SimulationLogEntry[];
}

interface AnalyticsResult {
  logEntry: SimulationLogEntry;
  difference: number;
}

const AnalyticsNewsvendorView = ({ logs }: Props) => {
  const [activeTab, setActiveTab] = useState("parameters");
  const [inputValue, setInputValue] = useState("0.95");
  const [targetSL, setTargetSL] = useState(0.95);
  const [results, setResults] = useState<AnalyticsResult[]>([]);
  const [selectedLog, setSelectedLog] = useState<SimulationLogEntry | null>(null);

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

  const handleFindClosest = () => {
    if (!newsvendorLogs.length) {
      toast.error("No historical Newsvendor simulations found.");
      return;
    }

    const computed: AnalyticsResult[] = newsvendorLogs.map((log) => ({
      logEntry: log,
      difference: Math.abs(log.data.serviceLevel - targetSL),
    }));

    computed.sort((a, b) => a.difference - b.difference);
    setResults(computed);
    setActiveTab("results");
  };

  // Analytical Q (normal demand assumption)
  const analyticalQ = useMemo(() => {
    if (!selectedLog || !isNewsvendorLog(selectedLog)) return undefined;
    const mean = selectedLog.request.meanDemand;
    const std = selectedLog.request.stdDeviation;
    const z = jStat.normal.inv(targetSL, 0, 1);
    return mean + z * std; // μ + zσ
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
      <TabsContent value="parameters" className="mt-6 space-y-4 max-w-md">
        <div className="flex items-center gap-3">
          <Label className="text-sm font-medium">Target Service Level</Label>
          <Input
            type="number"
            min={0.1}
            max={1}
            step={0.01}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-24 h-9 text-sm"
          />
          <span className="text-sm text-muted-foreground">{(targetSL * 100).toFixed(0)}%</span>
        </div>

        <Button
          onClick={handleFindClosest}
          disabled={targetSL < 0.1 || targetSL > 1}
          className="toolbar-element jbtn-flat-btn toolbar-element-md active"
        >
          Find Closest Simulations
        </Button>
      </TabsContent>

      {/* RESULTS */}
      <TabsContent value="results" className="mt-6 space-y-4">
        {results.slice(0, 5).map((r, idx) => (
          <SimulationResultCard
            key={idx}
            log={r.logEntry}
            difference={r.difference}
            onSelect={() => {
              setSelectedLog(r.logEntry);
              setActiveTab("distribution");
            }}
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