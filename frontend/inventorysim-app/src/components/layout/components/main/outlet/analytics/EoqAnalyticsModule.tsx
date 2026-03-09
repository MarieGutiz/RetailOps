import { useSelectedShop } from '@/hooks/shop/useSelectedShop';
import { useMemo } from 'react';
import ModuleContainer from '../../ModuleContainer';
import NoSelectShop from '@/views/helpers/NoSelectShop';
import { useSimulationBitacora } from '@/views/Overview/hooks/useSimulationBitacora';
import Info from '@/views/helpers/Info';
import AnalyticsEOQView from '@/views/Analytics/Eoq/AnalyticsEOQView';
import NoSimulationLogs from '@/views/Analytics/NoSimulationLogs';


/**
 * EoqAnalyticsModule
 *
 * Module for exploring historical EOQ (Economic Order Quantity) simulations
 * and analyzing replenishment efficiency per SKU.
 *
 * Features:
 * - Determines the shop context using `useSelectedShop`.
 * - Retrieves historical EOQ simulation logs via `useSimulationBitacora`.
 * - Displays:
 *    1. `AnalyticsEOQView` when logs exist for the selected shop.
 *    2. `NoSimulationLogs` with a navigation prompt when no logs exist.
 * - Uses `ModuleContainer` for consistent layout, breadcrumb, subtitle, and
 *   contextual Info panel with EOQ theory and guidance.
 */

const EOQ_INFO = {
  title: 'EOQ Analytics',
  theory: 'Economic Order Quantity Optimization',
  description:
    'The Economic Order Quantity (EOQ) minimizes total inventory cost by balancing ordering cost and holding cost. This module allows historical comparison and what-if parameter exploration.',
};

const EoqAnalyticsModule = () => {
  const { shop: selectedShop } = useSelectedShop();

  const breadcrumbTrail = useMemo(
    () => [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Analytics', path: '/dashboard/analytics' },
      { label: 'EOQ Analytics' },
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

export default EoqAnalyticsModule;
