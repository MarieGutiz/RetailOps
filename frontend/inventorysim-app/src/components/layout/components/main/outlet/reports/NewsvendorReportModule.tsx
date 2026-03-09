import { useSelectedShop } from '@/hooks/shop/useSelectedShop';
import { useNewsvendorBitacora } from '@/views/Overview/hooks/useSimulationBitacora';
import { useEffect, useMemo, useState } from 'react';
import ModuleContainer from '../../ModuleContainer';
import NoSelectShop from '@/views/helpers/NoSelectShop';
import NoSimulationLogs from '@/views/Analytics/NoSimulationLogs';
import Info from '@/views/helpers/Info';
import { buildNewsvendorReport } from '@/views/reports/builders/buildNewsvendorReport';
import { useShopInventoryProducts } from '@/hooks/shop/useShopInventoryProducts';
import { HousePlusIcon } from 'lucide-react';
import { useCurrency } from '@/views/simulator/newsvendorViews/forms/hooks/useCurrency';
import GenericReportView from '@/views/reports/GenericReportView';
import { useFormats } from '@/views/simulator/newsvendorViews/forms/hooks/useFormats';
import { Button } from '@/components/ui/Button';
import { useNewsvendorPdf } from '@/hooks/pdf/newsvendor/useNewsvendorPdf';


/**
 * Newsvendor report module.
 * Displays historical simulation logs, builds and renders the report view,
 * supports user-case selection, and provides PDF export functionality.
 */

const NEWSVENDOR_REPORT_INFO = {
  title: 'Newsvendor Report',
  theory: 'Decision-focused inventory report',
  description: `This report summarizes the results of a Newsvendor simulation, including optimal order quantity, expected profit, service level, and stockout probability.

You can select and compare previous simulation logs to review historical decisions and performance outcomes. Each report reflects the exact inputs and demand assumptions used at the time of simulation.

Use this view to validate inventory policies, assess risk exposure, and refine service level targets before operational deployment.

A PDF export option is available to generate a shareable version of the report for documentation, audit, or stakeholder presentation purposes.`,
};

const NewsvendorReportModule = () => {
  const { shop: selectedShop, shopName } = useSelectedShop();
  const logs = useNewsvendorBitacora(selectedShop?.id);
  const { format } = useCurrency();
  const { formatDate } = useFormats();

  // Already filtered hook
  const newsvendorLogs = useNewsvendorBitacora(selectedShop?.id);

  const { products, inventory } = useShopInventoryProducts();

  const [selectedLogCreatedAt, setSelectedLogCreatedAt] = useState<
    string | null
  >(null);

  //Export to pdf:

  const { generatePdf } = useNewsvendorPdf(
    selectedShop?.id,
    selectedLogCreatedAt ?? undefined,
    shopName
  );

  // Build product options for SKU lookup
  const productOptions = useMemo(() => {
    if (!products || !inventory) return [];

    return inventory
      .map((inv) => {
        const prod = products.find((p) => p.id === inv.productId);
        if (!prod) return null;
        return {
          name: prod.name,
          sku: prod.sku,
        };
      })
      .filter(Boolean) as { name: string; sku: string }[];
  }, [products, inventory]);

  // Auto-select latest log when logs load
  useEffect(() => {
    if (newsvendorLogs.length && !selectedLogCreatedAt) {
      setSelectedLogCreatedAt(newsvendorLogs[0].createdAt);
    }
  }, [newsvendorLogs, selectedLogCreatedAt]);

  // Determine selected log
  const selectedLog = useMemo(() => {
    if (!newsvendorLogs.length) return null;

    return (
      newsvendorLogs.find((log) => log.createdAt === selectedLogCreatedAt) ??
      newsvendorLogs[0]
    );
  }, [newsvendorLogs, selectedLogCreatedAt]);

  // Build report
  const report = useMemo(() => {
    if (!selectedLog) return null;
    return buildNewsvendorReport(
      selectedLog,
      productOptions,
      format,
      formatDate,
      shopName ?? 'Shop'
    );
  }, [selectedLog, productOptions, format, formatDate, shopName]);

  const breadcrumbTrail = useMemo(
    () => [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Reports', path: '/dashboard/reports' },
      { label: 'Newsvendor Report' },
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

  return (
    <ModuleContainer
      title="Newsvendor Report"
      subtitle="Operational inventory summary"
      breadcrumbTrail={breadcrumbTrail}
      userCases={newsvendorLogs.map((log) => log.createdAt)}
      selectedUserCase={selectedLog?.createdAt ?? null}
      onUserCaseChange={(value) => {
        setSelectedLogCreatedAt(value);
      }}
      renderUserCaseItem={(createdAt) => {
        const log = newsvendorLogs.find((l) => l.createdAt === createdAt);
        if (!log) return null;

        return (
          <div className="flex items-center justify-between w-full">
            <span>{log.product}</span>

            <HousePlusIcon
              size={16}
              className="text-blue-500 ml-2 cursor-pointer"
            />
          </div>
        );
      }}
      actions={
        <>
          <Button
            className="toolbar-element jbtn-flat-btn toolbar-element-md active"
            onClick={generatePdf}
            disabled={!selectedLog}
          >
            Export PDF
          </Button>
          <Info content={NEWSVENDOR_REPORT_INFO} />
        </>
      }
    >
      {report && <GenericReportView report={report} />}
    </ModuleContainer>
  );
};

export default NewsvendorReportModule;
