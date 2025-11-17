
import { z } from "zod"

export interface Product{
    id?: number;
    name: string;
    category?:string;
    description?: string;
    unitCost: number;
    unitPrice: number;
}


export const productSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  category: z.string().optional(),
  description: z.string().optional(),
  unitCost: z.number(),
  unitPrice: z.number(),
})
export type ProductZ = z.infer<typeof productSchema>;