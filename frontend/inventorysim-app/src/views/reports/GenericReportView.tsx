import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EOQCostCurveChart from "./EoqViews/EOQCostCurveChart";
import GenericParameterCard from "./GenericParameterCard";
import DemandRiskReportChart from "./newsvendorsViews/DemandRiskReportChart";
import type { BaseReport } from "./types/report.types";

interface Props {
  report: BaseReport;
}

const GenericReportView = ({ report }: Props) => {
  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">{report.header.title}</h2>
        {report.header.subtitle && (
          <p className="text-sm text-muted-foreground">{report.header.subtitle}</p>
        )}
        {report.header.context && (
          <p className="text-sm mt-1">{report.header.context}</p>
        )}
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {report.kpis.map((kpi, idx) => (
          <div key={idx} className="border rounded-xl p-4 bg-card shadow-sm">
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
            <p className="text-lg font-semibold mt-1">{kpi.value}</p>
            {kpi.hint && (
              <p className="text-xs text-muted-foreground mt-1">{kpi.hint}</p>
            )}
          </div>
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {report.sections.map((section, idx) => (
          <div key={idx} className="border rounded-xl p-4">
            <h3 className="font-semibold mb-3">{section.title}</h3>

            {/* PARAMETERS */}
            {section.type === "parameters" && Array.isArray(section.payload) && (
              <GenericParameterCard
                title={section.title}
                data={section.payload}
              />
            )}

            {/* TEXT */}
            {section.type === "text" && (
              <p className="text-sm">{section.payload}</p>
            )}

            {/* CHART */}
            {section.type === "chart" && section.payload && (
              <div className="flex justify-center">
                {section.payload.type === "demandRisk" && (
                  <DemandRiskReportChart
                    mean={section.payload.mean}
                    std={section.payload.std}
                    serviceLevel={section.payload.serviceLevel}
                  />
                )}

                {section.payload.type === "eoqCurve" && (
                  <EOQCostCurveChart
                    optimalQuantity={section.payload.optimalQuantity}
                    points={section.payload.points}
                  />
                )}
              </div>
            )}

            {/* TABLE (for ABC or other future tables) */}
            {section.type === "table" && Array.isArray(section.payload) && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(section.payload[0]).map((col) => (
                      <TableHead key={col}>{col}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {section.payload.map((row, rIdx) => (
                    <TableRow key={rIdx}>
                      {Object.values(row).map((val, cIdx) => (
                        <TableCell key={cIdx}>{val}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          </div>
        ))}
      </div>
    </div>
  );
};



export default GenericReportView