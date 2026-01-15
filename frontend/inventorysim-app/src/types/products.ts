
import { z } from "zod"

export interface Product{
    id?: string;
    sku?: string;
    name: string;
    category?:string;
    description?: string;
    unitCost: number;
    unitPrice: number;
    source?: string;
}


export const productSchema = z.object({
  id: z.string().optional(),
  sku: z.string().optional(),
  name: z.string(),
  category: z.string().optional(),
  description: z.string().optional(),
  unitCost: z.number(),
  unitPrice: z.number(),
})
export type ProductZ = z.infer<typeof productSchema>;