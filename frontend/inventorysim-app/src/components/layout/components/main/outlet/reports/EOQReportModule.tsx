import { useSelectedShop } from '@/hooks/shop/useSelectedShop';
import { useShopInventoryProducts } from '@/hooks/shop/useShopInventoryProducts';
import { useSimulationBitacora } from '@/views/Overview/hooks/useSimulationBitacora';
import { buildEOQReport } from '@/views/reports/builders/buildEOQReport';
import { useCurrency } from '@/views/simulator/newsvendorViews/forms/hooks/useCurrency';
import { useEffect, useMemo, useState } from 'react';
import ModuleContainer from '../../ModuleContainer';
import NoSelectShop from '@/views/helpers/NoSelectShop';
import NoSimulationLogs from '@/views/Analytics/NoSimulationLogs';
import { HousePlusIcon } from 'lucide-react';
import Info from '@/views/helpers/Info';
import GenericReportView from '@/views/reports/GenericReportView';
import { generateEOQCurve } from '@/views/reports/EoqViews/hooks/generateEOQCurve';
import { useFormats } from '@/views/simulator/newsvendorViews/forms/hooks/useFormats';


/**
 * EOQ report module.
 * Displays historical simulation logs, builds and renders the report view,
 * supports user-case selection, and provides PDF export functionality.
 */

const EOQ_REPORT_INFO = {
  title: 'EOQ Report',
  theory: 'Cost-minimization inventory report',
  description: `This report summarizes the results of the Economic Order Quantity (EOQ) simulation, including optimal order size, total annual cost, cost breakdown, and replenishment frequency.

You can select and compare previous EOQ simulation logs to analyze cost behavior across different demand and cost assumptions.

The EOQ curve visualization shows how ordering and holding costs interact, with Q* representing the cost-minimizing equilibrium.

A PDF export option is available to generate a formal cost optimization document for operational and financial review.`,
};

const EOQReportModule = () => {
  const { shop: selectedShop, shopName } = useSelectedShop();
  const logs = useSimulationBitacora(selectedShop?.id);
  const { format } = useCurrency();
  const { formatDate } = useFormats();

  const { products, inventory } = useShopInventoryProducts();

  const [selectedLogCreatedAt, setSelectedLogCreatedAt] = useState<
    string | null
  >(null);

  // Filter only EOQ logs
  const eoqLogs = useMemo(() => {
    return logs.filter((log) => log.type === 'eoq');
  }, [logs]);

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

  // Auto-select latest EOQ log
  useEffect(() => {
    if (eoqLogs.length && !selectedLogCreatedAt) {
      setSelectedLogCreatedAt(eoqLogs[0].createdAt);
    }
  }, [eoqLogs, selectedLogCreatedAt]);

  // Determine selected log
  const selectedLog = useMemo(() => {
    if (!eoqLogs.length) return null;

    return (
      eoqLogs.find((log) => log.createdAt === selectedLogCreatedAt) ??
      eoqLogs[0]
    );
  }, [eoqLogs, selectedLogCreatedAt]);

  // Build report
  const curve = selectedLog
    ? generateEOQCurve(selectedLog.request, selectedLog.data)
    : null;

  const report = useMemo(() => {
    if (!selectedLog) return null;

    return buildEOQReport(
      selectedLog,
      productOptions,
      curve,
      format,
      formatDate,
      shopName
    );
  }, [selectedLog, productOptions, curve, format, formatDate, shopName]);

  const breadcrumbTrail = useMemo(
    () => [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Reports', path: '/dashboard/reports' },
      { label: 'EOQ Report' },
    ],
    []
  );

  if (!selectedShop) {
    return (
      <ModuleContainer
        title="EOQ Report"
        subtitle="Cost optimization summary"
        breadcrumbTrail={breadcrumbTrail}
      >
        <NoSelectShop />
      </ModuleContainer>
    );
  }

  if (!eoqLogs.length) {
    return (
      <ModuleContainer
        title="EOQ Report"
        subtitle="Cost optimization summary"
        breadcrumbTrail={breadcrumbTrail}
        selectedUserCase={selectedShop.name}
      >
        <NoSimulationLogs
          simulationType="EOQ"
          navigateTo="/dashboard/simulations/eoq"
        />
      </ModuleContainer>
    );
  }

  return (
    <ModuleContainer
      title="EOQ Report"
      subtitle="Cost optimization summary"
      breadcrumbTrail={breadcrumbTrail}
      userCases={eoqLogs.map((log) => log.createdAt)}
      selectedUserCase={selectedLog?.createdAt ?? null}
      onUserCaseChange={(value) => {
        setSelectedLogCreatedAt(value);
      }}
      renderUserCaseItem={(createdAt) => {
        const log = eoqLogs.find((l) => l.createdAt === createdAt);
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
      actions={<Info content={EOQ_REPORT_INFO} />}
    >
      {report && <GenericReportView report={report} />}
    </ModuleContainer>
  );
};

export default EOQReportModule;
