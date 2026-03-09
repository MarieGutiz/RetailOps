import {
  isAbcLog,
  type SimulationLogEntry,
} from '@/views/Overview/hooks/useSimulationBitacora';
import { useMemo, useState } from 'react';
import { useAnalyticsEngine } from '../useAnalyticsEngine';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import AnalyticsResultCard from '../AnalyticsResultCard';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Info from '@/views/helpers/Info';
import ABCOverviewCard from './ABCOverviewCard';
import ABCBreakdownCard from './ABCBreakdownCard';
import { thresholdSchema } from './props/thresholdSchema';
import {
  computeAnalyticsForLog,
  computeDelta,
} from './hooks/computeAnalyticsForLog';

// Info tooltip
export const ABC_ANALYSIS_INFO = {
  title: 'ABC Classification Logic',
  theory: 'Category allocation based on cumulative sales value',
  description:
    'Products are sorted by sales value. Threshold A defines the cumulative % assigned to A. Threshold B defines the upper bound for B. Remaining items fall into C.',
};

interface Props {
  logs: Extract<SimulationLogEntry, { type: 'abc' }>[];
}

const EMPTY_ANALYTICS = {
  table: [],
  summary: {
    A: { count: 0, valuePct: 0 },
    B: { count: 0, valuePct: 0 },
    C: { count: 0, valuePct: 0 },
    totalValue: 0,
  },
};

