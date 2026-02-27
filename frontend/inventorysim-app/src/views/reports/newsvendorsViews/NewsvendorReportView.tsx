import type { BaseReport } from "../types/report.types";

interface Props {
  report: BaseReport;
}

const NewsvendorReportView = ({ report }: Props) => {
  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">{report.header.title}</h2>
        {report.header.subtitle && (
          <p className="text-sm text-muted-foreground">
            {report.header.subtitle}
          </p>
        )}
        {report.header.context && (
          <p className="text-sm mt-1">{report.header.context}</p>
        )}
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {report.kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="border rounded-xl p-4 bg-card shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
            <p className="text-lg font-semibold mt-1">{kpi.value}</p>
            {kpi.hint && (
              <p className="text-xs text-muted-foreground mt-1">
                {kpi.hint}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {report.sections.map((section, idx) => (
          <div key={idx} className="border rounded-xl p-4">
            <h3 className="font-semibold mb-3">{section.title}</h3>

            {section.type === "table" && (
              <pre className="text-sm overflow-auto">
                {JSON.stringify(section.payload, null, 2)}
              </pre>
            )}

            {section.type === "chart" && (
              <pre className="text-sm">
                {JSON.stringify(section.payload, null, 2)}
              </pre>
            )}

            {section.type === "text" && (
              <p className="text-sm">{section.payload as string}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


export default NewsvendorReportView