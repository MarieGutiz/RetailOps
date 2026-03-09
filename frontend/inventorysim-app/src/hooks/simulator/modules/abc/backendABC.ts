import type { UserPolicy } from '@/store/user/useUserStore';
import type { AbcRequestDto, SimulationType } from '@/types/abc-backend';
import type { Product } from '@/types/products';

// Mapping function to conver bkend response to frontend table format

export function toAbcRequest(
  products: Product[],
  user: UserPolicy,
  mode: SimulationType
): AbcRequestDto {
  return {
    mode,
    account:
      user.userType === 'Registered' && user.id
        ? { id: Number(user.id) }
        : undefined,
        
    items: products.map((p) => ({
      product: {
        id: p.id ?? null,
        name: p.name,
        sku: p.sku,
        category: p.category,
        description: p.description,
        unitCost: p.unitCost,
        unitPrice: p.unitPrice,
      },
      demandFrequency: (p as any).quantity ?? 1,
      salesValue: p.unitPrice * ((p as any).quantity ?? 1),
    })),
  };
}


