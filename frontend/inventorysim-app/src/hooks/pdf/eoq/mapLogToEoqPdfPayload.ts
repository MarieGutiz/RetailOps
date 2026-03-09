import type { EoqCurveResponse } from '@/types/eoq-backend';
import type { EoqPdfPayload, EoqRequestPdfDto } from '@/types/eoq-pdf-backend';
import type { SimulationLogEntry } from '@/views/Overview/hooks/useSimulationBitacora';

/**
 * Map a frontend simulation log into the PDF payload
 */

export const mapLogToEoqPdfPayload = (
  log: Extract<SimulationLogEntry, { type: 'eoq' }>,
  curve: EoqCurveResponse | null,
  shopName?: string
): EoqPdfPayload => {
  const request: EoqRequestPdfDto = {
    model: 'EOQ',
    shopId: log.shopId,
    shopName: shopName ?? 'Shop',
    createdAt: log.createdAt,
    productName: log.request.productName,
    sku: log.sku,
    demand: log.request.demand,
    cost: log.request.cost,
    holdingCost: log.request.holdingCost,
  };

  return {
    request,
    response: log.data,
    curve: curve!, // ensure it's provided
    shopName: shopName ?? 'Shop',
  };
};
