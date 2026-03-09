import { z } from 'zod';

export const newsvendorSchema = z
  .object({
    // Demand parameters
    meanDemand: z
      .number()
      .int('Mean demand must be an integer')
      .min(1, 'Mean demand must be at least 1'),

    stdDeviation: z
      .number()
      .int('Standard deviation must be an integer')
      .min(0, 'Standard deviation cannot be negative'),

    // Economic parameters
    price: z.number().positive('Selling price must be greater than 0'),

    cost: z.number().positive('Unit cost must be greater than 0'),

    salvageValue: z
      .number()
      .min(0, 'Salvage value cannot be negative')
      .optional(),

    penalty: z.number().min(0, 'Penalty cannot be negative').optional(),

    // Simulation settings
    simulationRuns: z
      .number()
      .int('Simulation runs must be an integer')
      .min(100, 'Minimum 100 simulation runs'),

    saveToHistory: z.boolean(),

    mode: z.enum(['CLASSIC', 'ADVANCED']),
  })

  // ─────────────────────────────
  // Economic constraints
  // ─────────────────────────────

  // price > cost
  .refine((data) => data.price > data.cost, {
    message: 'Selling price must be greater than unit cost',
    path: ['price'],
  })

  // salvage ≤ cost
  .refine(
    (data) => data.salvageValue === undefined || data.salvageValue <= data.cost,
    {
      message: 'Salvage value cannot exceed unit cost',
      path: ['salvageValue'],
    }
  )

  // penalty ≤ price
  .refine((data) => data.penalty === undefined || data.penalty <= data.price, {
    message: 'Penalty cannot exceed selling price',
    path: ['penalty'],
  })

  // Advanced mode requires at least one parameter
  .refine(
    (data) => {
      if (data.mode === 'ADVANCED') {
        return (data.salvageValue ?? 0) > 0 || (data.penalty ?? 0) > 0;
      }
      return true;
    },
    {
      message: 'Advanced mode requires either a salvage value or a penalty',
      path: ['mode'],
    }
  );

export type NewsvendorFormValues = z.infer<typeof newsvendorSchema>;
