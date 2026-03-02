import { useSelectedShop } from "@/hooks/shop/useSelectedShop";
import { useSimulationBitacora } from "@/views/Overview/hooks/useSimulationBitacora";
import { useEffect, useMemo, useState } from "react";
import { useCurrency } from "@/views/simulator/newsvendorViews/forms/hooks/useCurrency";
import NoSimulationLogs from "@/views/Analytics/NoSimulationLogs";
import NoSelectShop from "@/views/helpers/NoSelectShop";
import { buildAbcReport } from "@/views/reports/builders/buildAbcReport";
import GenericReportView from "@/views/reports/GenericReportView";
import { HousePlusIcon } from "lucide-react";
import ModuleContainer from "../../ModuleContainer";
import Info from "@/views/helpers/Info";
import { useFormats } from "@/views/simulator/newsvendorViews/forms/hooks/useFormats";

const ABC_REPORT_INFO = {
  title: "ABC Report",
  theory: "Inventory classification by value and demand frequency",
  description: `This report summarizes the results of the ABC inventory simulation. It shows how items are categorized into A, B, and C classes based on sales value and demand frequency.

The KPI section highlights the total inventory value and the distribution of items across ABC categories. You can select previous ABC simulation logs to compare inventory classification over time.

The table section lists all inventory items with their rank, cumulative contribution to total value, and assigned ABC category for operational prioritization.`,
};

const ABCReportModule = () => {
  const { shop: selectedShop, shopName } = useSelectedShop();


  const logs = useSimulationBitacora(selectedShop?.id);
  const { format } = useCurrency();
  const {formatDate} = useFormats();

  const [selectedLogCreatedAt, setSelectedLogCreatedAt] = useState<string | null>(null);

  // Filter only ABC logs
  const abcLogs = useMemo(() => {
    return logs.filter((log) => log.type === "abc");
  }, [logs]);

  // Auto-select latest ABC log
  useEffect(() => {
    if (abcLogs.length && !selectedLogCreatedAt) {
      setSelectedLogCreatedAt(abcLogs[0].createdAt);
    }
  }, [abcLogs, selectedLogCreatedAt]);

  // Determine selected log
  const selectedLog = useMemo(() => {
    if (!abcLogs.length) return null;

    return (
      abcLogs.find((log) => log.createdAt === selectedLogCreatedAt) ??
      abcLogs[0]
    );
  }, [abcLogs, selectedLogCreatedAt]);

  // Build report
  const report = useMemo(() => {
    if (!selectedLog) return null;

    return buildAbcReport(
      selectedLog,
      format,
      formatDate,
      shopName ?? "Shop");
  }, [selectedLog, format, formatDate, shopName]);

  const breadcrumbTrail = useMemo(
    () => [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Reports", path: "/dashboard/reports" },
      { label: "ABC Report" },
    ],
    []
  );

  if (!selectedShop) {
    return (
      <ModuleContainer
        title="ABC Report"
        subtitle="Inventory classification summary"
        breadcrumbTrail={breadcrumbTrail}
      >
        <NoSelectShop />
      </ModuleContainer>
    );
  }

  if (!abcLogs.length) {
    return (
      <ModuleContainer
        title="ABC Report"
        subtitle="Inventory classification summary"
        breadcrumbTrail={breadcrumbTrail}
        selectedUserCase={selectedShop.name}
      >
        <NoSimulationLogs
          simulationType="ABC"
          navigateTo="/dashboard/simulations/abc"
        />
      </ModuleContainer>
    );
  }

  return (
    <ModuleContainer
      title="ABC Report"
      subtitle="Inventory classification summary"
      breadcrumbTrail={breadcrumbTrail}
      userCases={abcLogs.map((log) => log.createdAt)}
      selectedUserCase={selectedLog?.createdAt ?? null}
      onUserCaseChange={(value) => setSelectedLogCreatedAt(value)}
      renderUserCaseItem={(createdAt) => {
        const log = abcLogs.find((l) => l.createdAt === createdAt);
        if (!log) return null;

        return (
          <div className="flex items-center justify-between w-full">
              {/* {new Date(log.createdAt).toLocaleString(undefined, {
                weekday: "short",   // e.g., "Mon"
                year: "numeric",    // e.g., 2026
                month: "short",     // e.g., "Mar"
                day: "numeric",     // e.g., 2
                hour: "2-digit",
                minute: "2-digit",
              })} */}
              { formatDate(new Date(log.createdAt))}

            <HousePlusIcon size={16} className="text-blue-500 ml-2 cursor-pointer" />
          </div>
        );
      }}
      actions={<Info content={ABC_REPORT_INFO} />}
    >
      {report && <GenericReportView report={report} />}
    </ModuleContainer>
  );
};


export default ABCReportModule