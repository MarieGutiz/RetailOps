import type { AbcRequestDto, AbcResponseDto } from '@/types/abc-backend';
import api from './api';

/**
 * Base path for simulator module
 * Matches backend: /api/simulator/abc
 */
const SIMULATOR_BASE = '/simulator';
const ABC_BASE = `${SIMULATOR_BASE}/abc`;

/**
 * Run ABC Analysis
 * → Returns ranked items and summary (A/B/C breakdown)
 *
 * If username is provided and not "guest",
 * backend will persist the simulation.
 */
export const simulateAbc = async (
  data: AbcRequestDto,
  simId: string,
  shopName: string
): Promise<AbcResponseDto> => {
  try {
    const response = await api.post(ABC_BASE, data, {
      params: { simId, shopName },
    });

    return response.data;
  } catch (error) {
    console.error('Error running ABC analysis:', error);
    throw error;
  }
};
