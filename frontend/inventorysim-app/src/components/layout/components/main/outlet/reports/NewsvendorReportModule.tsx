import { useSelectedShop } from "@/hooks/shop/useSelectedShop";
import { useNewsvendorBitacora } from "@/views/Overview/hooks/useSimulationBitacora";
import { useMemo } from "react";
import ModuleContainer from "../../ModuleContainer";
import NoSelectShop from "@/views/helpers/NoSelectShop";
import NoSimulationLogs from "@/views/Analytics/NoSimulationLogs";
import Info from "@/views/helpers/Info";
import NewsvendorReportView from "@/views/reports/newsvendorsViews/NewsvendorReportView";
import { buildNewsvendorReport } from "@/views/reports/builders/buildNewsvendorReport";

const NEWSVENDOR_REPORT_INFO = {
  title: "Newsvendor Report",
  theory: "Decision-focused inventory report",
  description:
    "Summarizes the latest Newsvendor simulation into operational KPIs and risk insights.",
};

const NewsvendorReportModule = () => {
  const { shop: selectedShop } = useSelectedShop();
  const logs = useNewsvendorBitacora(selectedShop?.id);

  const breadcrumbTrail = useMemo(
    () => [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Reports", path: "/dashboard/reports" },
      { label: "Newsvendor Report" },
    ],
    []
  );

  if (!selectedShop) {
    return (
      <ModuleContainer
        title="Newsvendor Report"
        subtitle="Operational inventory summary"
        breadcrumbTrail={breadcrumbTrail}
      >
        <NoSelectShop />
      </ModuleContainer>
    );
  }

  if (!logs.length) {
    return (
      <ModuleContainer
        title="Newsvendor Report"
        subtitle="Operational inventory summary"
        breadcrumbTrail={breadcrumbTrail}
        selectedUserCase={selectedShop.name}
      >
        <NoSimulationLogs
          simulationType="Newsvendor"
          navigateTo="/dashboard/simulations/newsvendor"
        />
      </ModuleContainer>
    );
  }

  // Single-log strategy: latest simulation
  const latestLog = logs[0];

  const report = useMemo(() => {
    return buildNewsvendorReport(latestLog);
  }, [latestLog]);

  return (
    <ModuleContainer
      title="Newsvendor Report"
      subtitle="Operational inventory summary"
      breadcrumbTrail={breadcrumbTrail}
      selectedUserCase={selectedShop.name}
      actions={<Info content={NEWSVENDOR_REPORT_INFO} />}
    >
      <NewsvendorReportView report={report} />
    </ModuleContainer>
  );

}

export default NewsvendorReportModule