/* ===================================================== */
const AnalyticsABCView = ({ logs }: Props) => {
  const [activeTab, setActiveTab] = useState('whatif');
  const [thresholdInput, setThresholdInput] = useState({ a: 80, b: 95 });

  const abcLogs = useMemo(() => logs.filter(isAbcLog), [logs]);

  const validation = useMemo(
    () => thresholdSchema.safeParse(thresholdInput),
    [thresholdInput]
  );

  const validatedThresholds = validation.success ? validation.data : null;

  const { results, selectedLog, setSelectedLog, runAnalysis } =
    useAnalyticsEngine({
      logs: abcLogs,
      computeDifference: (log) =>
        validatedThresholds ? computeDelta(log, validatedThresholds) : 1,
    });

  const breakdownAnalytics = useMemo(() => {
    if (!selectedLog || !validatedThresholds) return null;
    return computeAnalyticsForLog(selectedLog, validatedThresholds);
  }, [selectedLog, validatedThresholds]);

  const whatIfAnalytics = useMemo(() => {
    if (!selectedLog || !validatedThresholds) return EMPTY_ANALYTICS;
    return computeAnalyticsForLog(selectedLog, validatedThresholds);
  }, [selectedLog, validatedThresholds]);

  /* =============================
     Natural Power-Law Diagnostics
     ============================= */

  const powerLawDiagnostics = useMemo(() => {
    if (!selectedLog) return null;

    const sorted = [...selectedLog.data.items].sort(
      (a, b) => b.salesValue - a.salesValue
    );

    const totalValue = sorted.reduce((sum, i) => sum + i.salesValue, 0);

    let cumulativeValue = 0;
    let itemsFor80 = 0;
    let itemsFor95 = 0;

    for (let i = 0; i < sorted.length; i++) {
      cumulativeValue += sorted[i].salesValue;
      const cumulativePct = (cumulativeValue / totalValue) * 100;

      if (!itemsFor80 && cumulativePct >= 80) {
        itemsFor80 = i + 1;
      }

      if (!itemsFor95 && cumulativePct >= 95) {
        itemsFor95 = i + 1;
        break;
      }
    }

    const totalItems = sorted.length;

    return {
      pctItemsFor80: (itemsFor80 / totalItems) * 100,
      pctItemsFor95: (itemsFor95 / totalItems) * 100,
    };
  }, [selectedLog]);

  const concentrationLabel = useMemo(() => {
    if (!powerLawDiagnostics) return null;

    const pct = powerLawDiagnostics.pctItemsFor80;

    if (pct < 10) return 'Extreme concentration';
    if (pct < 20) return 'Strong Pareto concentration';
    if (pct < 35) return 'Moderate concentration';
    return 'Weak concentration';
  }, [powerLawDiagnostics]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="
      bg-white/70
       backdrop-blur-sm
       shadow-md rounded-lg p-1
       flex flex-wrap sm:flex-nowrap 
       gap-1 sm:gap-2
       border border-gray-200"
    >
      {/* TAB HEADERS */}
      <TabsList
        className="
        bg-blue-200
         backdrop-blur-sm
         shadow-md rounded-lg p-1
         flex flex-wrap sm:flex-nowrap
         gap-2 sm:gap-2
         border border-gray-200"
      >
        <TabsTrigger
          value="whatif"
          className={`
            px-2 sm:px-4 py-1 sm:py-2
            rounded-md
            transition-colors ${
              activeTab === 'whatif'
                ? 'jbtn-success shadow-inner'
                : 'bg-blue-100 hover:bg-blue-200'
            }`}
        >
          What if?..
        </TabsTrigger>

        <TabsTrigger
          value="results"
          className={`
            px-2 sm:px-4 py-1 sm:py-2
            rounded-md
            transition-colors ${
              activeTab === 'results'
                ? 'jbtn-success shadow-inner'
                : 'bg-blue-100 hover:bg-blue-200'
            }`}
          disabled={!validatedThresholds}
        >
          Results
        </TabsTrigger>
        <TabsTrigger
          value="breakdown"
          className={`
            px-2 sm:px-4 py-1 sm:py-2
            rounded-md
            transition-colors ${
              activeTab === 'breakdown'
                ? 'jbtn-success shadow-inner'
                : 'bg-blue-100 hover:bg-blue-200'
            }`}
          disabled={!selectedLog}
        >
          Breakdown
          {selectedLog && activeTab !== 'breakdown' && (
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

      {/* WHAT IF */}
      <TabsContent value="whatif" className="mt-6 space-y-6 max-w-md">
        <div>
          <Label>Threshold A (%)</Label>
          <Input
            type="number"
            value={thresholdInput.a}
            onChange={(e) =>
              setThresholdInput((prev) => ({
                ...prev,
                a: Number(e.target.value),
              }))
            }
          />
        </div>

        <div>
          <Label>Threshold B (%)</Label>
          <Input
            type="number"
            value={thresholdInput.b}
            onChange={(e) =>
              setThresholdInput((prev) => ({
                ...prev,
                b: Number(e.target.value),
              }))
            }
          />
        </div>

        {!validation.success && (
          <div className="text-sm text-red-500">
            {validation.error.issues[0]?.message}
          </div>
        )}

        {validatedThresholds && (
          <div className="text-sm text-muted-foreground">
            A ≤ {validatedThresholds.a}% <br />B ≤ {validatedThresholds.b}%{' '}
            <br />C &gt; {validatedThresholds.b}%
          </div>
        )}

        <Button
          disabled={!validatedThresholds}
          className="toolbar-element jbtn-flat-btn toolbar-element-md active"
          onClick={() => {
            runAnalysis();
            setActiveTab('results');
          }}
        >
          Compare Historical ABC
        </Button>
      </TabsContent>

      {/* RESULTS */}
      <TabsContent value="results" className="mt-6 space-y-4">
        {results.slice(0, 5).map((r, idx) => {
          const mode = r.logEntry.request.mode ?? 'classic';
          const summary = r.logEntry.data.summary;

          return (
            <AnalyticsResultCard
              key={idx}
              log={r.logEntry}
              onSelect={() => {
                setSelectedLog(r.logEntry);
                setActiveTab('breakdown');
              }}
              header={
                <div className="flex justify-between">
                  <span>{new Date(r.logEntry.createdAt).toLocaleString()}</span>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                    {mode.toUpperCase()}
                  </span>
                </div>
              }
              metrics={
                <div className="flex gap-2">
                  <div className="px-2 py-1 bg-blue-50 rounded text-sm">
                    Δ {(r.difference * 100).toFixed(1)}%
                  </div>
                  {summary && (
                    <div className="px-2 py-1 bg-gray-50 rounded text-sm">
                      Σ {summary.totalValue} units
                    </div>
                  )}
                </div>
              }
            />
          );
        })}
      </TabsContent>

      {/* BREAKDOWN */}
      <TabsContent value="breakdown" className="mt-6 space-y-6">
        <div className="flex justify-between items-center">
          <Info content={ABC_ANALYSIS_INFO} />
          {selectedLog && (
            <div className="text-sm text-gray-600">
              Showing breakdown for{' '}
              <strong>{selectedLog.request.mode ?? 'classic'}</strong> mode
            </div>
          )}
        </div>

        {breakdownAnalytics && (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['A', 'B', 'C'] as const).map((cat) => (
                <ABCOverviewCard
                  key={cat}
                  category={cat}
                  count={breakdownAnalytics.summary[cat].count}
                  valuePct={breakdownAnalytics.summary[cat].valuePct}
                  totalValue={
                    (breakdownAnalytics.summary[cat].valuePct / 100) *
                    breakdownAnalytics.summary.totalValue
                  }
                />
              ))}
            </div>

            {/* Power Law */}
            {powerLawDiagnostics && (
              <div className="p-3 bg-indigo-50 rounded text-sm text-indigo-800">
                <strong>Natural Concentration (Power-Law View)</strong>{' '}
                <span className="text-xs font-semibold ml-2">
                  ({concentrationLabel})
                </span>
                <br />• Top {powerLawDiagnostics.pctItemsFor80.toFixed(1)}% of
                items generate 80% of total value.
                <br />• Top {powerLawDiagnostics.pctItemsFor95.toFixed(1)}% of
                items generate 95% of total value.
              </div>
            )}

            {/* Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['A', 'B', 'C'] as const).map((cat) => {
                const histItems =
                  selectedLog?.data.items.filter(
                    (i) => i.abcCategoryType === cat
                  ) ?? [];

                const histCount = histItems.length;
                const histValue = histItems.reduce(
                  (sum, i) => sum + i.salesValue,
                  0
                );

                const whatIfItems =
                  whatIfAnalytics.table.filter((i) => i.category === cat) ?? [];

                const whatIfCount = whatIfItems.length;
                const whatIfValue = whatIfItems.reduce(
                  (sum, i) => sum + i.salesValue,
                  0
                );

                return (
                  <ABCBreakdownCard
                    key={cat}
                    category={cat}
                    whatIfCount={whatIfCount}
                    whatIfValue={whatIfValue}
                    historicalCount={histCount}
                    historicalValue={histValue}
                  />
                );
              })}
            </div>
          </>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default AnalyticsABCView;
