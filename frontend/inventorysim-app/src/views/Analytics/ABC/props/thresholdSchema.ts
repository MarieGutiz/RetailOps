import { z } from "zod";

export const thresholdSchema = z
  .object({
    a: z.number().min(1).max(100),
    b: z.number().min(1).max(100),
  })
  .refine((data) => data.a < data.b, {
    message: "Threshold A must be less than Threshold B",
    path: ["b"],
  });