export type ReportSeverity = "neutral" | "positive" | "warning" | "critical";

export interface ReportKPI {
  label: string;
  value: number | string;
  hint?: string;
  severity?: ReportSeverity;
}

type BaseReportSection = {
  title: string;
  type: "table" | "chart" | "text";
  payload: any; // for table/text
} | {
  title: string;
  type: "chart";
  payload: ChartPayload;
};

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
  sections: BaseReportSection[];
}

type ChartPayload = {
  mean: number;
  std: number;
  serviceLevel: number;
};