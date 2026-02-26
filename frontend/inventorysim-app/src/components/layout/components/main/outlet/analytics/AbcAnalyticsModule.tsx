import { useSelectedShop } from "@/hooks/shop/useSelectedShop";
import { useMemo } from "react";
import ModuleContainer from "../../ModuleContainer";
import NoSelectShop from "@/views/helpers/NoSelectShop";
import { useSimulationBitacora } from "@/views/Overview/hooks/useSimulationBitacora";
import Info from "@/views/helpers/Info";
import NoSimulationLogs from "@/views/Analytics/NoSimulationLogs";
import AnalyticsABCView from "@/views/Analytics/ABC/AnalyticsABCView";

const ABC_INFO = {
  title: "ABC Analytics",
  theory: "ABC Classification for Inventory Prioritization",
  description:
    "ABC analysis classifies inventory into three categories (A, B, C) based on criteria such as revenue, volume, or cost. This module allows historical comparison and exploration of alternative classification thresholds."
};

const AbcAnalyticsModule = () => {
  const { shop: selectedShop } = useSelectedShop();

  const breadcrumbTrail = useMemo(
    () => [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Analytics", path: "/dashboard/analytics" },
      { label: "ABC Analytics" },
    ],
    []
  );

  if (!selectedShop) {
    return (
      <ModuleContainer
        title="ABC Analytics"
        subtitle="Analyze inventory prioritization"
        breadcrumbTrail={breadcrumbTrail}
      >
        <NoSelectShop />
      </ModuleContainer>
    );
  }

  const logs = useSimulationBitacora(selectedShop.id);

  const abcLogs = logs.filter(log => log.type === "abc");

  return (
    <ModuleContainer
      title="ABC Analytics"
      subtitle="Analyze inventory prioritization"
      breadcrumbTrail={breadcrumbTrail}
      selectedUserCase={selectedShop.name}
      actions={<Info content={ABC_INFO} />}
    >
      {abcLogs.length ? (
        <AnalyticsABCView logs={abcLogs} />
      ) : (
        <NoSimulationLogs
          simulationType="ABC"
          navigateTo="/dashboard/simulations/abc"
        />
      )}
    </ModuleContainer>
  );
};

export default AbcAnalyticsModule