import type { AbcItemDto, SimulationType } from './abc-backend';
import type { SimulationRequestDto } from './pdf-backend';

export interface AbcRequestPdfDto extends SimulationRequestDto {
  mode: SimulationType; // ABC mode (CLASSIC / MULTI)
  items: AbcItemDto[];
}

export interface AbcPdfPayload {
  request: AbcRequestPdfDto;
  shopName: string;
}
