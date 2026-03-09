import { useSelectedShop } from '@/hooks/shop/useSelectedShop';
import { useSimulationBitacora } from '@/views/Overview/hooks/useSimulationBitacora';
import { useMemo } from 'react';
import ModuleContainer from '../../ModuleContainer';
import NoSelectShop from '@/views/helpers/NoSelectShop';
import Info from '@/views/helpers/Info';
import AnalyticsNewsvendorView from '@/views/Analytics/Newsvendors/AnalyticsNewsvendorView';
import NoSimulationLogs from '@/views/Analytics/NoSimulationLogs';


/**
 * NewsvendorAnalyticsModule
 * 
 * Module for exploring historical Newsvendor simulations and determining
 * optimal stock quantities per SKU based on service levels.
 * 
 * Features:
 * - Selects shop context via `useSelectedShop`.
 * - Fetches historical simulation logs via `useSimulationBitacora`.
 * - Displays either:
 *    1. Analytics view (`AnalyticsNewsvendorView`) when logs exist.
 *    2. Informational message / navigation helper (`NoSimulationLogs`) when logs are absent.
 * - Wrapped in `ModuleContainer` with breadcrumb, subtitle, and contextual Info panel.
 */

const NEWSVENDOR_INFO = {
  title: 'Newsvendor Analytics',
  theory: 'Find optimal stock quantity for a desired service level',
  description:
    'Given a target service level, this module searches historical simulations or calculates the closest optimal order quantity (Q*) for each SKU.',
};

const NewsvendorAnalyticsModule = () => {
  const { shop: selectedShop } = useSelectedShop();

  const breadcrumbTrail = useMemo(
    () => [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Analytics', path: '/dashboard/analytics' },
      { label: 'Newsvendor Analytics' },
    ],
    []
  );

  if (!selectedShop) {
    return (
      <ModuleContainer
        title="Newsvendor Analytics"
        subtitle="Explore optimal stock quantities"
        breadcrumbTrail={breadcrumbTrail}
      >
        <NoSelectShop />
      </ModuleContainer>
    );
  }

  // Step 1: find closest matches from pitácora

  const logs = useSimulationBitacora(selectedShop?.id);

  return (
    <ModuleContainer
      title="Newsvendor Analytics"
      subtitle="Explore optimal stock quantities"
      breadcrumbTrail={breadcrumbTrail}
      selectedUserCase={selectedShop.name}
      actions={<Info content={NEWSVENDOR_INFO} />}
    >
      {logs.length ? (
        <AnalyticsNewsvendorView logs={logs} />
      ) : (
        <NoSimulationLogs
          simulationType="Newsvendor"
          navigateTo="/dashboard/simulations/newsvendor"
        />
      )}
    </ModuleContainer>
  );
};

export default NewsvendorAnalyticsModule;
