import api from "@/services/api/api";
import type { AbcResponseDto, SimulationType } from "@/types/abc-backend";
import type { SimulatorABCOutput } from "@/types/simulator";
import { mapAbcResponseToTable } from "./mapper/abcBackendMapper";

export async function runFloristABC(
  mode: SimulationType = "classic"
): Promise<SimulatorABCOutput> {

  const { data } = await api.get<AbcResponseDto>(
    `/simulations/florist/abc?mode=${mode.toUpperCase()}`
  );

  const table = mapAbcResponseToTable(data);

  return {
    result: data,
    table,
  };
}
