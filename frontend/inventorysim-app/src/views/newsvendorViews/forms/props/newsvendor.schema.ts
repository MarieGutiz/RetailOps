import { z } from "zod";


export const newsvendorSchema = z
  .object({
    // Integer demand
    meanDemand: z
      .number()
      .int("Mean demand must be an integer")
      .positive("Mean demand must be greater than 0"),

    stdDeviation: z
      .number()
      .int("Standard deviation must be an integer")
      .nonnegative("Standard deviation cannot be negative"),


    price: z.number().positive("Price must be greater than 0"),
    cost: z.number().positive("Cost must be greater than 0"),

    salvageValue: z.number().nonnegative().optional(),
    penalty: z.number().nonnegative().optional(),

    simulationRuns: z.number().int().min(100, "Minimum 100 runs"),
    saveToHistory: z.boolean(),

    mode: z.enum(["CLASSIC", "ADVANCED"]),
  })
  // Advanced mode requires at least one value
  .refine(
    (data) => {
      if (data.mode === "ADVANCED") {
        return (data.salvageValue ?? 0) > 0 || (data.penalty ?? 0) > 0;
      }
      return true;
    },
    {
      message: "Advanced mode requires salvage value or penalty",
      path: ["mode"],
    }
  )
  // New: price must be greater than cost
  .refine(
    (data) => data.price > data.cost,
    {
      message: "Price must be greater than cost",
      path: ["price"],
    }
  );



export type NewsvendorFormValues = z.infer<typeof newsvendorSchema>;
