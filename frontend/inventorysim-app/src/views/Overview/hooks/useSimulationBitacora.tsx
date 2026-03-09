import { useSimulationStore } from '@/store/simulations/useSimulationStore';
import type { AbcRequestDto, AbcResponseDto } from '@/types/abc-backend';
import type { EoqRequest, EoqResponse } from '@/types/eoq-backend';
import type {
  NewsvendorRequest,
  NewsvendorResponse,
} from '@/types/newsvendor-backend';
import { useMemo } from 'react';

// ─── SimulationLogEntry Types ───
export type SimulationLogEntry =
  | {
      type: 'newsvendor';
      shopId: string;
      product: string;
      sku: string;
      createdAt: string;
      data: NewsvendorResponse;
      request: NewsvendorRequest;
    }
  | {
      type: 'eoq';
      shopId: string;
      product: string;
      sku: string;
      createdAt: string;
      data: EoqResponse;
      request: EoqRequest;
    }
  | {
      type: 'abc';
      shopId: string;
      simId: string;
      createdAt: string;
      data: AbcResponseDto;
      request: AbcRequestDto;
    };

// ─── Type Guards ───
export const isNewsvendorLog = (
  log: SimulationLogEntry
): log is Extract<SimulationLogEntry, { type: 'newsvendor' }> =>
  log.type === 'newsvendor';

export const isEoqLog = (
  log: SimulationLogEntry
): log is Extract<SimulationLogEntry, { type: 'eoq' }> => log.type === 'eoq';

export const isAbcLog = (
  log: SimulationLogEntry
): log is Extract<SimulationLogEntry, { type: 'abc' }> => log.type === 'abc';

// ─── Full Bitácora Hook ───
/**
 * Custom hook to retrieve all simulation logs for a given shop.
 * Aggregates Newsvendor, EOQ, and ABC simulations into a single array.
 * Sorted by creation date, newest first.
 *
 * @param shopId - ID of the shop to filter logs
 * @returns Array of SimulationLogEntry objects
 */

export const useSimulationBitacora = (shopId?: string) => {
  const { newsvendorSimulations, eoqSimulations, abcSimulations } =
    useSimulationStore();

  return useMemo<SimulationLogEntry[]>(() => {
    if (!shopId) return [];

    const logs: SimulationLogEntry[] = [];

    // ─── Newsvendor ───
    const nv = newsvendorSimulations[shopId] ?? {};
    Object.entries(nv).forEach(([sku, entry]) => {
      if (!entry.request || !entry.response) return; // safety
      logs.push({
        type: 'newsvendor',
        shopId,
        sku,
        product: entry.request.productName,
        createdAt: entry.createdAt,
        data: entry.response,
        request: entry.request,
      });
    });

    // ─── EOQ ───
    const eoq = eoqSimulations[shopId] ?? {};
    Object.entries(eoq).forEach(([sku, entry]) => {
      logs.push({
        type: 'eoq',
        shopId,
        sku,
        product: entry.request.productName,
        createdAt: entry.createdAt,
        data: entry.response,
        request: entry.request,
      });
    });

    // ─── ABC ───
    const abc = abcSimulations[shopId] ?? {};
    Object.entries(abc).forEach(([simId, entry]) => {
      logs.push({
        type: 'abc',
        shopId,
        simId,
        createdAt: entry.createdAt,
        data: entry.response,
        request: entry.request,
      });
    });

    // Sort newest first
    return logs.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [shopId, newsvendorSimulations, eoqSimulations, abcSimulations]);
};

// ─── Filtered Hook: Only Newsvendor Logs ───
export const useNewsvendorBitacora = (shopId?: string) => {
  const logs = useSimulationBitacora(shopId);
  return useMemo(() => logs.filter(isNewsvendorLog), [logs]);
};

// ─── Filtered Hook: Only Newsvendor Logs ───
export const useEoqBitacora = (shopId?: string) => {
  const logs = useSimulationBitacora(shopId);
  return useMemo(() => logs.filter(isEoqLog), [logs]);
};

// ─── Filtered Hook: Only Newsvendor Logs ───
export const useAbcBitacora = (shopId?: string) => {
  const logs = useSimulationBitacora(shopId);
  return useMemo(() => logs.filter(isAbcLog), [logs]);
};
