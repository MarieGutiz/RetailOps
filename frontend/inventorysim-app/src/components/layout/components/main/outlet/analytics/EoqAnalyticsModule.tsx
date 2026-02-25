import { useSelectedShop } from "@/hooks/shop/useSelectedShop";
import { useMemo } from "react";
import ModuleContainer from "../../ModuleContainer";
import NoSelectShop from "@/views/helpers/NoSelectShop";
import { useSimulationBitacora } from "@/views/Overview/hooks/useSimulationBitacora";
import Info from "@/views/helpers/Info";
import AnalyticsEOQView from "@/views/Analytics/Eoq/AnalyticsEOQView";
import NoSimulationLogs from "@/views/Analytics/NoSimulationLogs";

const EOQ_INFO = {
  title: "EOQ Analytics",
  theory: "Economic Order Quantity Optimization",
  description:
    "The Economic Order Quantity (EOQ) minimizes total inventory cost by balancing ordering cost and holding cost. This module allows historical comparison and what-if parameter exploration."
};

const EoqAnalyticsModule = () => {
  const { shop: selectedShop } = useSelectedShop();

  const breadcrumbTrail = useMemo(
    () => [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Analytics", path: "/dashboard/analytics" },
      { label: "EOQ Analytics" },
    ],
    []
  );

  if (!selectedShop) {
    return (
      <ModuleContainer
        title="EOQ Analytics"
        subtitle="Analyze replenishment efficiency"
        breadcrumbTrail={breadcrumbTrail}
      >
        <NoSelectShop />
      </ModuleContainer>
    );
  }

  const logs = useSimulationBitacora(selectedShop.id);

  return (
    <ModuleContainer
      title="EOQ Analytics"
      subtitle="Analyze replenishment efficiency"
      breadcrumbTrail={breadcrumbTrail}
      selectedUserCase={selectedShop.name}
      actions={<Info content={EOQ_INFO} />}
    >
      
      {logs.length ? (
        <AnalyticsEOQView logs={logs} />
      ) : (
        <NoSimulationLogs
          simulationType="EOQ"
          navigateTo="/dashboard/simulations/eoq"
        />
      )}
    </ModuleContainer>
  );
};


export default EoqAnalyticsModule