import { useState } from 'react';

interface AnalyticsEngineConfig<TLog> {
  logs: TLog[];
  computeDifference: (log: TLog) => number;
  sortFn?: (a: TLog, b: TLog) => number;
}

interface AnalyticsResult<TLog> {
  logEntry: TLog;
  difference: number;
}

/**
 * Custom hook to analyze logs/items and sort them by a difference metric.
 * Tracks the selected log and provides a function to run the analysis.
 *
 * @template TLog - Type of logs/items to analyze
 * @param config - Configuration object including logs and difference computation function
 * @returns Object containing sorted results, selected log, setter, and analysis function
 */
export function useAnalyticsEngine<TLog>({
  logs,
  computeDifference,
}: AnalyticsEngineConfig<TLog>) {
  const [results, setResults] = useState<AnalyticsResult<TLog>[]>([]);

  const [selectedLog, setSelectedLog] = useState<TLog | null>(null);

  const runAnalysis = () => {
    if (!logs.length) return;

    const computed = logs.map((log) => ({
      logEntry: log,
      difference: computeDifference(log),
    }));

    computed.sort((a, b) => a.difference - b.difference);

    setResults(computed);
  };

  return {
    results,
    selectedLog,
    setSelectedLog,
    runAnalysis,
  };
}
