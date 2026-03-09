export type ReportSeverity = 'neutral' | 'positive' | 'warning' | 'critical';

export interface ReportKPI {
  label: string;
  value: number | string;
  hint?: string;
  severity?: ReportSeverity;
}

// src/views/reports/types/report.types.ts
export type BaseReportSection =
  | {
      title: string;
      type: 'parameters'; // for GenericParameterCard
      payload: { label: string; value: any; isCurrency?: boolean }[];
    }
  | {
      title: string;
      type: 'table'; // for tables
      payload: Record<string, any>[]; // array of objects (rows)
    }
  | {
      title: string;
      type: 'text';
      payload: string;
    }
  | {
      title: string;
      type: 'chart';
      payload: ChartPayload;
    };

export interface BaseReport {
  model: 'newsvendor' | 'eoq' | 'abc';
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

type ChartPayload =
  | {
      type: 'demandRisk';
      mean: number;
      std: number;
      serviceLevel: number;
    }
  | {
      type: 'eoqCurve';
      optimalQuantity: number;
      points: {
        quantity: number;
        orderingCost: number;
        holdingCost: number;
        totalCost: number;
      }[];
    };

export interface ReportParameter {
  label: string;
  value: number | string;
  isCurrency?: boolean;
}
