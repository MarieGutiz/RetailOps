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
    product: z.custom<Product>(), 
    salesValue: z.number()
      .min(0.01, "Sales value must be greater than zero"),

    demandFrequency: z.number()
      .min(0, "Demand frequency must be zero or greater"),
      })
    ).min(1, "Select at least one product"),

});

// ─────────── Type inference for form values ───────────
export type AbcFormValues = z.infer<typeof abcSchema>;