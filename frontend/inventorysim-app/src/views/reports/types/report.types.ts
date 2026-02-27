export type ReportSeverity = "neutral" | "positive" | "warning" | "critical";

export interface ReportKPI {
  label: string;
  value: number | string;
  hint?: string;
  severity?: ReportSeverity;
}

export interface ReportSection {
  title: string;
  type: "table" | "chart" | "text";
  payload: unknown;
}

export interface BaseReport {
  model: "newsvendor" | "eoq" | "abc";
  shopId: string;
  generatedAt: string;

  header: {
    title: string;
    subtitle?: string;
    context?: string;
  };

  kpis: ReportKPI[];
  sections: ReportSection[];
}