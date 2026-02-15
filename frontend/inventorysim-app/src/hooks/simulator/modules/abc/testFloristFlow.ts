import type { ABCTableRow } from "@/types/abc";
import type { AbcResponseDto, SimulationType } from "@/types/abc-backend";
import type { ShopType } from "@/types/shop";
import { mapAbcResponseToTable } from "../../engines/mapper/abcBackendMapper";
import { runShopABC } from "./frontendABC";

const floristMockResponse: AbcResponseDto = {
  items: [
    {
      product: {
        id: null,
        name: "Tulips",
        sku: "FLR-TULIPS",
        category: "FRESH_FLOWERS",
        description: "FRESH_FLOWERS florist item",
        unitCost: 2.29,
        unitPrice: 2.75,
      },
      salesValue: 19756.0,
      rank: 1,
      cumulativePct: 18.52,
      abcCategoryType: "A",
      demandFrequency: 7184,
    },
    {
      product: {
        id: null,
        name: "Premium Vase",
        sku: "FLR-PREMIUMVASE",
        category: "DECORATIVE_CONTAINERS",
        description: "DECORATIVE_CONTAINERS florist item",
        unitCost: 28.43,
        unitPrice: 36.96,
      },
      salesValue: 18738.72,
      rank: 2,
      cumulativePct: 36.09,
      abcCategoryType: "A",
      demandFrequency: 507,
    },
    {
      product: {
        id: null,
        name: "Roses",
        sku: "FLR-ROSES",
        category: "FRESH_FLOWERS",
        description: "FRESH_FLOWERS florist item",
        unitCost: 1.91,
        unitPrice: 2.29,
      },
      salesValue: 14108.69,
      rank: 3,
      cumulativePct: 49.32,
      abcCategoryType: "A",
      demandFrequency: 6161,
    },
    {
      product: {
        id: null,
        name: "Orchids",
        sku: "FLR-ORCHIDS",
        category: "FRESH_FLOWERS",
        description: "FRESH_FLOWERS florist item",
        unitCost: 8.77,
        unitPrice: 11.4,
      },
      salesValue: 13851.0,
      rank: 4,
      cumulativePct: 62.3,
      abcCategoryType: "A",
      demandFrequency: 1215,
    },
    {
      product: {
        id: null,
        name: "Proteas",
        sku: "FLR-PROTEAS",
        category: "FRESH_FLOWERS",
        description: "FRESH_FLOWERS florist item",
        unitCost: 9.52,
        unitPrice: 12.38,
      },
      salesValue: 12280.96,
      rank: 5,
      cumulativePct: 73.82,
      abcCategoryType: "A",
      demandFrequency: 992,
    },
    {
      product: {
        id: null,
        name: "Floral Foam",
        sku: "FLR-FLORALFOAM",
        category: "FLORAL_SUPPLIES",
        description: "FLORAL_SUPPLIES florist item",
        unitCost: 0.66,
        unitPrice: 0.73,
      },
      salesValue: 10354.32,
      rank: 6,
      cumulativePct: 83.52,
      abcCategoryType: "B",
      demandFrequency: 14184,
    },
    {
      product: {
        id: null,
        name: "Ribbon",
        sku: "FLR-RIBBON",
        category: "FLORAL_SUPPLIES",
        description: "FLORAL_SUPPLIES florist item",
        unitCost: 0.39,
        unitPrice: 0.43,
      },
      salesValue: 7651.42,
      rank: 7,
      cumulativePct: 90.7,
      abcCategoryType: "B",
      demandFrequency: 17794,
    },
    {
      product: {
        id: null,
        name: "Standard Vase",
        sku: "FLR-STANDARDVASE",
        category: "DECORATIVE_CONTAINERS",
        description: "DECORATIVE_CONTAINERS florist item",
        unitCost: 5.05,
        unitPrice: 6.06,
      },
      salesValue: 7508.34,
      rank: 8,
      cumulativePct: 97.74,
      abcCategoryType: "C",
      demandFrequency: 1239,
    },
    {
      product: {
        id: null,
        name: "Flower Food",
        sku: "FLR-FLOWERFOOD",
        category: "PLANT_CARE_PRODUCTS",
        description: "PLANT_CARE_PRODUCTS florist item",
        unitCost: 0.1,
        unitPrice: 0.11,
      },
      salesValue: 2415.16,
      rank: 9,
      cumulativePct: 100.0,
      abcCategoryType: "C",
      demandFrequency: 21956,
    },
  ],
  summary: {
    totalValue: 106664.61,
    a: {
      count: 5,
      valuePct: 73.82,
    },
    b: {
      count: 2,
      valuePct: 16.88,
    },
    c: {
      count: 2,
      valuePct: 9.3,
    },
  },
};



// test function
export function testFloristFlowLocal() {
  console.log("=== Starting Local Florist ABC Test ===");

  try {
    console.log("Step 1: Using mock backend response");
    console.log(floristMockResponse);

    console.log("Step 2: Mapping backend response to table");
    const table: ABCTableRow[] =
      mapAbcResponseToTable(floristMockResponse);

    console.table(
      table.map(row => ({
        sku: row.product.sku,
        name: row.product.name,
        abcCategory: row.category,
        totalValue: row.totalValue,
        cumulative: row.cumulative,
      }))
    );

    console.log("Step 3: Structural sanity checks");

    console.assert(
      table.length === floristMockResponse.items.length,
      "Row count mismatch"
    );

    console.assert(
      table.every(r => r.product?.sku),
      "Some rows are missing SKU"
    );

    console.assert(
      table.every(r => r.category === "A" || r.category === "B" || r.category === "C"),
      "Invalid ABC category detected"
    );

    console.log("Step 4: Backend summary (truth source)");
    console.log(floristMockResponse.summary);

    console.log("=== Local Florist ABC Test Complete ===");
  } catch (err) {
    console.error("Error during Local Florist ABC test:", err);
  }
}



///Test endpoint
export async function testShopABCLive(
  shop: ShopType,
  mode: SimulationType
) {
  console.log(`LIVE ABC test | shop=${shop} | mode=${mode}`);

  const output = await runShopABC(shop, mode);

  console.log("Raw backend response:");
  console.log(output.result);

  console.table(
    output.table.map(row => ({
      sku: row.product.sku,
      name: row.product.name,
      abc: row.category,
      value: row.totalValue,
      cumulative: row.cumulative
    }))
  );
}

