import { z } from 'zod';

// ─────────── EOQ Form Validation Schema ───────────
export const eoqSchema = z
  .object({
    productName: z.string().min(1, 'Please select a product'),

    demand: z
      .number()
      .int('Demand must be an integer')
      .nonnegative('Demand must be ≥ 0'),

    cost: z.number().positive('Setup cost must be > 0'),

    holdingCost: z.number().nonnegative('Holding cost must be ≥ 0'),

    saveToHistory: z.boolean(),
  })
  // Optional refinement: for EOQ, demand must be > 0 if cost > 0
  .refine((data) => data.demand > 0 || data.cost === 0, {
    message: 'Demand must be greater than 0 if there is a setup cost',
    path: ['demand'],
  });

// ─────────── Type inference for form values ───────────
export type EoqFormValues = z.infer<typeof eoqSchema>;
