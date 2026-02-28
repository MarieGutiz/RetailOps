import type { Product } from "@/types/products";
import { z } from "zod";

// ─────────── ABC Form Validation Schema ───────────
export const abcSchema = z.object({
  mode: z.enum(["classic", "multi"], {
    message: "Please select a simulation mode",
  }),

  saveToHistory: z.boolean(),

  items: z.array(
    z.object({
      product: z.object({
        id: z.union([z.number(), z.string()]).nullable().optional(),
        name: z.string(),
        sku: z.string().nullable().optional(),
        category: z.string().nullable().optional(),
        unitPrice: z.number().optional(),
        unitCost: z.number().optional(),
      }),

      salesValue: z.number()
        .nonnegative("Sales value is required and must be greater than zero")
        .min(0.01, "Sales value must be greater than zero"),

      demandFrequency: z.number()
        .nonnegative("Demand frequency is required and must be greater than zero")
        .min(0, "Demand frequency must be zero or greater"),
    })
  ).min(1, "Select at least one product"),
});


// ─────────── Type inference for form values ───────────
export type AbcFormValues = z.infer<typeof abcSchema>;