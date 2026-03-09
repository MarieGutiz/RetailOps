import type { SimulationLogEntry } from '@/views/Overview/hooks/useSimulationBitacora';
import type { BaseReport } from '../types/report.types';

export const buildNewsvendorReport = (
  log: Extract<SimulationLogEntry, { type: 'newsvendor' }>,
  productOptions: {
    name: string;
    sku: string;
  }[],
  formatCurrency: (value: number) => string,
  formatDate: (dateString: string | Date) => string,
  shopName: string = 'Shop'
): BaseReport => {
  const { data, request, shopId, createdAt } = log;
  const product = productOptions.find(
    (p) => p.name === log.request.productName
  );

  const sku = product?.sku ?? 'N/A';
  const productName = product?.name ?? log.request.productName;

  // Backend returns decimal probability (0–1)
  const service = data.serviceLevel;
  const stockoutRisk = 1 - service;

  return {
    model: 'newsvendor',
    shopId,
    generatedAt: formatDate(new Date()),

    header: {
      title: 'Newsvendor Analysis',
      subtitle: `${productName} (SKU: ${sku}) — ${shopName}`,
      context: `Simulation run on ${formatDate(createdAt)} • Achieved service level: ${(service * 100).toFixed(2)}%`,
    },

    kpis: [
      {
        label: 'Optimal Quantity (Q*)',
        value: Math.round(data.optimalOrderQuantity),
        hint: 'Profit-maximizing order quantity',
      },
      {
        label: 'Expected Profit',
        value: formatCurrency(data.expectedProfit),
        severity: data.expectedProfit > 0 ? 'positive' : 'warning',
      },
      {
        label: 'Service Level Achieved',
        value: `${(service * 100).toFixed(2)}%`,
      },
      {
        label: 'Stockout Probability',
        value: `${(stockoutRisk * 100).toFixed(2)}%`,
        severity: stockoutRisk > 0.2 ? 'critical' : 'neutral',
      },
    ],

    sections: [
      {
        title: 'Input Parameters',
        type: 'parameters',
        payload: [
          { label: 'Mean Demand', value: request.meanDemand },
          { label: 'Std Deviation', value: request.stdDeviation },
          { label: 'Selling Price', value: request.price, isCurrency: true },
          { label: 'Unit Cost', value: request.cost, isCurrency: true },
          {
            label: 'Salvage Value',
            value: request.salvageValue,
            isCurrency: true,
          },
          { label: 'Penalty Cost', value: request.penalty, isCurrency: true },
        ],
      },
      {
        title: 'Risk Distribution',
        type: 'chart',
        payload: {
          type: 'demandRisk',
          mean: request.meanDemand,
          std: request.stdDeviation,
          serviceLevel: service,
        },
      },
      {
        title: 'Interpretation',
        type: 'text',
        payload:
          stockoutRisk > 0.2
            ? 'High stockout probability. Consider increasing service level to reduce unmet demand risk.'
            : 'Risk profile within acceptable operational range.',
      },
    ],
  };
};
