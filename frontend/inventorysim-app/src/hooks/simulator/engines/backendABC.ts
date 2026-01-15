import { analyzeABC } from "@/services/api/abc.api";
import type { UserPolicy } from "@/store/user/useUserStore";
import type { AbcRequestDto, SimulationType } from "@/types/abc-backend";
import type { Product } from "@/types/products";
import type { SimulatorABCOutput } from "@/types/simulator";
import { mapAbcResponseToTable } from "./mapper/abcBackendMapper";

export function toAbcRequest(
  products: Product[],
  user: UserPolicy,
  mode: SimulationType
): AbcRequestDto {

  if (mode === "florist") {
    return { mode };
  }

  return {
    mode,
    username: user.username ?? "Guest",
    items: products.map(p => ({
      productName: p.name,
      sku: p.sku,
      unitCost: p.unitCost,
      unitPrice: p.unitPrice,
      salesValue: p.unitPrice * ((p as any).quantity ?? 1),
      demandFrequency: (p as any).quantity ?? 1,
    })),
  };
}


export async function runBackendABC(
  products: Product[],
  user: UserPolicy,
  mode: SimulationType
): Promise<SimulatorABCOutput> {

  const dto = toAbcRequest(products, user, mode);
  const response = await analyzeABC(dto); // AbcResponseDto

  const table = mapAbcResponseToTable(response, products);

  return {
    result: response, // keep raw backend response
    table,            // frontend-ready
  };
}

