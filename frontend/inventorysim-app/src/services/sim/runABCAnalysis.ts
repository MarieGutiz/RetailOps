import type { ABCData, ABCResult } from "@/types/abc";

/**
 * Calculates ABC analysis based on total value = price * quantity
 */
export const runABCAnalysis = (products: ABCData[]): ABCResult => {
  if (!products.length) {
    return { categoryA: [], categoryB: [], categoryC: [], summary: { totalItems: 0, totalValue: 0 } };
  }

  // 1. Calculate total value for each product
  const productsWithValue = products.map((p) => ({
    ...p,
    totalValue: p.product.unitPrice * p.quantity,
  }));

  // 2. Sort by total value (descending)
  const sorted = [...productsWithValue].sort((a, b) => b.totalValue - a.totalValue);

  // 3. Calculate cumulative percentage
  const total = sorted.reduce((sum, p) => sum + p.totalValue, 0);
  let cumulative = 0;

  const withCumulative = sorted.map((p) => {
    cumulative += (p.totalValue / total) * 100;
    return { ...p, cumulative };
  });

  // 4. Classify into A, B, C categories (return only Product[])
  const categoryA = withCumulative.filter((p) => p.cumulative <= 80).map((p) => p.product);
  const categoryB = withCumulative.filter((p) => p.cumulative > 80 && p.cumulative <= 95).map((p) => p.product);
  const categoryC = withCumulative.filter((p) => p.cumulative > 95).map((p) => p.product);

  return {
    categoryA,
    categoryB,
    categoryC,
    summary: {
      totalItems: products.length,
      totalValue: total,
    },
  };
};