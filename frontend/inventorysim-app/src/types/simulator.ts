import type { ABCResult, ABCTableRow } from "./abc";

export interface SimulatorABCOutput {
  result: ABCResult;
  table: ABCTableRow[];
}