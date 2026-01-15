import type { ABCTableRow } from "@/types/abc";
import type { AbcResponseDto } from "@/types/abc-backend";
import { floristItemToProduct, mapAbcResponseToTable } from "./mapper/abcBackendMapper";

const floristMockResponse: AbcResponseDto = {
  items: [
    { productName: "Standard Vase", sku: "FLR-STANDARDVASE", salesValue: 20903.38, unitPrice: 6.73, unitCost: 5.61, rank: 1, cumulativePct: 19.17, category: "A" },
    { productName: "Tulips", sku: "FLR-TULIPS", salesValue: 17808.44, unitPrice: 2.99, unitCost: 2.49, rank: 2, cumulativePct: 35.51, category: "A" },
    { productName: "Orchids", sku: "FLR-ORCHIDS", salesValue: 20094.0, unitPrice: 12.75, unitCost: 9.81, rank: 3, cumulativePct: 53.94, category: "A" },
    { productName: "Roses", sku: "FLR-ROSES", salesValue: 13186.0, unitPrice: 2.0, unitCost: 1.67, rank: 4, cumulativePct: 66.03, category: "A" },
    { productName: "Flower Food", sku: "FLR-FLOWERFOOD", salesValue: 2056.01, unitPrice: 0.11, unitCost: 0.1, rank: 5, cumulativePct: 67.92, category: "A" },
    { productName: "Floral Foam", sku: "FLR-FLORALFOAM", salesValue: 8851.68, unitPrice: 1.08, unitCost: 0.98, rank: 6, cumulativePct: 76.04, category: "A" },
    { productName: "Ribbon", sku: "FLR-RIBBON", salesValue: 2414.51, unitPrice: 0.17, unitCost: 0.15, rank: 7, cumulativePct: 78.25, category: "A" },
    { productName: "Proteas", sku: "FLR-PROTEAS", salesValue: 11815.79, unitPrice: 12.53, unitCost: 9.64, rank: 8, cumulativePct: 89.09, category: "B" },
    { productName: "Premium Vase", sku: "FLR-PREMIUMVASE", salesValue: 11897.8, unitPrice: 38.38, unitCost: 29.52, rank: 9, cumulativePct: 100.0, category: "C" },
  ],
  summary: {
    totalValue: 109027.61,
    a: { count: 7, valuePct: 78.25 },
    b: { count: 1, valuePct: 10.84 },
    c: { count: 1, valuePct: 10.91 },
  }
};


// test function
export function testFloristFlowLocal() {
  console.log("=== Starting Local Florist ABC Test ===");

  try {
    console.log("Step 1: Using mock florist response:");
    console.log(floristMockResponse);

    // -------------------------------
    // MANUAL BASELINE (what you already had)
    // -------------------------------
    console.log("Step 2A: Manual mapping (baseline)...");
    const manualTable: ABCTableRow[] = floristMockResponse.items.map(item => {
      const product = floristItemToProduct(item);
      return {
        product,
        quantity: 1,
        totalValue: item.salesValue,
        cumulative: Number(item.cumulativePct),
        category: item.category,
      };
    });

    console.table(
      manualTable.map(row => ({
        sku: row.product.sku,
        name: row.product.name,
        category: row.category,
        totalValue: row.totalValue,
        cumulative: row.cumulative,
        source: row.product.source,
      }))
    );

    // -------------------------------
    // REAL MAPPER TEST (IMPORTANT PART)
    // -------------------------------
    console.log("Step 2B: Testing mapAbcResponseToTable...");
    const mapperTable = mapAbcResponseToTable(floristMockResponse);

    console.table(
      mapperTable.map(row => ({
        sku: row.product.sku,
        name: row.product.name,
        category: row.category,
        totalValue: row.totalValue,
        cumulative: row.cumulative,
        source: row.product.source,
      }))
    );

    // -------------------------------
    // SANITY CHECK
    // -------------------------------
    console.log("Step 3: Sanity check (row count)");
    console.log({
      manualRows: manualTable.length,
      mapperRows: mapperTable.length,
    });

    console.log("Step 4: Summary from response:");
    console.log(floristMockResponse.summary);

    console.log("=== Local Florist ABC Test Complete ===");
  } catch (err) {
    console.error("Error during Local Florist ABC test:", err);
  }
}
