import type {
  NewsvendorPdfPayload,
  NewsvendorRequestPdfDto,
} from '@/types/newsvendor-pdf-backend';
import type { SimulationLogEntry } from '@/views/Overview/hooks/useSimulationBitacora';

/**
 * Map a frontend simulation log into the PDF payload
 */
export const mapLogToNewsvendorPdfPayload = (
  log: Extract<SimulationLogEntry, { type: 'newsvendor' }>,
  shopName?: string
): NewsvendorPdfPayload => {
  const request: NewsvendorRequestPdfDto = {
    productName: log.request.productName,
    sku: log.sku,
    shopId: log.shopId,
    shopName: shopName ?? 'Shop', //pass shopname
    createdAt: log.createdAt,
    meanDemand: log.request.meanDemand,
    stdDeviation: log.request.stdDeviation,
    price: log.request.price,
    cost: log.request.cost,
    salvageValue: log.request.salvageValue,
    penalty: log.request.penalty,
    model: 'NEWSVENDOR',
  };

  return {
    request,
    response: log.data, // already the simulation results
  };
};
