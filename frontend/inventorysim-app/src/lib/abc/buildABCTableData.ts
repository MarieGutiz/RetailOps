import type { ABCData, ABCTableRow } from '@/types/abc';

// Transforms raw product data into ABC table rows based on thresholds

const DEFAULT_THRESHOLDS = { a: 80, b: 95, c: 100 };

export const buildABCTableData = (
  products: ABCData[],
  thresholds = DEFAULT_THRESHOLDS
): ABCTableRow[] => {
  if (!products.length) return [];

  // 1. Add total value
  const withValue = products.map((p) => ({
    ...p,
    totalValue: p.product.unitPrice * p.quantity,
  }));

  // 2. Sort descending
  const sorted = [...withValue].sort((a, b) => b.totalValue - a.totalValue);

  // 3. Total value
  const total = sorted.reduce((sum, p) => sum + p.totalValue, 0);

  let cumulative = 0;

  // 4. Build rows with category
  return sorted.map((p) => {
    cumulative += (p.totalValue / total) * 100;

    let category: 'A' | 'B' | 'C';

    if (cumulative <= thresholds.a) category = 'A';
    else if (cumulative <= thresholds.b) category = 'B';
    else category = 'C';

    return {
      product: p.product,
      quantity: p.quantity,
      totalValue: p.totalValue,
      cumulative,
      category,
    };
  });
};

export const ABC_SCENARIOS = {
  Baseline: { a: 80, b: 95, c: 100 }, // default: 80% A, next 15% B, last 5% C
  Optimistic: { a: 85, b: 97, c: 100 }, // more products get class A
  Pessimistic: { a: 70, b: 90, c: 100 }, // fewer products get class A
};
