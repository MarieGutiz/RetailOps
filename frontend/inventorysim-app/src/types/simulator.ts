import type { ABCResult, ABCTableRow } from './abc';
import type { AbcResponseDto } from './abc-backend';

export type SimulatorABCResult =
  | ABCResult // frontend guest simulation
  | AbcResponseDto; // backend simulation (classic, multi)

export interface SimulatorABCOutput {
  result: SimulatorABCResult;
  table: ABCTableRow[];
}
