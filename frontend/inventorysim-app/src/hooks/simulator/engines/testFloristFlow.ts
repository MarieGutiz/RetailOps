import type { ABCTableRow } from "@/types/abc";
import type { AbcResponseDto } from "@/types/abc-backend";
import {  mapAbcResponseToTable } from "./mapper/abcBackendMapper";
import { runFloristABC } from "./floristABC";

const floristMockResponse: AbcResponseDto = {
  items: [
    {
      product: {
        id: null,
        name: "Roses",
        sku: "FLR-ROSES",
        category: "FRESH_FLOWERS",
        description: "FRESH_FLOWERS florist item",
        unitCost: 1.95,
        unitPrice: 2.34,
      },
      salesValue: 17737.2,
      rank: 1,
      cumulativePct: 20.32,
      abcCategoryType: "A",
    },
    {
      product: {
        id: null,
        name: "Floral Foam",
        sku: "FLR-FLORALFOAM",
        category: "FLORAL_SUPPLIES",
        description: "FLORAL_SUPPLIES florist item",
        unitCost: 0.8,
        unitPrice: 0.88,
      },
      salesValue: 10136.72,
      rank: 2,
      cumulativePct: 31.94,
      abcCategoryType: "A",
    },
    {
      product: {
        id: null,
        name: "Flower Food",
        sku: "FLR-FLOWERFOOD",
        category: "PLANT_CARE_PRODUCTS",
        description: "PLANT_CARE_PRODUCTS florist item",
        unitCost: 0.05,
        unitPrice: 0.06,
      },
      salesValue: 1482.54,
      rank: 3,
      cumulativePct: 33.63,
      abcCategoryType: "A",
    },
    {
      product: {
        id: null,
        name: "Tulips",
        sku: "FLR-TULIPS",
        category: "FRESH_FLOWERS",
        description: "FRESH_FLOWERS florist item",
        unitCost: 1.71,
        unitPrice: 2.05,
      },
      salesValue: 11238.1,
      rank: 4,
      cumulativePct: 46.51,
      abcCategoryType: "A",
    },
    {
      product: {
        id: null,
        name: "Ribbon",
        sku: "FLR-RIBBON",
        category: "FLORAL_SUPPLIES",
        description: "FLORAL_SUPPLIES florist item",
        unitCost: 0.35,
        unitPrice: 0.39,
      },
      salesValue: 5636.67,
      rank: 5,
      cumulativePct: 52.97,
      abcCategoryType: "A",
    },
    {
      product: {
        id: null,
        name: "Premium Vase",
        sku: "FLR-PREMIUMVASE",
        category: "DECORATIVE_CONTAINERS",
        description: "DECORATIVE_CONTAINERS florist item",
        unitCost: 28.88,
        unitPrice: 37.54,
      },
      salesValue: 12275.58,
      rank: 6,
      cumulativePct: 67.03,
      abcCategoryType: "A",
    },
    {
      product: {
        id: null,
        name: "Orchids",
        sku: "FLR-ORCHIDS",
        category: "FRESH_FLOWERS",
        description: "FRESH_FLOWERS florist item",
        unitCost: 8.06,
        unitPrice: 10.48,
      },
      salesValue: 11454.64,
      rank: 7,
      cumulativePct: 80.16,
      abcCategoryType: "B",
    },
    {
      product: {
        id: null,
        name: "Standard Vase",
        sku: "FLR-STANDARDVASE",
        category: "DECORATIVE_CONTAINERS",
        description: "DECORATIVE_CONTAINERS florist item",
        unitCost: 4.35,
        unitPrice: 5.22,
      },
      salesValue: 9296.82,
      rank: 8,
      cumulativePct: 90.81,
      abcCategoryType: "B",
    },
    {
      product: {
        id: null,
        name: "Proteas",
        sku: "FLR-PROTEAS",
        category: "FRESH_FLOWERS",
        description: "FRESH_FLOWERS florist item",
        unitCost: 8.65,
        unitPrice: 11.25,
      },
      salesValue: 8021.25,
      rank: 9,
      cumulativePct: 100.0,
      abcCategoryType: "C",
    },
  ],
  summary: {
    totalValue: 87279.52,
    a: { count: 6, valuePct: 67.03 },
    b: { count: 2, valuePct: 23.78 },
    c: { count: 1, valuePct: 9.19 },
  },
};


// test function
export function testFloristFlowLocal() {
  console.log("=== Starting Local Florist ABC Test ===");

  try {
    console.log("Step 1: Using mock backend response");
    console.log(floristMockResponse);

    // -------------------------------
    // MAPPER UNDER TEST
    // -------------------------------
    console.log("Step 2: Mapping backend response to table");
    const table: ABCTableRow[] = mapAbcResponseToTable(floristMockResponse);

    console.table(
      table.map(row => ({
        sku: row.product.sku,
        name: row.product.name,
        abcCategory: row.category,
        totalValue: row.totalValue,
        cumulative: row.cumulative,
      }))
    );

    // -------------------------------
    // SANITY CHECKS
    // -------------------------------
    console.log("Step 3: Sanity checks");
    console.log({
      rows: table.length,
      expectedRows: floristMockResponse.items.length,
    });

    console.log("Step 4: Summary (backend truth)");
    console.log(floristMockResponse.summary);

    console.log("=== Local Florist ABC Test Complete ===");
  } catch (err) {
    console.error("Error during Local Florist ABC test:", err);
  }
}


///Test endpoint
export async function testFloristEndpointLive() {
  console.log("Starting LIVE florist ABC endpoint test");

  try {
    const output = await runFloristABC("multi");

    console.log("Raw backend response:");
    console.log(output.result);

    console.log("Mapped table:");
    console.table(
      output.table.map(row => ({
        sku: row.product.sku,
        name: row.product.name,
        abcCategory: row.category,
        totalValue: row.totalValue,
        cumulative: row.cumulative,
      }))
    );

    console.log("Live florist ABC test finished successfully");
  } catch (err) {
    console.error("Live florist ABC test failed:", err);
  }
}