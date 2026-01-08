import type { ABCData, ABCTableRow } from "@/types/abc";

export const buildABCTableData = (products: ABCData[]): ABCTableRow[] => {
  if (!products.length) return [];  

    // 1. Add total value
    const withValue = products.map((p) => ({
        ...p,
        totalValue: p.product.unitPrice * p.quantity,
    }));

    // 2. Sort descending
    const sorted = [...withValue].sort(
        (a, b) => b.totalValue - a.totalValue
    );

    // 3. Total value
    const total = sorted.reduce((sum, p) => sum + p.totalValue, 0);

    let cumulative = 0;

    // 4. Build rows with category
    return sorted.map((p) => {
        cumulative += (p.totalValue / total) * 100;

        let category: "A" | "B" | "C";
        if (cumulative <= 80) category = "A";
        else if (cumulative <= 95) category = "B";
        else category = "C";

        return {
        product: p.product,
        quantity: p.quantity,
        totalValue: p.totalValue,
        cumulative,
        category,
        };
    });
};